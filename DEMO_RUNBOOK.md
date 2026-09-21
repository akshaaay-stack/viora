# VIORA — 2-Minute Judge Demo Runbook
**Challenge SC-12 · Kerala District Blood Donor Matching Platform · Team AEVORA**

---

## 🎯 Demo Goal
Demonstrate to the hackathon jury that VIORA solves Kerala's blood donor broadcast fatigue through **intelligent district matching, 90-day cooldown enforcement, two-way consent privacy, and real-time Supabase synchronization** in under 2 minutes.

---

## ⏱️ Exact Demo Timeline (120 Seconds)

### **0:00 – 0:25 | The Problem & The Solution (Homepage)**
1. **Open Application:** Open `http://localhost:5173` on the browser.
2. **Key Talking Point:**
   > *"Existing blood donation in Kerala relies on frantic WhatsApp broadcasts to hundreds of people, causing donor fatigue. VIORA solves Challenge SC-12 by contacting the right eligible donor at the right moment — not everyone all at once."*
3. **Point to Hero Statistics:**
   - Show the live platform counters (`55 Donors`, `39 Eligible`, `11 on Cooldown`).
   - Mention: *"These are not hardcoded animations — they are computed live from our Supabase PostgreSQL database."*

---

### **0:25 – 0:55 | Requester Flow: Creating an Emergency Request**
1. **Click "REQUEST BLOOD"** (or scroll to the Request Form).
2. **Fill in the Emergency Request:**
   - Patient Name: `Rahul K.`
   - Blood Group: Click **B+**
   - Units Needed: `2 units`
   - Urgency: Select **CRITICAL**
   - District: Select **Ernakulam** (note how localities dynamically populate)
   - Locality: Select **Kalamassery**
   - Hospital: Select **Aster Medcity Kochi**
   - Requester Phone: `98470 12345`
3. **Click "DISPATCH TARGETED MATCHES"**:
   - Highlight the spinner: *"VIORA’s backend matching algorithm instantly filters compatible ABO groups, verifies 90-day donation cooldowns, and ranks local donors."*
   - Watch the instant toast notification: *"6 eligible donors matched and notified in Ernakulam."*

---

### **0:55 – 1:30 | Donor Flow & Explainable Matching (Two-Way Consent)**
1. **Switch to "Donor Portal" Tab:**
   - Select Donor Persona: **Kavya Suresh (B+, Kalamassery)**.
   - Show the incoming emergency alert badge: `🩸 Urgent Blood Needed in Ernakulam (Aster Medcity Kochi)`.
2. **Click the Notification / "View Dispatch Details":**
   - Deep links to the Match Detail modal (`#/match/<id>`).
3. **Showcase the "WHY YOU MATCHED" Explainability Checklist:**
   - Show the 5 verified checks:
     - `[✓] Blood Group Compatible (B+ to B+)`
     - `[✓] 90-Day Cooldown Cleared (Last donated 4 months ago)`
     - `[✓] Donor Active & Available`
     - `[✓] Same District (Ernakulam)`
     - `[✓] Same Locality (Kalamassery — 4 km away)`
4. **Demonstrate Privacy-by-Default:**
   - Point to the requester phone: `+91 98470 •••••` (Strictly masked).
   - Explain: *"Neither party's private contact is shared until the donor explicitly accepts."*

---

### **1:30 – 1:55 | The Handshake: Atomic Acceptance & Contact Unsealing**
1. **Click "ACCEPT DISPATCH":**
   - State updates in real time via Supabase PostgreSQL transaction.
2. **Show Unsealed Contact Details:**
   - Phone number unmasks: `+91 98470 12345`.
   - Action buttons appear: `[📞 Call Requester]` and `[💬 WhatsApp]`.
3. **Switch to "Live Matches" Tab:**
   - Show the timeline updating to `ACCEPTED` & `FULFILLED`.
   - Show the Realtime badge updating.

---

### **1:55 – 2:00 | Wrap Up & Jury Q&A Hand-off**
1. **Closing Statement:**
   > *"VIORA delivers zero-broadcast, privacy-first, district-aware blood matching with 100% database-verified integrity for Kerala. Thank you!"*

---

## 🛠️ Fallback & Reset Tips
- If you need to clean up demo test requests: Run `supabase/cleanup_test_data.sql` in Supabase SQL editor or execute `python verify_full_suite.py`.
- To switch personas easily during the demo, click any of the 4 donor cards at the top of the Donor Portal.
