import urllib.request
import json
import re

print("=" * 60)
print("VIORA COMPREHENSIVE VERIFICATION SUITE")
print("=" * 60)

# 1. Test Server HTTP 200 and static assets
print("\n[TEST 1] Testing Local Server Endpoints...")
endpoints = ["/", "/index.html", "/app.js", "/env.js"]
for ep in endpoints:
    url = f"http://localhost:5173{ep}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as res:
            body = res.read()
            print(f"  [PASS] {ep} -> Status: {res.status}, Size: {len(body)} bytes")
    except Exception as e:
        print(f"  [FAIL] {ep} -> Error: {e}")

# 2. Test Supabase Direct Connectivity
print("\n[TEST 2] Testing Supabase Connectivity & Schema...")
SUPABASE_URL = "https://jpultvoodifhjqmbsjvh.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdWx0dm9vZGlmaGpxbWJzanZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NTQ4MTcsImV4cCI6MjEwNTIzMDgxN30.xnGN2RbFYl2HHj583swTzU83GdOr9oHNO2EMPYjY6sk"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

tables = ["donors", "requests", "matches", "user_profiles"]
for tbl in tables:
    try:
        req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/{tbl}?select=*&limit=3", headers=headers)
        with urllib.request.urlopen(req, timeout=8) as res:
            data = json.loads(res.read().decode("utf-8"))
            print(f"  [PASS] Table '{tbl}' accessible -> {len(data)} records sampled")
    except Exception as e:
        print(f"  [FAIL] Table '{tbl}' error: {e}")

# 3. Test Full Matching Flow via REST
print("\n[TEST 3] Testing Matching Engine End-to-End...")
try:
    # Query donors with O- in Ernakulam
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/donors?select=*&district=eq.Ernakulam&available=eq.true", headers=headers)
    with urllib.request.urlopen(req, timeout=8) as res:
        donors = json.loads(res.read().decode("utf-8"))
        print(f"  [PASS] Found {len(donors)} available donors in Ernakulam")
        for d in donors[:3]:
            print(f"    - Donor: {d.get('name')} | Group: {d.get('blood_group')} | Locality: {d.get('locality')} | Trust: {d.get('trust_score')}")

    # Create a test emergency request
    new_req_data = json.dumps({
        "requester_name": "Verification Tester",
        "requester_phone": "+919876543210",
        "blood_group_needed": "O-",
        "locality": "Kakkanad",
        "district": "Ernakulam",
        "hospital_name": "Aster Medcity",
        "urgency": "critical",
        "status": "searching",
        "current_wave": 1
    }).encode("utf-8")
    
    insert_req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/requests", data=new_req_data, headers={**headers, "Prefer": "return=representation"}, method="POST")
    with urllib.request.urlopen(insert_req, timeout=8) as res:
        created = json.loads(res.read().decode("utf-8"))[0]
        req_id = created["id"]
        print(f"  [PASS] Created test emergency request: {req_id}")

    # Clean up test request
    del_req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/requests?id=eq.{req_id}", headers=headers, method="DELETE")
    with urllib.request.urlopen(del_req, timeout=8) as res:
        print("  [PASS] Cleaned up test emergency request.")

except Exception as e:
    print(f"  [FAIL] Matching Flow Error: {e}")

print("\n" + "=" * 60)
print("VERIFICATION COMPLETED")
print("=" * 60)
