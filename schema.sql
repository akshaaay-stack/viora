-- ============================================================================
-- VIORA SC-12 Core Schema, RPC Functions & Privacy Gates
-- Challenge: SC-12 — District Blood Donor Matching
-- Tagline: "The right donor, at the right moment — not everyone, all at once."
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Configuration & Settings (Centralized 90-Day Rule)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO platform_settings (key, value, description)
VALUES 
    ('MIN_DONATION_INTERVAL_DAYS', '90', 'Mandatory interval in days required between whole blood donations'),
    ('MAX_WAVE_MATCH_LIMIT', '6', 'Maximum number of prioritized donors to notify per wave'),
    ('EXPIRY_HOURS', '48', 'Default hours before an unfulfilled blood request expires')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

CREATE OR REPLACE FUNCTION get_min_donation_interval()
RETURNS INTEGER AS $$
DECLARE
    interval_val INTEGER;
BEGIN
    SELECT COALESCE(value::integer, 90) INTO interval_val 
    FROM platform_settings 
    WHERE key = 'MIN_DONATION_INTERVAL_DAYS';
    RETURN COALESCE(interval_val, 90);
EXCEPTION WHEN OTHERS THEN
    RETURN 90;
END;
$$ LANGUAGE plpgsql STABLE;

-- ----------------------------------------------------------------------------
-- 2. Hospitals Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    locality TEXT NOT NULL,
    address TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. Donors Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    blood_group TEXT NOT NULL,
    district TEXT NOT NULL,
    locality TEXT NOT NULL,
    approximate_latitude NUMERIC,
    approximate_longitude NUMERIC,
    last_donation_date DATE,
    available BOOLEAN DEFAULT true,
    notification_preference TEXT DEFAULT 'in_app',
    trust_score INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_donors_blood_district ON donors(blood_group, district);
CREATE INDEX IF NOT EXISTS idx_donors_available ON donors(available);
CREATE INDEX IF NOT EXISTS idx_donors_last_donation ON donors(last_donation_date);

-- ----------------------------------------------------------------------------
-- 4. Blood Requests Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blood_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_name TEXT NOT NULL,
    requester_phone TEXT NOT NULL,
    patient_identifier TEXT DEFAULT 'Patient Emergency',
    blood_group TEXT NOT NULL,
    units_required INTEGER DEFAULT 1 CHECK (units_required > 0),
    district TEXT NOT NULL,
    hospital_name TEXT NOT NULL,
    locality TEXT,
    urgency TEXT DEFAULT 'urgent' CHECK (urgency IN ('normal', 'urgent', 'critical')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'matched', 'fulfilled', 'cancelled', 'expired')),
    required_by TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ DEFAULT (now() + interval '48 hours')
);

CREATE INDEX IF NOT EXISTS idx_requests_status_district ON blood_requests(status, district);
CREATE INDEX IF NOT EXISTS idx_requests_blood ON blood_requests(blood_group);

