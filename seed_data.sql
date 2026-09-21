-- ============================================================================
-- VIORA Kerala Real Seed Data
-- 14 Districts, Real Kerala Hospitals, Diverse Blood Groups & Donation Intervals
-- ============================================================================

-- Clear existing data if needed
DELETE FROM notifications;
DELETE FROM donation_history;
DELETE FROM request_matches;
DELETE FROM blood_requests;
DELETE FROM donors;
DELETE FROM hospitals;

-- ----------------------------------------------------------------------------
-- 1. Kerala Hospitals (14 Districts)
-- ----------------------------------------------------------------------------
INSERT INTO hospitals (name, district, locality, address, latitude, longitude, phone) VALUES
('Aster Medcity', 'Ernakulam', 'Cheranalloor', 'Kuttisahib Road, South Chittoor, Kochi', 10.0538, 76.2690, '+91 484 6699999'),
('Amrita Institute of Medical Sciences (AIMS)', 'Ernakulam', 'Edappally', 'Ponekkara, Edappally, Kochi', 10.0326, 76.2946, '+91 484 2851234'),
('Medical Trust Hospital', 'Ernakulam', 'MG Road', 'MG Road, Pallimukku, Kochi', 9.9674, 76.2872, '+91 484 2358001'),
('Jubilee Mission Medical College', 'Thrissur', 'East Fort', 'Jubilee Mission P.O., Thrissur', 10.5218, 76.2238, '+91 487 2432200'),
('Government Medical College Thrissur', 'Thrissur', 'Mulankunnathukavu', 'Medical College P.O., Thrissur', 10.6186, 76.2023, '+91 487 2200310'),
('Caritas Hospital', 'Kottayam', 'Thellakom', 'Caritas Junction, Thellakom, Kottayam', 9.6450, 76.5442, '+91 481 2790025'),
('Government Medical College Kottayam', 'Kottayam', 'Gandhinagar', 'Arpookara, Kottayam', 9.6267, 76.5298, '+91 481 2597284'),
('Baby Memorial Hospital', 'Kozhikode', 'Arayidathupalam', 'Indira Gandhi Road, Kozhikode', 11.2588, 75.7804, '+91 495 2777777'),
('Government Medical College Kozhikode', 'Kozhikode', 'Chevayur', 'Medical College Junction, Kozhikode', 11.2726, 75.8364, '+91 495 2350216'),
('Government Medical College Thiruvananthapuram', 'Thiruvananthapuram', 'Medical College', 'Ulloor Road, Medical College P.O., Trivandrum', 8.5241, 76.9248, '+91 471 2528300'),
('KIMSHEALTH Hospital', 'Thiruvananthapuram', 'Anayara', 'P.B. No. 1, Anayara, Trivandrum', 8.5089, 76.9073, '+91 471 2941000'),
('Government Medical College Alappuzha', 'Alappuzha', 'Vandanam', 'Vandanam P.O., Alappuzha', 9.4005, 76.3533, '+91 477 2282015'),
('District Hospital Palakkad', 'Palakkad', 'Sultanpet', 'TB Road, Sultanpet, Palakkad', 10.7867, 76.6548, '+91 491 2533323'),
('Government Medical College Kannur', 'Kannur', 'Pariyaram', 'Pariyaram, Kannur', 12.0628, 75.3122, '+91 497 2808080'),
('Government Medical College Kollam', 'Kollam', 'Parippally', 'Parippally, Kollam', 8.8142, 76.7621, '+91 474 2575050'),
('District Hospital Mananthavady', 'Wayanad', 'Mananthavady', 'Hospital Road, Mananthavady', 11.8025, 76.0035, '+91 4935 240223'),
('General Hospital Kasaragod', 'Kasaragod', 'Vidyanagar', 'Vidyanagar, Kasaragod', 12.5102, 74.9852, '+91 4994 225300'),
('District Hospital Idukki', 'Idukki', 'Painavu', 'Painavu P.O., Idukki', 9.8495, 76.9744, '+91 4862 232230'),
('General Hospital Pathanamthitta', 'Pathanamthitta', 'Ring Road', 'Ring Road, Pathanamthitta', 9.2648, 76.7870, '+91 468 2222364'),
('Government Medical College Malappuram', 'Malappuram', 'Manjeri', 'Vettekkode, Manjeri, Malappuram', 11.1197, 76.1245, '+91 483 2766056');

-- ----------------------------------------------------------------------------
-- 2. Donors with Diverse Eligibility, Districts, Blood Groups
-- ----------------------------------------------------------------------------
-- Note: CURRENT_DATE - 120 means ELIGIBLE (>= 90 days)
-- Note: CURRENT_DATE - 15 means INELIGIBLE (< 90 days, crucial for interval test!)
-- Note: available = false means UNAVAILABLE

