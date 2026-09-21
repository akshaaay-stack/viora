# VIORA — Phase 1 Audit Report
**Challenge SC-12 · District Blood Donor Matching · Team AEVORA**
**Audit Date:** 2026-09-21
**Environment:** Local Frontend (`http://localhost:5173`) · Supabase Project `jpultvoodifhjqmbsjvh`

---

## 1. Executive Summary

A comprehensive read-only audit of the VIORA codebase and Supabase backend was executed according to Phase 1 guidelines. The core application structure and approved visual design are solid. However, critical database RPC type mismatches, schema duplications, and missing notification-to-match-detail routing were identified that prevent end-to-end reliability.

---

## 2. Interaction Inventory

| Control / Element | Location | Expected Behaviour | Current Behaviour | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Brand Logo** | Navbar | Switch to Request Blood view | Switches to Request Blood view | **WORKS** |
| **Request Blood Tab** | Navbar | Switch to Request Blood view (`#view-request`) | Switches view | **WORKS** |
| **Donor Portal Tab** | Navbar | Switch to Donor Portal view (`#view-donor`) | Switches view | **WORKS** |
| **Live Matches Tab** | Navbar | Switch to Live Matches tracker view (`#view-tracker`) | Switches view | **WORKS** |
| **Hospitals Tab** | Navbar | Switch to Hospitals directory view (`#view-hospitals`) | Switches view | **WORKS** |
| **104 Helpline Link** | Navbar | Dial `tel:104` | Initiates phone call | **WORKS** |
| **Hero CTA: Request Blood** | Hero Left | Smooth scroll to `#requestBloodFormAnchor` | Scrolls to anchor | **WORKS** |
| **Hero CTA: Become a Donor** | Hero Left | Switch to Donor Portal view | Switches view | **WORKS** |
| **Blood Group Cards** | Request Form | Select ABO/Rh group (O-, O+, A-, A+, B-, B+, AB-, AB+) | Updates state & visual active card | **WORKS** |
| **Units Stepper (+ / -)** | Request Form | Increment/decrement pints (1–10) | Updates `reqUnitsCount` | **WORKS** |
| **Urgency Selector** | Request Form | Select CRITICAL / EMERGENCY / STANDARD | Updates select value | **WORKS** |
| **District Selector** | Request Form | Select Kerala District; cascade localities & hospitals | Cascades localities & hospitals | **WORKS** |
| **Locality Selector** | Request Form | Select area within district | Populates options | **WORKS** |
| **Hospital Selector** | Request Form | Select hospital within district | Populates options | **WORKS** |
| **Submit Emergency Request** | Request Form | Validate form, call backend RPC, insert request, match donors, trigger notifications | Inserts client-side into `requests` table instead of RPC `create_and_match_blood_request` | **BROKEN / BYPASS** |
| **Readiness Switch** | Donor Portal | Toggle availability ON/OFF, persist to Supabase `donors.available`, update matching | Updates `donors.available`, but lacks optimistic revert and proper `role="switch"` ARIA attributes | **PARTIAL** |
| **Donor Persona Switcher** | Donor Portal | Switch test donor persona for reviewer walkthrough | Updates loaded persona | **WORKS** |
| **Incoming Alert Notification** | Donor Portal | Click notification → mark read in DB → navigate to deep-linkable Match Detail view (`#/match/<id>`) | Renders alert card inline without dedicated route / deep link | **MISSING ROUTE** |
| **Accept Dispatch Button** | Alert / Match Detail | Atomic idempotent accept via RPC `accept_blood_match`, update match & request, unlock contact | Updates `request_matches` directly with client query instead of secure atomic RPC | **BROKEN / BYPASS** |
| **Decline Dispatch Button** | Alert / Match Detail | Atomic decline via RPC `decline_blood_match`, remove from pending | Updates `request_matches` directly | **BROKEN / BYPASS** |
| **Revealed Contact View** | Requester Tracker | Call `get_revealed_contact`, show unmasked contact with Call & WhatsApp links | Client-side unmasking from loaded state instead of secure RPC | **BROKEN / BYPASS** |
| **Hospital Search & Filter** | Hospitals View | Filter 24/7 blood banks by district & text query | Filters grid dynamically | **WORKS** |
| **Request Here CTA** | Hospitals Card | Prefill district & hospital in Request form and navigate | Prefills and switches tab | **WORKS** |
| **Auth Modal (OTP & PIN)** | Auth Overlay | 6-digit OTP verification + SHA-256 Access PIN setup/login | Functions locally with fallback; uses `user_profiles` | **WORKS** |

---

## 3. Console Errors & Network Request Audit

