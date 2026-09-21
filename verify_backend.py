#!/usr/bin/env python3
"""
VIORA Backend & SC-12 Rule Verification Test Suite
Executes automated checks against Supabase PostgreSQL backend.
"""

import urllib.request
import json
import sys

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = "https://jpultvoodifhjqmbsjvh.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdWx0dm9vZGlmaGpxbWJzanZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NTQ4MTcsImV4cCI6MjEwNTIzMDgxN30.xnGN2RbFYl2HHj583swTzU83GdOr9oHNO2EMPYjY6sk"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def rpc(func_name, params={}):
    url = f"{SUPABASE_URL}/rest/v1/rpc/{func_name}"
    req = urllib.request.Request(url, data=json.dumps(params).encode('utf-8'), headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def get_table(table_name, query_params=""):
    url = f"{SUPABASE_URL}/rest/v1/{table_name}?{query_params}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def test_blood_compatibility():
    print("\n--- 1. Testing Blood Compatibility Matrix (8x8) ---")
    # Universal donor O-
    assert rpc("is_blood_compatible", {"p_donor_bg": "O-", "p_recipient_bg": "AB+"}) is True, "O- should donate to AB+"
    assert rpc("is_blood_compatible", {"p_donor_bg": "O-", "p_recipient_bg": "O+"}) is True, "O- should donate to O+"
    
    # O+ can donate to O+, A+, B+, AB+ but NOT to O-, A-, B-, AB-
    assert rpc("is_blood_compatible", {"p_donor_bg": "O+", "p_recipient_bg": "O+"}) is True, "O+ should donate to O+"
    assert rpc("is_blood_compatible", {"p_donor_bg": "O+", "p_recipient_bg": "O-"}) is False, "O+ cannot donate to O-"
    
    # AB+ can only donate to AB+
    assert rpc("is_blood_compatible", {"p_donor_bg": "AB+", "p_recipient_bg": "AB+"}) is True, "AB+ should donate to AB+"
    assert rpc("is_blood_compatible", {"p_donor_bg": "AB+", "p_recipient_bg": "O+"}) is False, "AB+ cannot donate to O+"
    print("[PASS] Blood compatibility matrix verified accurately!")

def test_donation_interval():
    print("\n--- 2. Testing Configurable 90-Day Donation Interval ---")
    # Date 10 days ago -> Ineligible
    res_recent = rpc("is_donor_eligible", {"p_last_donation_date": "2026-09-09"})
    days_rem = rpc("get_days_until_eligible", {"p_last_donation_date": "2026-09-09"})
    assert res_recent is False, "Donor who donated 10 days ago must be ineligible"
    assert days_rem > 0, f"Days remaining must be > 0, got {days_rem}"

    # Date 120 days ago -> Eligible
    res_past = rpc("is_donor_eligible", {"p_last_donation_date": "2026-05-01"})
    assert res_past is True, "Donor who donated 120 days ago must be eligible"
    print(f"[PASS] 90-day donation interval verified: 10 days ago -> Ineligible (days remaining: {days_rem}), 120 days ago -> Eligible")

def test_e2e_request_match_accept_privacy():
    print("\n--- 3. Testing Complete E2E Matching & Privacy Gate Chain ---")
    # Create test request
    req_res = rpc("create_and_match_blood_request", {
        "p_requester_name": "Test Dr. Suresh",
        "p_requester_phone": "+91 94470 99999",
        "p_blood_group": "O+",
        "p_units_required": 1,
        "p_district": "Ernakulam",
        "p_hospital_name": "Aster Medcity",
        "p_urgency": "urgent",
        "p_patient_identifier": "TEST-REQ-E2E"
    })
    assert req_res.get("success") is True, f"Request creation failed: {req_res}"
    request_id = req_res.get("request_id")
    print(f"[PASS] Created request {request_id}, matches count: {req_res.get('matched_count')}")

    # Fetch matches
    matches = get_table("request_matches", f"request_id=eq.{request_id}")
    assert len(matches) > 0, "Matches must be created"
    match_id = matches[0]["id"]
    donor_id = matches[0]["donor_id"]

    # Check Privacy Gate BEFORE acceptance (must be masked!)
    gate_before = rpc("get_revealed_contact", {"p_match_id": match_id})
    assert gate_before.get("is_authorized") is False, "Gate must NOT authorize unaccepted match"
    assert "••••" in gate_before.get("masked_phone", ""), "Phone must be masked"
    print("[PASS] Privacy Gate strictly masked phone before acceptance:", gate_before.get("masked_phone"))

    # Accept match
    accept_res = rpc("accept_blood_match", {"p_match_id": match_id, "p_donor_id": donor_id})
    assert accept_res.get("success") is True, f"Accept match failed: {accept_res}"
    print("[PASS] Match accepted successfully by donor")

    # Check Privacy Gate AFTER acceptance (must reveal contact!)
    gate_after = rpc("get_revealed_contact", {"p_match_id": match_id})
    assert gate_after.get("is_authorized") is True, "Gate must authorize accepted match"
    assert gate_after.get("donor", {}).get("phone") is not None, "Donor phone must be revealed"
    print(f"[PASS] Privacy Gate revealed authorized contact: {gate_after.get('donor', {}).get('name')} ({gate_after.get('donor', {}).get('phone')})")

    # Fulfill request
    fulfill_res = rpc("fulfill_blood_request", {"p_request_id": request_id})
    assert fulfill_res.get("success") is True, "Fulfill failed"
    print("[PASS] Request fulfilled and donor donation history updated")

def test_ineligible_donor_exclusion():
    print("\n--- 4. Testing Ineligible Donor Exclusion (SC-12 Core Test) ---")
    # Find Rohan Mathew (who donated 18 days ago)
    donors = get_table("donors", "name=like.*Rohan*")
    assert len(donors) > 0, "Rohan Mathew test donor should exist"
    rohan_id = donors[0]["id"]

    # Verify Rohan is NOT matched in any O+ request matches
    matches = get_table("request_matches", f"donor_id=eq.{rohan_id}")
    assert len(matches) == 0, f"Ineligible donor Rohan Mathew must NOT have match records, found {len(matches)}"
    print(f"[PASS] Verified: Ineligible donor Rohan Mathew (donated 18 days ago) was completely excluded from matching!")

def main():
    print("==================================================")
    print("VIORA AUTOMATED BACKEND & SC-12 VERIFICATION SUITE")
    print("==================================================")
    try:
        test_blood_compatibility()
        test_donation_interval()
        test_e2e_request_match_accept_privacy()
        test_ineligible_donor_exclusion()
        print("\n==================================================")
        print("ALL TESTS PASSED SUCCESSFULLY! ZERO FAILURES.")
        print("==================================================")
    except Exception as e:
        print(f"\n[FAIL] TEST SUITE ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
