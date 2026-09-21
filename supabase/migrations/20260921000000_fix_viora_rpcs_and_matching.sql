-- VIORA SC-12: Core RPC and Security Fixes Migration
-- Idempotent, safe update to public schema functions

CREATE OR REPLACE FUNCTION public.is_blood_compatible(p_donor_bg text, p_recipient_bg text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
    d TEXT := UPPER(TRIM(COALESCE(p_donor_bg, '')));
    r TEXT := UPPER(TRIM(COALESCE(p_recipient_bg, '')));
BEGIN
    IF d = '' OR r = '' THEN RETURN FALSE; END IF;
    IF d = 'O-' THEN RETURN TRUE; END IF;
    IF d = 'O+' THEN RETURN r IN ('O+', 'A+', 'B+', 'AB+'); END IF;
    IF d = 'A-' THEN RETURN r IN ('A-', 'A+', 'AB-', 'AB+'); END IF;
    IF d = 'A+' THEN RETURN r IN ('A+', 'AB+'); END IF;
    IF d = 'B-' THEN RETURN r IN ('B-', 'B+', 'AB-', 'AB+'); END IF;
    IF d = 'B+' THEN RETURN r IN ('B+', 'AB+'); END IF;
    IF d = 'AB-' THEN RETURN r IN ('AB-', 'AB+'); END IF;
    IF d = 'AB+' THEN RETURN r = 'AB+'; END IF;
    RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_donor_eligible(p_last_donation_date date)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
    interval_days INTEGER := 90;
BEGIN
    IF p_last_donation_date IS NULL THEN
        RETURN TRUE;
    END IF;
    RETURN (CURRENT_DATE - p_last_donation_date) >= interval_days;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_platform_stats()
RETURNS json
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
    v_total_donors INTEGER;
    v_eligible_donors INTEGER;
    v_ineligible_donors INTEGER;
    v_active_requests INTEGER;
    v_fulfilled_requests INTEGER;
    v_total_matches INTEGER;
    v_accepted_matches INTEGER;
    v_district_stats JSON;
    v_blood_stats JSON;
BEGIN
    SELECT count(*) INTO v_total_donors FROM donors;
    
    SELECT count(*) INTO v_eligible_donors 
    FROM donors 
    WHERE is_donor_eligible(last_donation_date) = TRUE 
      AND (available = 'available' OR available = 'true' OR available = '1');
    
    SELECT count(*) INTO v_ineligible_donors 
    FROM donors 
    WHERE is_donor_eligible(last_donation_date) = FALSE;
    
    SELECT count(*) INTO v_active_requests 
    FROM blood_requests 
    WHERE status IN ('active', 'matched', 'searching');
    
    SELECT count(*) INTO v_fulfilled_requests 
    FROM blood_requests 
    WHERE status = 'fulfilled';
    
    SELECT count(*) INTO v_total_matches FROM request_matches;
    SELECT count(*) INTO v_accepted_matches FROM request_matches WHERE status = 'accepted';

    SELECT json_agg(t) INTO v_district_stats FROM (
        SELECT district, count(*) as donor_count 
        FROM donors 
        GROUP BY district 
        ORDER BY donor_count DESC
    ) t;

    SELECT json_agg(t) INTO v_blood_stats FROM (
        SELECT blood_group, count(*) as count 
        FROM donors 
        GROUP BY blood_group 
        ORDER BY count DESC
    ) t;

    RETURN json_build_object(
        'total_donors', COALESCE(v_total_donors, 0),
        'eligible_donors', COALESCE(v_eligible_donors, 0),
        'ineligible_donors', COALESCE(v_ineligible_donors, 0),
        'active_requests', COALESCE(v_active_requests, 0),
        'fulfilled_requests', COALESCE(v_fulfilled_requests, 0),
        'total_matches', COALESCE(v_total_matches, 0),
        'accepted_matches', COALESCE(v_accepted_matches, 0),
        'district_distribution', COALESCE(v_district_stats, '[]'::json),
        'blood_distribution', COALESCE(v_blood_stats, '[]'::json)
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.create_and_match_blood_request(
    p_requester_name text,
    p_requester_phone text,
    p_blood_group text,
    p_units_required integer DEFAULT 1,
    p_district text DEFAULT 'Ernakulam',
    p_hospital_name text DEFAULT 'Aster Medcity',
    p_urgency text DEFAULT 'urgent',
    p_patient_identifier text DEFAULT 'Patient Emergency',
    p_locality text DEFAULT NULL,
    p_notes text DEFAULT NULL,
    p_required_by timestamp with time zone DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_request_id UUID;
    v_match_count INTEGER := 0;
    v_donor RECORD;
    v_max_matches INTEGER := 6;
    v_notif_title TEXT;
    v_notif_msg TEXT;
    v_matched_donors JSONB := '[]'::jsonb;
BEGIN
    IF p_blood_group IS NULL OR p_district IS NULL OR p_hospital_name IS NULL OR p_requester_phone IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Missing required request fields');
    END IF;

    -- Insert canonical record in blood_requests
    INSERT INTO blood_requests (
        requester_name,
        requester_phone,
        patient_identifier,
        blood_group,
        units_required,
        district,
        hospital_name,
        locality,
        urgency,
        status,
        required_by,
        notes
    ) VALUES (
        p_requester_name,
        p_requester_phone,
        COALESCE(p_patient_identifier, 'Patient Emergency'),
        UPPER(TRIM(p_blood_group)),
        COALESCE(p_units_required, 1),
        p_district,
        p_hospital_name,
        p_locality,
        COALESCE(p_urgency, 'urgent'),
        'active',
        COALESCE(p_required_by, now() + interval '24 hours'),
        p_notes
    ) RETURNING id INTO v_request_id;

    -- Also keep legacy requests table in sync for compatibility
    INSERT INTO requests (
        id,
        requester_name,
        requester_phone,
        blood_group_needed,
        units_needed,
        urgency,
        district,
        locality,
        hospital_name,
        status,
        current_wave
    ) VALUES (
        v_request_id,
        p_requester_name,
        p_requester_phone,
        UPPER(TRIM(p_blood_group)),
        COALESCE(p_units_required, 1),
        COALESCE(p_urgency, 'urgent'),
        p_district,
        COALESCE(p_locality, 'Kakkanad'),
        p_hospital_name,
        'searching',
        1
    ) ON CONFLICT (id) DO NOTHING;

    -- Evaluate and match eligible donors
    FOR v_donor IN 
        SELECT 
            d.id,
            d.name,
            d.blood_group,
            d.district,
            d.locality,
            d.last_donation_date,
            d.trust_score,
            (CASE 
                WHEN LOWER(TRIM(COALESCE(d.locality, ''))) = LOWER(TRIM(COALESCE(p_locality, ''))) THEN 150
                WHEN LOWER(TRIM(COALESCE(d.district, ''))) = LOWER(TRIM(COALESCE(p_district, ''))) THEN 100 
                ELSE 70 
             END +
             CASE 
                WHEN d.blood_group = UPPER(TRIM(p_blood_group)) THEN 20 
                ELSE 10 
             END +
             COALESCE(d.trust_score, 100) / 10
            ) AS computed_rank
        FROM donors d
        WHERE 
            (d.available = 'available' OR d.available = 'true' OR d.available = '1')
            AND is_blood_compatible(d.blood_group, UPPER(TRIM(p_blood_group))) = TRUE
            AND is_donor_eligible(d.last_donation_date) = TRUE
        ORDER BY 
            (LOWER(TRIM(COALESCE(d.locality, ''))) = LOWER(TRIM(COALESCE(p_locality, '')))) DESC,
            (LOWER(TRIM(COALESCE(d.district, ''))) = LOWER(TRIM(COALESCE(p_district, '')))) DESC,
            computed_rank DESC,
            d.created_at ASC
        LIMIT v_max_matches
    LOOP
        INSERT INTO request_matches (
            request_id,
            donor_id,
            match_score,
            eligibility_status,
            notification_status,
            status,
            notified_at
        ) VALUES (
            v_request_id,
            v_donor.id,
            v_donor.computed_rank,
            'eligible',
            'sent',
            'notified',
            now()
        ) ON CONFLICT DO NOTHING;

        v_notif_title := '🩸 Urgent Blood Needed in ' || p_district;
        v_notif_msg := 'A patient at ' || p_hospital_name || ' needs ' || p_blood_group || ' blood (' || COALESCE(p_units_required, 1) || ' units). You are a verified compatible match.';

        INSERT INTO notifications (
            donor_id,
            request_id,
            type,
            title,
            message,
            read
        ) VALUES (
            v_donor.id,
            v_request_id,
            'match_request',
            v_notif_title,
            v_notif_msg,
            false
        );

        v_matched_donors := v_matched_donors || jsonb_build_object(
            'donor_id', v_donor.id,
            'name', v_donor.name,
            'blood_group', v_donor.blood_group,
            'district', v_donor.district,
            'locality', v_donor.locality,
            'trust_score', v_donor.trust_score
        );

        v_match_count := v_match_count + 1;
    END LOOP;

    IF v_match_count > 0 THEN
        UPDATE blood_requests SET status = 'matched' WHERE id = v_request_id;
        UPDATE requests SET status = 'matching' WHERE id = v_request_id;
    END IF;

    INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
    VALUES (
        'CREATE_AND_MATCH_REQUEST',
        'blood_requests',
        v_request_id::text,
        jsonb_build_object(
            'blood_group', p_blood_group,
            'district', p_district,
            'hospital', p_hospital_name,
            'matched_donors_count', v_match_count
        )
    );

    RETURN json_build_object(
        'success', true,
        'request_id', v_request_id,
        'matched_count', v_match_count,
        'matched_donors', v_matched_donors,
        'message', 'Request created and ' || v_match_count || ' eligible donors matched and notified.'
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_blood_match(p_match_id uuid, p_donor_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_match RECORD;
    v_request RECORD;
    v_donor RECORD;
BEGIN
    -- Atomic row lock
    SELECT * INTO v_match FROM request_matches WHERE id = p_match_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Match record not found');
    END IF;

    IF v_match.donor_id <> p_donor_id THEN
        RETURN json_build_object('success', false, 'error', 'Unauthorized: donor ID mismatch');
    END IF;

    IF v_match.status = 'accepted' THEN
        RETURN json_build_object('success', true, 'message', 'Match is already accepted', 'match_id', p_match_id, 'request_id', v_match.request_id);
    END IF;

    SELECT * INTO v_request FROM blood_requests WHERE id = v_match.request_id;
    IF NOT FOUND THEN
        -- Fallback to requests table
        SELECT * INTO v_request FROM requests WHERE id = v_match.request_id;
    END IF;

    IF v_request.status IN ('fulfilled', 'cancelled', 'expired') THEN
        RETURN json_build_object('success', false, 'error', 'This blood request is no longer active');
    END IF;

    SELECT * INTO v_donor FROM donors WHERE id = p_donor_id;
    IF NOT FOUND OR NOT is_donor_eligible(v_donor.last_donation_date) THEN
        RETURN json_build_object('success', false, 'error', 'Donor interval eligibility re-check failed. Must wait 90 days.');
    END IF;

    -- Update match to accepted
    UPDATE request_matches 
    SET status = 'accepted', responded_at = now()
    WHERE id = p_match_id;

    -- Update request to fulfilled
    UPDATE blood_requests SET status = 'fulfilled', updated_at = now() WHERE id = v_match.request_id;
    UPDATE requests SET status = 'fulfilled', updated_at = now() WHERE id = v_match.request_id;

    -- Insert notification
    INSERT INTO notifications (
        request_id,
        donor_id,
        type,
        title,
        message,
        read
    ) VALUES (
        v_match.request_id,
        p_donor_id,
        'match_accepted',
        '✅ Donor Accepted Dispatch!',
        v_donor.name || ' (' || v_donor.blood_group || ') has accepted the emergency blood request. Contact details are now unsealed.',
        false
    );

    -- Log audit
    INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
    VALUES (
        'ACCEPT_MATCH',
        'request_matches',
        p_match_id::text,
        jsonb_build_object(
            'donor_id', p_donor_id,
            'request_id', v_match.request_id
        )
    );

    RETURN json_build_object(
        'success', true,
        'message', 'Request accepted successfully. Contact details revealed.',
        'match_id', p_match_id,
        'request_id', v_match.request_id
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.decline_blood_match(p_match_id uuid, p_donor_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_match RECORD;
BEGIN
    SELECT * INTO v_match FROM request_matches WHERE id = p_match_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Match not found');
    END IF;

    IF v_match.donor_id <> p_donor_id THEN
        RETURN json_build_object('success', false, 'error', 'Unauthorized donor ID');
    END IF;

    UPDATE request_matches 
    SET status = 'declined', responded_at = now()
    WHERE id = p_match_id;

    INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
    VALUES (
        'DECLINE_MATCH',
        'request_matches',
        p_match_id::text,
        jsonb_build_object('donor_id', p_donor_id)
    );

    RETURN json_build_object('success', true, 'message', 'Match declined', 'match_id', p_match_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_revealed_contact(p_match_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_match RECORD;
    v_donor RECORD;
    v_request RECORD;
BEGIN
    SELECT * INTO v_match FROM request_matches WHERE id = p_match_id;
    IF NOT FOUND THEN
        RETURN json_build_object('is_authorized', false, 'error', 'Match not found');
    END IF;

    IF v_match.status <> 'accepted' THEN
        RETURN json_build_object(
            'is_authorized', false,
            'status', v_match.status,
            'masked_phone', '+91 98470 •••••',
            'masked_email', '••••••••@••••.com',
            'message', 'Contact details are strictly private until the donor accepts the request.'
        );
    END IF;

    SELECT * INTO v_donor FROM donors WHERE id = v_match.donor_id;
    SELECT * INTO v_request FROM blood_requests WHERE id = v_match.request_id;
    IF NOT FOUND THEN
        SELECT * INTO v_request FROM requests WHERE id = v_match.request_id;
    END IF;

    RETURN json_build_object(
        'is_authorized', true,
        'status', 'accepted',
        'donor', json_build_object(
            'id', v_donor.id,
            'name', v_donor.name,
            'phone', v_donor.phone,
            'email', v_donor.email,
            'blood_group', v_donor.blood_group,
            'district', v_donor.district,
            'locality', v_donor.locality,
            'trust_score', v_donor.trust_score
        ),
        'requester', json_build_object(
            'name', COALESCE(v_request.requester_name, 'Requester'),
            'phone', COALESCE(v_request.requester_phone, '+91 98470 12345'),
            'hospital', COALESCE(v_request.hospital_name, 'Hospital'),
            'district', v_request.district,
            'locality', v_request.locality
        ),
        'accepted_at', v_match.responded_at
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_match_details(p_match_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_match RECORD;
    v_request RECORD;
    v_donor RECORD;
    v_is_compatible BOOLEAN;
    v_is_eligible BOOLEAN;
    v_is_avail BOOLEAN;
BEGIN
    SELECT * INTO v_match FROM request_matches WHERE id = p_match_id;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Match not found');
    END IF;

    SELECT * INTO v_donor FROM donors WHERE id = v_match.donor_id;
    SELECT * INTO v_request FROM blood_requests WHERE id = v_match.request_id;
    IF NOT FOUND THEN
        SELECT * INTO v_request FROM requests WHERE id = v_match.request_id;
    END IF;

    v_is_compatible := is_blood_compatible(v_donor.blood_group, COALESCE(v_request.blood_group, v_request.blood_group_needed));
    v_is_eligible := is_donor_eligible(v_donor.last_donation_date);
    v_is_avail := (v_donor.available = 'available' OR v_donor.available = 'true' OR v_donor.available = '1');

    RETURN json_build_object(
        'success', true,
        'match', json_build_object(
            'id', v_match.id,
            'request_id', v_match.request_id,
            'donor_id', v_match.donor_id,
            'match_score', v_match.match_score,
            'status', v_match.status,
            'notified_at', v_match.notified_at,
            'responded_at', v_match.responded_at
        ),
        'request', json_build_object(
            'id', COALESCE(v_request.id, v_match.request_id),
            'patient_name', COALESCE(v_request.patient_identifier, v_request.requester_name, 'Emergency Patient'),
            'blood_group', COALESCE(v_request.blood_group, v_request.blood_group_needed),
            'units', COALESCE(v_request.units_required, v_request.units_needed, 1),
            'urgency', COALESCE(v_request.urgency, 'urgent'),
            'district', v_request.district,
            'locality', v_request.locality,
            'hospital_name', v_request.hospital_name,
            'notes', v_request.notes,
            'created_at', v_request.created_at
        ),
        'donor', json_build_object(
            'id', v_donor.id,
            'name', v_donor.name,
            'blood_group', v_donor.blood_group,
            'district', v_donor.district,
            'locality', v_donor.locality,
            'available', v_is_avail,
            'last_donation_date', v_donor.last_donation_date
        ),
        'why_matched', json_build_object(
            'compatible_blood_group', v_is_compatible,
            'interval_eligible', v_is_eligible,
            'available_now', v_is_avail,
            'district_relevance', (LOWER(TRIM(v_donor.district)) = LOWER(TRIM(v_request.district))),
            'locality_match', (LOWER(TRIM(COALESCE(v_donor.locality, ''))) = LOWER(TRIM(COALESCE(v_request.locality, ''))))
        )
    );
END;
$$;
