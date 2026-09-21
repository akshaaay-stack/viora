/**
 * VIORA Landing Page View
 * Challenge: SC-12 — District Blood Donor Matching
 * Tagline: "The right donor, at the right moment — not everyone, all at once."
 */

import { CONFIG } from '../utils/constants.js';
import { store } from '../core/state.js';

export function renderLandingView() {
  const stats = store.state.platformStats || {
    total_donors: 19,
    eligible_donors: 16,
    active_requests: 2,
    accepted_matches: 1
  };

  return `
    <div class="space-y-16 pb-20">
      
      <!-- ====================================================================
           HERO SECTION
           ==================================================================== -->
      <section class="relative overflow-hidden bg-gradient-to-b from-rose-50/60 via-white to-white py-16 sm:py-24 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-900 text-xs font-semibold mb-6 animate-pulse-soft">
            <i data-lucide="shield-check" class="w-4 h-4 text-rose-700"></i>
            <span>Challenge SC-12 • Kerala District Matching Protocol</span>
          </div>

          <!-- Main Title & Preserved Tagline -->
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight font-display mb-6">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-900 via-rose-700 to-red-600">VIORA</span>
          </h1>

          <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight font-display max-w-4xl mx-auto mb-6">
            "${CONFIG.TAGLINE}"
          </p>

          <!-- Supporting Message -->
          <p class="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            ${CONFIG.SUBTITLE}
          </p>

          <!-- Primary & Secondary CTAs -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button onclick="window.vioraApp.nav('request')" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-base shadow-lg shadow-rose-900/20 hover:shadow-rose-900/30 flex items-center justify-center gap-2 transition btn-touch">
              <i data-lucide="search" class="w-5 h-5"></i>
              <span>Find a Donor</span>
            </button>
            <button onclick="window.vioraApp.nav('donor')" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border-2 border-slate-200 hover:border-slate-300 shadow-sm flex items-center justify-center gap-2 transition btn-touch">
              <i data-lucide="heart-handshake" class="w-5 h-5 text-rose-600"></i>
              <span>Become a Donor</span>
            </button>
          </div>

          <!-- Live Platform Metrics Bar -->
          <div class="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div class="p-4 rounded-xl bg-white border border-slate-200/60 shadow-xs">
              <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">${stats.total_donors}</div>
              <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Registered Donors</div>
            </div>
            <div class="p-4 rounded-xl bg-white border border-slate-200/60 shadow-xs">
              <div class="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-display">${stats.eligible_donors}</div>
              <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Currently Eligible</div>
            </div>
            <div class="p-4 rounded-xl bg-white border border-slate-200/60 shadow-xs">
              <div class="text-2xl sm:text-3xl font-extrabold text-rose-700 font-display">14 / 14</div>
              <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Kerala Districts</div>
            </div>
            <div class="p-4 rounded-xl bg-white border border-slate-200/60 shadow-xs">
              <div class="text-2xl sm:text-3xl font-extrabold text-indigo-700 font-display">100%</div>
              <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Privacy Protected</div>
            </div>
          </div>

        </div>
      </section>

      <!-- ====================================================================
           VISUAL 5-STEP FLOW REPRESENTATION
           REQUEST → SMART MATCH → NOTIFY → ACCEPT → CONNECT
           ==================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-xs font-extrabold tracking-widest text-rose-700 uppercase">Architecture</h2>
          <p class="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
            How Viora Replaces Broadcast Spam with Precision Matching
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          
          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:border-rose-300 transition">
            <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-lg mb-3">1</div>
            <h3 class="text-base font-bold text-slate-900 mb-1">REQUEST</h3>
            <p class="text-xs text-slate-600 leading-relaxed">Hospital/patient submits blood group, district, and required urgency.</p>
          </div>

          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:border-rose-300 transition">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-lg mb-3">2</div>
            <h3 class="text-base font-bold text-slate-900 mb-1">SMART MATCH</h3>
            <p class="text-xs text-slate-600 leading-relaxed">Database checks 8x8 compatibility, 90-day interval, and district locality.</p>
          </div>

          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:border-rose-300 transition">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg mb-3">3</div>
            <h3 class="text-base font-bold text-slate-900 mb-1">NOTIFY</h3>
            <p class="text-xs text-slate-600 leading-relaxed">Only eligible, compatible donors in the district receive focused in-app alert.</p>
          </div>

          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:border-rose-300 transition">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg mb-3">4</div>
            <h3 class="text-base font-bold text-slate-900 mb-1">ACCEPT</h3>
            <p class="text-xs text-slate-600 leading-relaxed">Donor reviews hospital & units, then taps Accept to volunteer.</p>
          </div>

          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:border-rose-300 transition">
            <div class="w-10 h-10 rounded-xl bg-rose-900 text-white flex items-center justify-center font-bold text-lg mb-3">5</div>
            <h3 class="text-base font-bold text-slate-900 mb-1">CONNECT</h3>
            <p class="text-xs text-slate-600 leading-relaxed">Privacy Gate unlocks authorized contact details for direct coordination.</p>
          </div>

        </div>
      </section>

      <!-- ====================================================================
           SECTION 1: THE PROBLEM (WhatsApp Broadcasts vs Viora)
           ==================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase mb-4">
                The Problem SC-12 Solves
              </div>
              <h2 class="text-2xl sm:text-4xl font-extrabold font-display leading-tight mb-4">
                The Chaos of Unfiltered WhatsApp Broadcasts
              </h2>
              <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                When an emergency occurs, desperate families forward unverified messages to hundreds of WhatsApp groups. This broadcasts sensitive phone numbers publicly, disturbs ineligible people who donated last week, and causes notification fatigue that leads donors to mute groups entirely.
              </p>
              
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <div class="p-1 rounded-full bg-rose-500/20 text-rose-400 mt-0.5"><i data-lucide="x" class="w-4 h-4"></i></div>
                  <span class="text-xs sm:text-sm text-slate-300"><strong>Wasted Outreach:</strong> Ineligible donors are repeatedly disturbed.</span>
                </div>
                <div class="flex items-start gap-3">
                  <div class="p-1 rounded-full bg-rose-500/20 text-rose-400 mt-0.5"><i data-lucide="x" class="w-4 h-4"></i></div>
                  <span class="text-xs sm:text-sm text-slate-300"><strong>Privacy Violation:</strong> Phone numbers leaked to strangers & spammers.</span>
                </div>
                <div class="flex items-start gap-3">
                  <div class="p-1 rounded-full bg-rose-500/20 text-rose-400 mt-0.5"><i data-lucide="x" class="w-4 h-4"></i></div>
                  <span class="text-xs sm:text-sm text-slate-300"><strong>Zero Feedback:</strong> Requester never knows if anyone has seen or accepted.</span>
                </div>
              </div>
            </div>

            <div class="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-inner space-y-4">
              <div class="text-xs font-bold uppercase text-emerald-400 tracking-wider">The Viora Paradigm</div>
              <div class="text-lg font-bold text-white font-display">"The right donor, at the right moment — not everyone, all at once."</div>
              
              <div class="space-y-3 text-xs sm:text-sm text-slate-300">
                <div class="flex items-start gap-2.5">
                  <i data-lucide="check" class="w-4 h-4 text-emerald-400 mt-0.5"></i>
                  <span><strong>Interval Verification:</strong> Only donors with &ge;90 days since last donation are notified.</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <i data-lucide="check" class="w-4 h-4 text-emerald-400 mt-0.5"></i>
                  <span><strong>Cryptographic Privacy Gate:</strong> Numbers remain locked until explicit donor acceptance.</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <i data-lucide="check" class="w-4 h-4 text-emerald-400 mt-0.5"></i>
                  <span><strong>Realtime Coordination:</strong> Instant acceptance alerts with verified hospital details.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ====================================================================
           CORE SECTIONS GRID: SMART MATCHING, PRIVACY, INTERVAL, DISTRICTS
           ==================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <i data-lucide="git-merge" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 font-display">8x8 Blood Group Compatibility</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Database-level compatibility engine understands all 8 blood groups (O-, O+, A-, A+, B-, B+, AB-, AB+). Never confuses universal donors with universal recipients.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <i data-lucide="lock" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 font-display">Cryptographic Privacy Gate</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Phone numbers and emails are masked by default. The <code class="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-indigo-800">get_revealed_contact</code> RPC gate only unlocks contact upon explicit acceptance.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <i data-lucide="calendar" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 font-display">90-Day Interval Protection</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Enforces medical resting intervals server-side. Donors who donated recently are excluded from matching so they are never disturbed prematurely.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <i data-lucide="map-pin" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 font-display">14 Kerala Districts</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              From Kasaragod to Thiruvananthapuram, requests are matched with donors in the exact district and locality of the treating hospital first.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <i data-lucide="activity" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 font-display">Realtime Status Tracking</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Requesters monitor the request lifecycle in real-time: Created &rarr; Matched &rarr; Notified &rarr; Donor Accepted &rarr; Fulfilled.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <i data-lucide="database" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 font-display">PostgreSQL & Supabase Powered</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every action persists directly to Supabase with Row Level Security, real-time WebSocket publications, and audit logs.
            </p>
          </div>

        </div>
      </section>

      <!-- ====================================================================
           CALL TO ACTION
           ==================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-rose-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div class="max-w-3xl mx-auto space-y-6 relative z-10">
            <h2 class="text-3xl sm:text-5xl font-extrabold font-display">
              Ready to eliminate blood donation broadcast spam?
            </h2>
            <p class="text-rose-100 text-sm sm:text-base leading-relaxed">
              Connect with verified, eligible Kerala donors in your district with guaranteed privacy and zero noise.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button onclick="window.vioraApp.nav('request')" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-rose-900 font-bold text-sm shadow-md hover:bg-rose-50 transition btn-touch">
                Create Emergency Request
              </button>
              <button onclick="window.vioraApp.nav('donor')" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-white font-bold text-sm border border-rose-600 transition btn-touch">
                Open Donor Hub
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  `;
}
