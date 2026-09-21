/**
 * VIORA Donor Hub View
 * Prominent 90-Day Eligibility Card, Availability Toggle, Matched Requests Inbox & Contact Reveal
 */

import { VIORA_CONFIG } from '../config.js';
import { calculateDonorEligibility } from '../eligibility.js';
import { store } from '../store.js';

export function renderDonorHubView() {
  const state = store.state;
  const currentDonor = state.currentDonor;
  const allDonors = state.donors || [];

  if (!currentDonor) {
    return `
      <div class="max-w-4xl mx-auto px-4 py-16 text-center">
        <i data-lucide="user-x" class="w-12 h-12 text-slate-400 mx-auto mb-4"></i>
        <h2 class="text-xl font-bold text-slate-800">No Donor Profile Loaded</h2>
        <p class="text-sm text-slate-500 mt-2">Please select a donor or register a new profile below.</p>
        <button onclick="window.vioraApp.openDonorRegistrationModal()" class="mt-4 px-6 py-2.5 rounded-xl bg-rose-700 text-white font-bold text-sm">
          Register as Donor
        </button>
      </div>
    `;
  }

  const eligibility = calculateDonorEligibility(currentDonor.last_donation_date);
  const notifications = state.notifications || [];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Top Bar: Current Donor Identity & Perspective Switcher -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-rose-50 text-rose-800 border-2 border-rose-200 font-extrabold text-xl flex items-center justify-center font-display shadow-sm">
            ${currentDonor.blood_group}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-extrabold text-slate-900 font-display">${currentDonor.name}</h1>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${currentDonor.available ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                ${currentDonor.available ? '● Available' : '○ Paused'}
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i>
              <span>${currentDonor.locality}, ${currentDonor.district}, Kerala</span>
              <span>•</span>
              <span>Trust Score: ${currentDonor.trust_score || 100}%</span>
            </p>
          </div>
        </div>

        <!-- Quick Switcher Between Demo Donors (Crucial for Judge Demo!) -->
        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch Profile:</div>
          </div>
          <select onchange="window.vioraApp.handleSelectDonor(this.value)" class="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500">
            ${allDonors.map(d => `
              <option value="${d.id}" ${d.id === currentDonor.id ? 'selected' : ''}>
                ${d.name} (${d.blood_group} • ${d.district} • ${d.last_donation_date ? 'Donated: ' + d.last_donation_date : 'Never donated'})
              </option>
            `).join('')}
          </select>
          <button onclick="window.vioraApp.openDonorRegistrationModal()" class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1">
            <i data-lucide="user-plus" class="w-3.5 h-3.5"></i>
            <span>New</span>
          </button>
        </div>
      </div>

      <!-- ====================================================================
           PROMINENT 90-DAY DONATION ELIGIBILITY CARD (Core SC-12 Requirement)
           ==================================================================== -->
      <div class="p-6 sm:p-8 rounded-3xl border ${eligibility.isEligible ? 'bg-gradient-to-br from-emerald-900 to-teal-950 text-white border-emerald-800' : 'bg-gradient-to-br from-amber-950 to-slate-900 text-white border-amber-800'} shadow-xl">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div class="space-y-3 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${eligibility.isEligible ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}">
              <i data-lucide="${eligibility.isEligible ? 'check-circle-2' : 'clock'}" class="w-4 h-4"></i>
              <span>${eligibility.badgeLabel}</span>
            </div>

            <h2 class="text-2xl sm:text-3xl font-extrabold font-display">
              ${eligibility.isEligible ? 'You are ready to save a life' : `Next eligible date: ${eligibility.formattedNextDate || 'Pending'}`}
            </h2>

            <p class="text-sm text-slate-300 leading-relaxed">
              ${eligibility.explanation}
            </p>

            <div class="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div class="flex items-center gap-1.5">
                <i data-lucide="calendar" class="w-4 h-4 text-slate-400"></i>
                <span>Last Donation: <strong>${currentDonor.last_donation_date ? currentDonor.last_donation_date : 'No previous donation'}</strong></span>
              </div>
              <div class="flex items-center gap-1.5">
                <i data-lucide="shield" class="w-4 h-4 text-slate-400"></i>
                <span>Mandatory Safe Interval: <strong>${VIORA_CONFIG.MIN_DONATION_INTERVAL_DAYS} Days</strong></span>
              </div>
            </div>
          </div>

          <!-- Right Action: Availability Toggle -->
          <div class="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center sm:text-left space-y-3 min-w-[240px]">
            <div class="text-xs font-bold uppercase tracking-wider text-slate-300">Donation Availability</div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm font-semibold">${currentDonor.available ? 'Active & Ready' : 'Paused / Resting'}</span>
              <button onclick="window.vioraApp.handleToggleAvailability('${currentDonor.id}', ${!currentDonor.available})" class="px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${currentDonor.available ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}">
                ${currentDonor.available ? 'Pause' : 'Activate'}
              </button>
            </div>
            <p class="text-[11px] text-slate-400">
              ${currentDonor.available ? 'You will receive notifications for compatible emergency requests.' : 'You will not receive any requests until you reactivate.'}
            </p>
          </div>

        </div>
      </div>

      <!-- ====================================================================
           INCOMING MATCHED BLOOD REQUESTS (Donor Inbox)
           ==================================================================== -->
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-bold text-slate-900 font-display">Targeted Emergency Requests</h2>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
              ${notifications.length}
            </span>
          </div>
          <span class="text-xs text-slate-500">Only shown if you are compatible, eligible, and in district</span>
        </div>

        ${notifications.length === 0 ? `
          <div class="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <i data-lucide="bell-off" class="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
            <h3 class="text-base font-bold text-slate-800">Your Inbox is Quiet</h3>
            <p class="text-xs text-slate-500 max-w-md mx-auto mt-1">
              "The right donor, at the right moment — not everyone, all at once." You will only be alerted when an emergency specifically requires your blood group in ${currentDonor.district}.
            </p>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${notifications.map(notif => {
              // Retrieve corresponding match from store if available
              const reqMatches = state.requests.flatMap(r => r.request_matches || []);
              const currentMatch = reqMatches.find(m => m.donor_id === currentDonor.id && m.request_id === notif.request_id);
              const isAccepted = currentMatch?.status === 'accepted';
              const isDeclined = currentMatch?.status === 'declined';

              return `
                <div class="p-6 rounded-2xl bg-white border ${isAccepted ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'} shadow-sm space-y-4">
                  
                  <div class="flex items-start justify-between">
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <span class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 font-extrabold text-sm">${currentDonor.blood_group} Needed</span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${isAccepted ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-600 text-white'}">
                          ${isAccepted ? 'Accepted' : isDeclined ? 'Declined' : 'Emergency Alert'}
                        </span>
                      </div>
                      <h3 class="text-base font-bold text-slate-900 mt-2">${notif.title}</h3>
                    </div>
                  </div>

                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    ${notif.message}
                  </p>

                  <!-- Action Buttons -->
                  <div class="pt-2 flex items-center gap-3">
                    ${isAccepted ? `
                      <button onclick="window.vioraApp.revealContact('${currentMatch.id}')" class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm">
                        <i data-lucide="phone-call" class="w-4 h-4"></i>
                        <span>View Coordination Details</span>
                      </button>
                    ` : isDeclined ? `
                      <div class="w-full py-2.5 text-center text-xs font-bold text-slate-400 bg-slate-100 rounded-xl">
                        Request Declined
                      </div>
                    ` : `
                      <button onclick="window.vioraApp.handleAcceptMatch('${currentMatch?.id}', '${currentDonor.id}')" class="flex-1 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-rose-900/10">
                        <i data-lucide="check" class="w-4 h-4"></i>
                        <span>ACCEPT REQUEST</span>
                      </button>
                      <button onclick="window.vioraApp.handleDeclineMatch('${currentMatch?.id}', '${currentDonor.id}')" class="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition">
                        <span>Decline</span>
                      </button>
                    `}
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>

    </div>
  `;
}