-- ----------------------------------------------------------------------------
-- 5. Request Matches Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS request_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
    donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    match_score INTEGER DEFAULT 100,
    eligibility_status TEXT DEFAULT 'eligible',
    notification_status TEXT DEFAULT 'sent',
    status TEXT DEFAULT 'notified' CHECK (status IN ('notified', 'accepted', 'declined', 'expired')),
    created_at TIMESTAMPTZ DEFAULT now(),
    notified_at TIMESTAMPTZ DEFAULT now(),
    responded_at TIMESTAMPTZ,
    CONSTRAINT unique_request_donor_match UNIQUE (request_id, donor_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_req_donor ON request_matches(request_id, donor_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON request_matches(status);

-- ----------------------------------------------------------------------------
-- 6. Notifications Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
    request_id UUID REFERENCES blood_requests(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_donor_read ON notifications(donor_id, read);

-- ----------------------------------------------------------------------------
-- 7. Donation History Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    request_id UUID REFERENCES blood_requests(id) ON DELETE SET NULL,
    donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    hospital_name TEXT NOT NULL,
    units INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 8. Audit Logs Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- CENTRALIZED BUSINESS LOGIC & RPC FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Blood Compatibility Matrix (Centralized 8x8)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_blood_compatible(p_donor_bg TEXT, p_recipient_bg TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    d TEXT := UPPER(TRIM(p_donor_bg));
    r TEXT := UPPER(TRIM(p_recipient_bg));
BEGIN
    -- Universal Donor O-
    IF d = 'O-' THEN
        RETURN TRUE;
    END IF;

    -- O+ can donate to O+, A+, B+, AB+
    IF d = 'O+' THEN
        RETURN r IN ('O+', 'A+', 'B+', 'AB+');
    END IF;

    -- A- can donate to A-, A+, AB-, AB+
    IF d = 'A-' THEN
        RETURN r IN ('A-', 'A+', 'AB-', 'AB+');
    END IF;

    -- A+ can donate to A+, AB+
    IF d = 'A+' THEN
        RETURN r IN ('A+', 'AB+');
    END IF;

    -- B- can donate to B-, B+, AB-, AB+
    IF d = 'B-' THEN
        RETURN r IN ('B-', 'B+', 'AB-', 'AB+');
    END IF;

    -- B+ can donate to B+, AB+
    IF d = 'B+' THEN
        RETURN r IN ('B+', 'AB+');
    END IF;

    -- AB- can donate to AB-, AB+
    IF d = 'AB-' THEN
        RETURN r IN ('AB-', 'AB+');
    END IF;

    -- AB+ can only donate to AB+ (Universal recipient)
    IF d = 'AB+' THEN
        RETURN r = 'AB+';
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ----------------------------------------------------------------------------
-- 90-Day Donation Interval Eligibility Functions
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_donor_eligible(p_last_donation_date DATE)
RETURNS BOOLEAN AS $$
DECLARE
    interval_days INTEGER := get_min_donation_interval();
BEGIN
    IF p_last_donation_date IS NULL THEN
        RETURN TRUE;
    END IF;
    RETURN (CURRENT_DATE - p_last_donation_date) >= interval_days;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION get_days_until_eligible(p_last_donation_date DATE)
RETURNS INTEGER AS $$
DECLARE
    interval_days INTEGER := get_min_donation_interval();
    days_since INTEGER;
BEGIN
    IF p_last_donation_date IS NULL THEN
        RETURN 0;
    END IF;
    days_since := CURRENT_DATE - p_last_donation_date;
    IF days_since >= interval_days THEN
        RETURN 0;
    ELSE
        RETURN interval_days - days_since;
    END IF;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION get_next_eligible_date(p_last_donation_date DATE)
RETURNS DATE AS $$
DECLARE
    interval_days INTEGER := get_min_donation_interval();
BEGIN
    IF p_last_donation_date IS NULL THEN
        RETURN CURRENT_DATE;
    END IF;
    RETURN p_last_donation_date + interval_days;
END;
$$ LANGUAGE plpgsql STABLE;

-- ----------------------------------------------------------------------------
-- PRIVACY-SAFE PUBLIC VIEWS (Mask sensitive data)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW donors_public AS
SELECT 
    id,
    blood_group,
    district,
    locality,
    last_donation_date,
    available,
    trust_score,
    is_donor_eligible(last_donation_date) AS is_eligible,
    get_days_until_eligible(last_donation_date) AS days_until_eligible,
    get_next_eligible_date(last_donation_date) AS next_eligible_date,
    created_at
FROM donors;

CREATE OR REPLACE VIEW blood_requests_public AS
SELECT 
    id,
    patient_identifier,
    blood_group,
    units_required,
    district,
    hospital_name,
    locality,
    urgency,
    status,
    required_by,
    notes,
    created_at,
    expires_at
FROM blood_requests;

-- ----------------------------------------------------------------------------
-- MATCHING ENGINE RPC: create_and_match_blood_request
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION create_and_match_blood_request(
    p_requester_name TEXT,
    p_requester_phone TEXT,
    p_blood_group TEXT,
    p_units_required INTEGER,
    p_district TEXT,
    p_hospital_name TEXT,
    p_urgency TEXT DEFAULT 'urgent',
    p_patient_identifier TEXT DEFAULT 'Patient Emergency',
    p_locality TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_required_by TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_request_id UUID;
    v_match_count INTEGER := 0;
    v_donor RECORD;
    v_score INTEGER;
    v_max_matches INTEGER;
    v_notif_title TEXT;
    v_notif_msg TEXT;
BEGIN
    -- 1. Validate inputs
    IF p_blood_group IS NULL OR p_district IS NULL OR p_hospital_name IS NULL OR p_requester_phone IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Missing required request fields');
    END IF;

    SELECT COALESCE(value::integer, 6) INTO v_max_matches 
    FROM platform_settings WHERE key = 'MAX_WAVE_MATCH_LIMIT';
    IF v_max_matches IS NULL THEN v_max_matches := 6; END IF;

    -- 2. Insert Blood Request
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

    -- 3. Match Pipeline: Filter eligible, available, compatible donors
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
                WHEN d.district = p_district THEN 100 
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
            d.available = TRUE
            AND is_blood_compatible(d.blood_group, UPPER(TRIM(p_blood_group))) = TRUE
            AND is_donor_eligible(d.last_donation_date) = TRUE
        ORDER BY 
            (d.district = p_district) DESC,
            computed_rank DESC,
            d.created_at ASC
        LIMIT v_max_matches
    LOOP
        -- Insert match record
        INSERT INTO request_matches (
            request_id,
            donor_id,
            match_score,
            eligibility_status,
            notification_status,
            status
        ) VALUES (
            v_request_id,
            v_donor.id,
            v_donor.computed_rank,
            'eligible',
            'sent',
            'notified'
        ) ON CONFLICT DO NOTHING;

        -- Create in-app notification for the donor
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

        v_match_count := v_match_count + 1;
    END LOOP;

    -- Update request status
    IF v_match_count > 0 THEN
        UPDATE blood_requests SET status = 'matched' WHERE id = v_request_id;
    END IF;

    -- Record Audit Log
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
        'message', 'Request created and ' || v_match_count || ' eligible donors matched and notified.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- ACCEPT MATCH RPC: accept_blood_match
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION accept_blood_match(p_match_id UUID, p_donor_id UUID)
RETURNS JSON AS $$
DECLARE
    v_match RECORD;
    v_request RECORD;
    v_donor RECORD;
BEGIN
    -- 1. Find Match
    SELECT * INTO v_match FROM request_matches WHERE id = p_match_id;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Match record not found');
    END IF;

    IF v_match.donor_id <> p_donor_id THEN
        RETURN json_build_object('success', false, 'error', 'Unauthorized: donor ID mismatch');
    END IF;

    IF v_match.status = 'accepted' THEN
        RETURN json_build_object('success', true, 'message', 'Match is already accepted');
    END IF;

    -- 2. Verify Request is active
    SELECT * INTO v_request FROM blood_requests WHERE id = v_match.request_id;
    IF NOT FOUND OR v_request.status IN ('fulfilled', 'cancelled', 'expired') THEN
        RETURN json_build_object('success', false, 'error', 'This blood request is no longer active');
    END IF;

    -- 3. Verify Donor Eligibility and Availability
    SELECT * INTO v_donor FROM donors WHERE id = p_donor_id;
    IF NOT FOUND OR NOT is_donor_eligible(v_donor.last_donation_date) THEN
        RETURN json_build_object('success', false, 'error', 'Donor interval eligibility re-check failed. Must wait 90 days.');
    END IF;

    -- 4. Mark match accepted
    UPDATE request_matches 
    SET status = 'accepted', responded_at = now()
    WHERE id = p_match_id;

    -- 5. Notify Requester
    INSERT INTO notifications (
        request_id,
        type,
        title,
        message,
        read
    ) VALUES (
        v_request.id,
        'match_accepted',
        '✅ Donor Accepted Your Request!',
        v_donor.name || ' (' || v_donor.blood_group || ') has accepted your blood request for ' || v_request.hospital_name || '. Contact details are now revealed.',
        false
    );

    -- 6. Audit Log
    INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
    VALUES (
        'ACCEPT_MATCH',
        'request_matches',
        p_match_id::text,
        jsonb_build_object(
            'donor_id', p_donor_id,
            'request_id', v_request.id,
            'hospital', v_request.hospital_name
        )
    );

    RETURN json_build_object(
        'success', true,
        'message', 'Request accepted successfully. Contact details revealed.',
        'match_id', p_match_id,
        'request_id', v_request.id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- DECLINE MATCH RPC: decline_blood_match
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION decline_blood_match(p_match_id UUID, p_donor_id UUID)
RETURNS JSON AS $$
DECLARE
    v_match RECORD;
BEGIN
    SELECT * INTO v_match FROM request_matches WHERE id = p_match_id;
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

    RETURN json_build_object('success', true, 'message', 'Match declined');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- PRIVACY GATE RPC: get_revealed_contact
-- Strictly hides phone & email until status = 'accepted'
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_revealed_contact(p_match_id UUID)
RETURNS JSON AS $$
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
            'masked_phone', '•••• •••• ••',
            'masked_email', '••••••••@••••.com',
            'message', 'Contact details are strictly private until the donor accepts the request.'
        );
    END IF;

    -- Authorized: Retrieve full contact
    SELECT * INTO v_donor FROM donors WHERE id = v_match.donor_id;
    SELECT * INTO v_request FROM blood_requests WHERE id = v_match.request_id;

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
            'locality', v_donor.locality
        ),
        'requester', json_build_object(
            'name', v_request.requester_name,
            'phone', v_request.requester_phone,
            'hospital', v_request.hospital_name,
            'district', v_request.district
        ),
        'accepted_at', v_match.responded_at
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- FULFILL REQUEST RPC: fulfill_blood_request
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fulfill_blood_request(p_request_id UUID)
RETURNS JSON AS $$
DECLARE
    v_request RECORD;
    v_match RECORD;
BEGIN
    SELECT * INTO v_request FROM blood_requests WHERE id = p_request_id;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Request not found');
    END IF;

    UPDATE blood_requests 
    SET status = 'fulfilled', updated_at = now() 
    WHERE id = p_request_id;

    -- Add to donation history for any accepted donors
    FOR v_match IN 
        SELECT * FROM request_matches 
        WHERE request_id = p_request_id AND status = 'accepted'
    LOOP
        INSERT INTO donation_history (donor_id, request_id, donation_date, hospital_name)
        VALUES (v_match.donor_id, p_request_id, CURRENT_DATE, v_request.hospital_name);

        -- Update donor's last donation date to TODAY so the 90-day interval begins!
        UPDATE donors 
        SET last_donation_date = CURRENT_DATE, updated_at = now()
        WHERE id = v_match.donor_id;
    END LOOP;

    INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
    VALUES (
        'FULFILL_REQUEST',
        'blood_requests',
        p_request_id::text,
        jsonb_build_object('hospital', v_request.hospital_name)
    );

    RETURN json_build_object('success', true, 'message', 'Request marked as fulfilled and donation history updated.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- PLATFORM STATS RPC: get_platform_stats
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS JSON AS $$
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
    SELECT count(*) INTO v_eligible_donors FROM donors WHERE is_donor_eligible(last_donation_date) = TRUE AND available = TRUE;
    SELECT count(*) INTO v_ineligible_donors FROM donors WHERE is_donor_eligible(last_donation_date) = FALSE;
    SELECT count(*) INTO v_active_requests FROM blood_requests WHERE status IN ('active', 'matched');
    SELECT count(*) INTO v_fulfilled_requests FROM blood_requests WHERE status = 'fulfilled';
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
$$ LANGUAGE plpgsql STABLE;