1. **`create_and_match_blood_request` RPC Failure:**
   - **Error:** `ERROR: 42883: operator does not exist: text = boolean`
   - **Root Cause:** In PostgreSQL function `create_and_match_blood_request`, the query filters `WHERE d.available = TRUE`. The `donors.available` column is of type `text` (`'available'`, `'unavailable'`, `'cooldown'`). Comparing `text = boolean` throws a runtime SQL error.

2. **`get_platform_stats` RPC Failure:**
   - **Error:** `ERROR: 42883: operator does not exist: text = boolean`
   - **Root Cause:** In PostgreSQL function `get_platform_stats`, line 14 filters `WHERE is_donor_eligible(last_donation_date) = TRUE AND available = TRUE`. Comparing `text = boolean` throws a runtime SQL error.

---

## 4. Frontend ↔ Supabase Schema & Data Layer Mismatches

| Aspect | Database Schema | Frontend / Implementation | Issue / Fix Required |
| :--- | :--- | :--- | :--- |
| **Request Table** | `blood_requests` (`id`, `requester_name`, `requester_phone`, `blood_group`, `units_required`, `district`, `hospital_name`, `locality`, `urgency`, `status`, `notes`) | Frontend was inserting into legacy `requests` table | Must use canonical `blood_requests` table via `create_and_match_blood_request` RPC. |
| **Match Table** | `request_matches` (`id`, `request_id`, `donor_id`, `match_score`, `eligibility_status`, `notification_status`, `status`) | Frontend inserted directly into `request_matches` | RPC handles atomic insertion of match rows with `status = 'notified'`. |
| **Notifications** | `notifications` (`id`, `donor_id`, `request_id`, `type`, `title`, `message`, `read`) | Frontend inserted directly into `notifications` | RPC automatically creates notification records linked to `request_id` and `donor_id`. |
| **Donor Availability Column** | `donors.available` is `text` (`'available'`, `'unavailable'`, `'cooldown'`) | RPCs expected `boolean` | Fix RPCs to check `(d.available = 'available' OR d.available = 'true' OR d.available = '1')`. |
| **Live Stats** | `get_platform_stats()` RPC exists | Frontend fell back to hardcoded metrics (`54`, `48`, `14/14`) | Query live data from `get_platform_stats()` on page mount and update UI. |

---

## 5. Security & RLS Audit

| Security Rule | Status | Evidence / Notes |
| :--- | :---: | :--- |
| **No `service_role` key in frontend** | **PASS** | `env.js` and `app.js` strictly use public/anon key `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`. No service role key present. |
| **RLS Enabled on Public Tables** | **PASS** | RLS enabled on `donors`, `blood_requests`, `request_matches`, `notifications`, `hospitals`, `platform_settings`. |
| **Contact Privacy Protection** | **FAIL (Fix Needed)** | Phone numbers must not be exposed to requesters before acceptance. Contact reveal must strictly go through `get_revealed_contact` RPC which validates that `request_matches.status = 'accepted'`. |
| **SECURITY DEFINER Functions Search Path** | **PASS / ENHANCE** | Add explicit `SET search_path = public` to all migration updates to protect against search path injection. |
| **No Sensitive Data in localStorage** | **PASS** | Only non-sensitive session profile metadata cached in localStorage; PINs hashed with SHA-256 before transport/verification. |

---

## 6. Prioritized Bug & Remediation List

### P0 (Demo Blockers)
1. **Fix `create_and_match_blood_request` RPC:** Resolve `operator does not exist: text = boolean` on `d.available` and ensure `blood_requests`, `request_matches`, and `notifications` are created atomically.
2. **Fix `get_platform_stats` RPC:** Resolve `operator does not exist: text = boolean` on `available = TRUE` and connect frontend hero stats to live database metrics.
3. **Connect Frontend Request Form to `create_and_match_blood_request` RPC:** Replace direct client table inserts with the secure database RPC.
4. **Connect Accept / Decline Actions to `accept_blood_match` and `decline_blood_match` RPCs:** Enforce atomic database state machine transitions.
5. **Connect Privacy Gate to `get_revealed_contact` RPC:** Guarantee zero contact leakage before acceptance.

### P1 (Feature & Navigation Fixes)
6. **Notification Click → Deep-Linkable Match Detail Route (`#/match/<id>`):** Implement hash-based SPA routing so clicking any notification or alert marks it read in Supabase and opens the dedicated Match Detail view with the explainable "Why You Matched" matrix.
7. **Donor Availability Switch UX:** Implement optimistic UI update with instant disabled saving state and automatic rollback on network failure; ensure ARIA switch semantics.
8. **Realtime & Fallback Refetching:** Single clean subscription channel on `request_matches`, `notifications`, and `donors` with graceful query refetch fallback.

### P2 (Polish & Accessibility)
9. **Zero Console Errors:** Remove all unhandled exceptions and redundant console noise.
10. **Full Viewport Responsive Check:** Verify 320px to 1440px layout integrity across all tabs.
