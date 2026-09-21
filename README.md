# VIORA — Privacy-First District Blood Donor Matching Platform

> **Challenge SC-12:** District Blood Donor Matching  
> **Team:** Aevora  
> **Institution:** Jain University — School of Future  
> **Region of Deployment:** Kerala, India (14 Districts)

---

## 1. Executive Summary & Vision

When a patient suffers critical trauma or undergoes emergency surgery in Kerala, locating a nearby, compatible, and currently available blood donor often results in frantic public phone-number sharing on WhatsApp or social media. This causes severe privacy violations, spam, and delayed matching.

**VIORA** solves this through an intelligent **3-Wave Locality-to-District Matching Engine** combined with **Database-Enforced Cryptographic Contact Locking**:
- **Privacy-First:** Donor phone numbers and exact addresses remain strictly masked (`+91 ••••• •••••`) until the donor explicitly accepts a verified emergency request in the application.
- **Progressive Radial Dispatch:** Dispatches first to donors in the exact locality (0–5 km), escalating outward to the district (5–25 km) and regional hubs only if unfulfilled.
- **Anti-Spam & Medical Cooldown:** Automatically tracks donor rest periods (90-day cooldown) to prevent harassment and ensure physiological readiness.

---

## 2. Key Architecture & Technology Stack

```
+-----------------------------------------------------------------------------------+
|                                 VIORA CLIENT                                      |
|    React + TypeScript / Modern Healthcare UI (Tailwind CSS, Lucide Icons, Audio)  |
+----------------------------------------+------------------------------------------+
                                         |
                                         | (PostgreSQL Realtime WebSocket / REST)
                                         v
+-----------------------------------------------------------------------------------+
|                        SUPABASE POSTGRESQL CLOUD NODE                             |
|                             (jpultvoodifhjqmbsjvh)                                |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Tables: donors, requests, matches, hospitals, public_donor_view             |  |
|  +-----------------------------------------------------------------------------+  |
|  | Stored RPC Functions:                                                       |  |
|  |  * find_and_notify_eligible_donors(p_request_id, p_wave)                      |  |
|  |  * respond_to_match(p_match_id, p_response)                                 |  |
|  |  * reveal_contact(p_match_id)  <-- Cryptographic privacy gate               |  |
|  |  * escalate_request_wave(p_request_id)                                      |  |
|  +-----------------------------------------------------------------------------+  |
|  | Security: Row Level Security (RLS) policies isolating unconsented phones    |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 3. The 3-Wave Progressive Matching Algorithm

```
+---------------------------------------------------------------------------+
|                          WAVE 1: LOCALITY (0 - 5 km)                      |
| Broadcast exclusively to ready donors within the same town/locality       |
| (e.g. Kakkanad, Ernakulam). Fast 5-minute response window.                |
+-------------------------------------+-------------------------------------+
                                      | (If unfulfilled after 5 mins)
                                      v
+---------------------------------------------------------------------------+
|                          WAVE 2: DISTRICT (5 - 25 km)                     |
| Expands to all active donors across the entire Kerala district.           |
+-------------------------------------+-------------------------------------+
                                      | (If critical / rare blood group)
                                      v
+---------------------------------------------------------------------------+
|                          WAVE 3: REGIONAL & ESCORT (25+ km)               |
| Activates adjacent district reserve buffer & verified blood bank networks.|
+---------------------------------------------------------------------------+
```

---

## 4. Privacy & Secure Contact Reveal Flow

1. **Request Creation:** Verified hospital or bystander creates request (e.g., O- trauma at Aster Medcity).
2. **Pseudonymized Dispatch:** Donors receive distance, hospital, and urgency level. Donor contacts in database are marked `LOCKED`.
3. **Donor Acceptance:** Donor reviews urgency and clicks **Accept & Help Patient**.
4. **Cryptographic Unseal:** Database executes `reveal_contact(match_id)`, unsealing `+91 98470 12345` to the requester with One-Touch Direct Call and WhatsApp coordination links, and recording an immutable entry into the `Privacy Audit Log`.

---

## 5. Kerala 14-District & Verified Hospital Network

Viora includes comprehensive geographical mappings for all 14 districts in Kerala:
- **Ernakulam:** Aster Medcity, Amrita Institute of Medical Sciences (AIMS), Rajagiri Hospital, Govt Medical College Ernakulam.
- **Thiruvananthapuram:** KIMSHEALTH, Govt Medical College Trivandrum.
- **Kozhikode:** Aster MIMS Hospital, Govt Medical College Kozhikode.
- **Thrissur:** Jubilee Mission Medical College & Hospital.
- **Kottayam:** Caritas Hospital & Institute of Health Sciences.
- **Alappuzha, Kollam, Palakkad, Malappuram, Kannur, Idukki, Pathanamthitta, Wayanad, Kasaragod:** District nodal coverage with 24/7 blood bank helplines.

---

## 6. How to Run Locally

### Method 1: Instant Python Server (Zero Dependencies Required)
```bash
python serve.py
```
Open **`http://localhost:5173`** in any web browser.

### Method 2: Node / Vite Dev Server
```bash
npm install
npm run dev
```

---

## 7. Interactive Golden Path Demo

Click the **"Run Golden Path Demo"** button in the top navigation to watch an automated 4-step emergency simulation:
1. System prepares an urgent O- blood request for a road trauma patient at Aster Medcity, Kakkanad.
2. Wave 1 matching dispatches immediately to nearby O- donors.
3. Switch to donor persona (Akshay Varma) with urgent chime alert and dispatch modal.
4. Donor accepts -> Contact securely unseals -> Audit log updated.

---

## 8. Authors & Credits
- **Team Aevora**
- **Jain University — School of Future**
- Designed for **Challenge SC-12: District Blood Donor Matching**