INSERT INTO donors (name, phone, email, blood_group, district, locality, last_donation_date, available, trust_score) VALUES
-- Ernakulam (Eligible)
('Faisal Rahman', '+91 98471 23456', 'faisal.r@kerala.net', 'O+', 'Ernakulam', 'Kakkanad', CURRENT_DATE - 120, true, 98),
('Dr. Ananya Menon', '+91 94470 11223', 'ananya.m@kerala.net', 'O+', 'Ernakulam', 'Edappally', CURRENT_DATE - 150, true, 100),
('Rahul Varma', '+91 97455 33445', 'rahul.v@kerala.net', 'O-', 'Ernakulam', 'Kaloor', CURRENT_DATE - 110, true, 95), -- Universal donor
('Sneha Elizabeth', '+91 98950 66778', 'sneha.e@kerala.net', 'A+', 'Ernakulam', 'Aluva', CURRENT_DATE - 180, true, 92),
('Jithin Paul', '+91 99462 88990', 'jithin.p@kerala.net', 'B+', 'Ernakulam', 'Tripunithura', CURRENT_DATE - 95, true, 90),
('Mathew George', '+91 94951 44332', 'mathew.g@kerala.net', 'AB+', 'Ernakulam', 'Fort Kochi', NULL, true, 96),

-- Ernakulam (INELIGIBLE - Donated 18 days ago! CRITICAL SC-12 TEST CASE)
('Rohan Mathew (Ineligible Interval Demo)', '+91 98460 77112', 'rohan.m@kerala.net', 'O+', 'Ernakulam', 'Palarivattom', CURRENT_DATE - 18, true, 99),

-- Ernakulam (UNAVAILABLE - Paused donation)
('Kavya Suresh (Unavailable Demo)', '+91 98951 88223', 'kavya.s@kerala.net', 'O+', 'Ernakulam', 'Vyttila', CURRENT_DATE - 200, false, 88),

-- Thrissur (Eligible)
('Gokul Krishna', '+91 94461 55667', 'gokul.k@kerala.net', 'O+', 'Thrissur', 'East Fort', CURRENT_DATE - 105, true, 97),
('Reshma Nair', '+91 97440 88991', 'reshma.n@kerala.net', 'A+', 'Thrissur', 'Ollur', CURRENT_DATE - 130, true, 94),
('Arun K. Jose', '+91 98473 12908', 'arun.kj@kerala.net', 'B+', 'Thrissur', 'Chalakudy', NULL, true, 90),

-- Thrissur (INELIGIBLE - Donated 40 days ago)
('Midhun Mohan (Ineligible)', '+91 94960 33211', 'midhun.m@kerala.net', 'O+', 'Thrissur', 'Guruvayur', CURRENT_DATE - 40, true, 91),

-- Kottayam (Eligible)
('Dr. Thomas Philip', '+91 94474 22334', 'thomas.p@kerala.net', 'O+', 'Kottayam', 'Thellakom', CURRENT_DATE - 140, true, 99),
('Athira Prakash', '+91 98954 66554', 'athira.p@kerala.net', 'AB-', 'Kottayam', 'Pala', CURRENT_DATE - 115, true, 89),

-- Kozhikode (Eligible)
('Muhammed Shafeeque', '+91 98470 99887', 'shafeeque.m@kerala.net', 'O+', 'Kozhikode', 'Mavoor Road', CURRENT_DATE - 160, true, 97),
('Aswathi Balan', '+91 94478 55443', 'aswathi.b@kerala.net', 'A-', 'Kozhikode', 'Chevayur', CURRENT_DATE - 92, true, 95),

-- Thiruvananthapuram (Eligible)
('Vishnu Namboothiri', '+91 98462 33441', 'vishnu.n@kerala.net', 'O+', 'Thiruvananthapuram', 'Pattom', CURRENT_DATE - 135, true, 96),
('Devika Radhakrishnan', '+91 94955 77889', 'devika.r@kerala.net', 'B-', 'Thiruvananthapuram', 'Kowdiar', CURRENT_DATE - 100, true, 93),

-- Alappuzha (Eligible)
('Bilal Hameed', '+91 98477 66554', 'bilal.h@kerala.net', 'O+', 'Alappuzha', 'Ambalappuzha', CURRENT_DATE - 175, true, 94);

-- ----------------------------------------------------------------------------
-- 3. Initial Active Emergency Sample Requests (For live demo)
-- ----------------------------------------------------------------------------
SELECT create_and_match_blood_request(
    'Dr. Vinod Kurian',
    '+91 98470 00111',
    'O+',
    2,
    'Ernakulam',
    'Aster Medcity',
    'critical',
    'REQ-ER-701',
    'Cheranalloor',
    'Emergency cardiac surgery bypass scheduled in 4 hours.',
    now() + interval '8 hours'
);

SELECT create_and_match_blood_request(
    'Sister Mary Joseph',
    '+91 94471 00222',
    'A+',
    1,
    'Thrissur',
    'Jubilee Mission Medical College',
    'urgent',
    'REQ-TR-402',
    'East Fort',
    'Post-trauma recovery transfusion unit.',
    now() + interval '16 hours'
);
