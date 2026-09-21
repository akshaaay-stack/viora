/**
 * VIORA Request Blood View
 */

import { CONFIG, KERALA_DISTRICT_DATA } from '../utils/constants.js';
import { store } from '../core/state.js';

export function renderRequestBloodView() {
  const state = store.state;
  const requests = state.requests || [];
  const activeRequests = requests.filter(r => r.status !== 'fulfilled' && r.status !== 'cancelled');

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      <!-- Top Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold uppercase mb-2">
            <i data-lucide="activity" class="w-3.5 h-3.5"></i>
            <span>Emergency Dispatch</span>
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 font-display">Create Blood Request</h1>
          <p class="text-sm text-slate-600 mt-1">
            Matches directly with verified, eligible donors in your Kerala district without broadcast spam.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button onclick="window.vioraApp.nav('requests')" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 btn-touch">
            <i data-lucide="list" class="w-4 h-4"></i>
            <span>View All District Requests</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left: Blood Request Creation Form (7 cols) -->
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 class="text-xl font-bold text-slate-900 font-display mb-6 flex items-center gap-2">
            <i data-lucide="file-plus" class="w-5 h-5 text-rose-600"></i>
            <span>Patient & Hospital Details</span>
          </h2>

          <form id="bloodRequestForm" onsubmit="window.vioraApp.handleCreateRequest(event)" class="space-y-6">
            
            <!-- Blood Group & Units Required -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Blood Group Needed <span class="text-rose-600">*</span>
                </label>
                <select id="reqBloodGroup" required class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 font-bold text-slate-900 text-base focus:ring-2 focus:ring-rose-500 focus:bg-white transition">
                  <option value="">Select Blood Group</option>
                  ${CONFIG.BLOOD_GROUPS.map(bg => `<option value="${bg}">${bg}</option>`).join('')}
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Units Required <span class="text-rose-600">*</span>
                </label>
                <div class="flex items-center">
                  <input type="number" id="reqUnits" min="1" max="10" value="1" required class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 font-bold text-slate-900 text-base focus:ring-2 focus:ring-rose-500 focus:bg-white transition" />
                </div>
              </div>
            </div>

            <!-- District & Hospital Selector -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  District (Kerala) <span class="text-rose-600">*</span>
                </label>
                <select id="reqDistrict" required onchange="window.vioraApp.handleDistrictChange(this.value)" class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:bg-white transition">
                  <option value="">Select District</option>
                  ${CONFIG.KERALA_DISTRICTS.map(dist => `<option value="${dist}">${dist}</option>`).join('')}
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Hospital Name <span class="text-rose-600">*</span>
                </label>
                <input type="text" id="reqHospital" list="hospitalSuggestions" placeholder="e.g. Aster Medcity, Jubilee Mission" required class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:bg-white transition" />
                <datalist id="hospitalSuggestions"></datalist>
              </div>
            </div>

            <!-- Locality & Urgency -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Hospital Locality / Area
                </label>
                <input type="text" id="reqLocality" placeholder="e.g. Cheranalloor, Edappally" class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:bg-white transition" />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Urgency Level <span class="text-rose-600">*</span>
                </label>
                <select id="reqUrgency" required class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:bg-white transition">
                  <option value="critical">🚨 Critical Emergency (Within 4 hrs)</option>
                  <option value="urgent" selected>⚠️ Urgent (Within 24 hrs)</option>
                  <option value="normal">⏱️ Normal / Scheduled (Within 48 hrs)</option>
                </select>
              </div>
            </div>

            <!-- Requester Contact & Patient Reference -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Requester / Doctor Name <span class="text-rose-600">*</span>
                </label>
                <input type="text" id="reqName" placeholder="Dr. / Sister / Relative Name" required value="Dr. Vinod Kurian" class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:bg-white transition" />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Requester Phone Number <span class="text-rose-600">*</span>
                </label>
                <input type="tel" id="reqPhone" placeholder="+91 98470 XXXXX" required value="+91 98470 00111" class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:bg-white transition" />
              </div>
            </div>

            <!-- Clinical Notes -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Clinical Context / Notes
              </label>
              <textarea id="reqNotes" rows="2" placeholder="e.g. Surgery scheduled tomorrow 8:00 AM. Cross-matching ready at blood bank." class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:bg-white transition"></textarea>
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button type="submit" id="submitRequestBtn" class="w-full py-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-base shadow-lg shadow-rose-900/20 hover:shadow-rose-900/30 flex items-center justify-center gap-2 transition btn-touch">
                <i data-lucide="send" class="w-5 h-5"></i>
                <span>Submit Request & Execute District Match</span>
              </button>
            </div>

          </form>
        </div>

        <!-- Right: Realtime Active Requests Monitor & Privacy Gate (5 cols) -->
        <div class="lg:col-span-5 space-y-6">
          
          <div class="bg-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-emerald-400 live-pulse-indicator"></span>
                <h3 class="text-base font-bold font-display">Live Matching Engine</h3>
              </div>
              <span class="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">SUPABASE REALTIME</span>
            </div>
            
            <p class="text-xs text-slate-300 leading-relaxed">
              When a request is submitted, Viora filters the entire donor base through 8x8 compatibility, the 90-day interval rule, and district proximity.
            </p>

            <div class="bg-slate-800/80 rounded-xl p-3 text-xs space-y-2 border border-slate-700">
              <div class="flex items-center justify-between text-slate-300">
                <span>Active Tracked Requests:</span>
                <span class="font-bold text-white">${activeRequests.length}</span>
              </div>
              <div class="flex items-center justify-between text-slate-300">
                <span>Server-Side Interval Rule:</span>
                <span class="font-bold text-emerald-400">&ge; 90 Days Enforced</span>
              </div>
              <div class="flex items-center justify-between text-slate-300">
                <span>Privacy Authorization Gate:</span>
                <span class="font-bold text-indigo-400">Locked until Accepted</span>
              </div>
            </div>
          </div>

          <!-- Active Requests List -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500">Active Requests in Kerala</h3>
            
            ${activeRequests.length === 0 ? `
              <div class="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <i data-lucide="clipboard-check" class="w-10 h-10 text-slate-300 mx-auto mb-2"></i>
                <div class="text-sm font-bold text-slate-700">No active emergency requests</div>
                <div class="text-xs text-slate-500 mt-1">Submit a request above to trigger matching.</div>
              </div>
            ` : activeRequests.map(req => {
              const matches = req.request_matches || [];
              const acceptedMatch = matches.find(m => m.status === 'accepted');
              const isUrgent = req.urgency === 'critical';

              return `
                <div class="p-5 rounded-2xl bg-white border ${isUrgent ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'} shadow-sm space-y-4">
                  
                  <!-- Request Header -->
                  <div class="flex items-start justify-between">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 font-extrabold text-sm">${req.blood_group}</span>
                        <span class="text-xs font-bold text-slate-700">${req.units_required} Unit${req.units_required > 1 ? 's' : ''}</span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${req.urgency === 'critical' ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-800'}">${req.urgency}</span>
                      </div>
                      <div class="text-sm font-bold text-slate-900 mt-2">${req.hospital_name}</div>
                      <div class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i>
                        <span>${req.locality ? `${req.locality}, ` : ''}${req.district}</span>
                      </div>
                    </div>

                    <div class="text-right">
                      <span class="px-2.5 py-1 rounded-full text-xs font-bold uppercase ${req.status === 'matched' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-700'}">
                        ${req.status}
                      </span>
                    </div>
                  </div>

                  <!-- Multi-Stage Tracking Timeline -->
                  <div class="pt-2 border-t border-slate-100">
                    <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Request Lifecycle</div>
                    <div class="grid grid-cols-4 gap-1 text-center text-[10px] font-semibold">
                      <div class="p-1 rounded bg-rose-50 text-rose-800">1. Created</div>
                      <div class="p-1 rounded ${matches.length > 0 ? 'bg-rose-50 text-rose-800 font-bold' : 'bg-slate-100 text-slate-400'}">2. Matched (${matches.length})</div>
                      <div class="p-1 rounded ${acceptedMatch ? 'bg-emerald-50 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-400'}">3. Accepted</div>
                      <div class="p-1 rounded ${req.status === 'fulfilled' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-400'}">4. Fulfilled</div>
                    </div>
                  </div>

                  <!-- Matched Donors Section with Privacy Masking -->
                  <div class="space-y-2 pt-2 border-t border-slate-100">
                    <div class="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Notified Donors (${matches.length})</span>
                      <span class="text-[11px] text-slate-500">Privacy-Guarded</span>
                    </div>

                    ${matches.length === 0 ? `
                      <div class="text-xs text-slate-500 italic py-2">Searching nearby compatible donors...</div>
                    ` : matches.map(m => {
                      const isAccepted = m.status === 'accepted';
                      const donor = m.donors || {};

                      return `
                        <div class="p-3 rounded-xl ${isAccepted ? 'bg-emerald-50/80 border border-emerald-200' : 'bg-slate-50 border border-slate-200'} space-y-2">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                              <span class="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                                ${donor.name ? donor.name.charAt(0) : 'D'}
                              </span>
                              <div>
                                <div class="text-xs font-bold text-slate-900">${donor.name || 'Verified Donor'}</div>
                                <div class="text-[11px] text-slate-500">${donor.locality || ''}, ${donor.district || req.district} • ${donor.blood_group || req.blood_group}</div>
                              </div>
                            </div>
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isAccepted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}">
                              ${m.status}
                            </span>
                          </div>

                          <!-- Privacy Gate Output -->
                          <div class="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                            ${isAccepted ? `
                              <button onclick="window.vioraApp.revealContact('${m.id}')" class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition btn-touch">
                                <i data-lucide="phone-call" class="w-3.5 h-3.5"></i>
                                <span>View Authorized Contact</span>
                              </button>
                            ` : `
                              <div class="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                                <i data-lucide="lock" class="w-3 h-3 text-slate-400"></i>
                                <span>Phone: •••• •••• •• (Locked until Accepted)</span>
                              </div>
                            `}
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>

                  <!-- Fulfilled Action Button -->
                  ${acceptedMatch ? `
                    <div class="pt-2">
                      <button onclick="window.vioraApp.handleFulfillRequest('${req.id}')" class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center justify-center gap-1.5 btn-touch">
                        <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>
                        <span>Mark Request as Fulfilled</span>
                      </button>
                    </div>
                  ` : ''}

                </div>
              `;
            }).join('')}
          </div>

        </div>

      </div>

    </div>
  `;
}
