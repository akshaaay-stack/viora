-- ============================================================
-- VIORA SC-12: Test Data Cleanup Script
-- Safe purge script for all synthetic test data prefixed with TEST_
-- ============================================================

-- 1. Purge Notifications related to test requests
DELETE FROM public.notifications 
WHERE request_id IN (
    SELECT id FROM public.blood_requests 
    WHERE requester_name LIKE 'TEST_%' 
       OR hospital_name LIKE 'TEST_%'
       OR patient_identifier LIKE 'TEST_%'
);

-- 2. Purge Request Matches related to test requests
DELETE FROM public.request_matches 
WHERE request_id IN (
    SELECT id FROM public.blood_requests 
    WHERE requester_name LIKE 'TEST_%' 
       OR hospital_name LIKE 'TEST_%'
       OR patient_identifier LIKE 'TEST_%'
);

-- 3. Purge Audit Logs related to test requests
DELETE FROM public.audit_logs 
WHERE entity_id IN (
    SELECT id::text FROM public.blood_requests 
    WHERE requester_name LIKE 'TEST_%' 
       OR hospital_name LIKE 'TEST_%'
       OR patient_identifier LIKE 'TEST_%'
);

-- 4. Purge Blood Requests test rows
DELETE FROM public.blood_requests 
WHERE requester_name LIKE 'TEST_%' 
   OR hospital_name LIKE 'TEST_%'
   OR patient_identifier LIKE 'TEST_%';

-- 5. Purge legacy requests table test rows
DELETE FROM public.requests 
WHERE requester_name LIKE 'TEST_%' 
   OR hospital_name LIKE 'TEST_%';

-- 6. Verify remaining counts
SELECT 'donors' AS table_name, count(*) FROM public.donors
UNION ALL
SELECT 'blood_requests', count(*) FROM public.blood_requests
UNION ALL
SELECT 'request_matches', count(*) FROM public.request_matches
UNION ALL
SELECT 'notifications', count(*) FROM public.notifications;
