/**
 * VIORA Requester Dashboard & District Transparency Feed View
 */

import { CONFIG } from '../utils/constants.js';
import { store } from '../core/state.js';

export function renderRequesterDashboardView() {
  const state = store.state;
  const requests = state.requests || [];
  const donors = state.donors || [];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      <!-- Top Title -->
      <div class="border-b border-slate-200 pb-6">
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold uppercase mb-2">
          <i data-lucide="shield" class="w-3.5 h-3.5"></i>
          <span>Public Transparency</span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900 font-display">Kerala District Blood Network</h1>
        <p class="text-sm text-slate-600 mt-1">
          Real-time transparency into blood demand and donor readiness across all 14 Kerala districts.
        </p>
      </div>

      <!-- District Availability Grid -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900 font-display">14 Districts Readiness Matrix</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          ${CONFIG.KERALA_DISTRICTS.map(district => {
            const districtDonors = donors.filter(d => d.district === district);
            const eligibleDonors = districtDonors.filter(d => d.eligibility?.isEligible && d.available);
            const districtReqs = requests.filter(r => r.district === district && r.status !== 'fulfilled');

            return `
              <div class="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-rose-300 transition space-y-2">
                <div class="text-xs font-extrabold text-slate-900 truncate">${district}</div>
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-slate-500">Donors:</span>
                  <span class="font-bold text-slate-800">${districtDonors.length}</span>
                </div>
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-slate-500">Eligible:</span>
                  <span class="font-bold text-emerald-700">${eligibleDonors.length}</span>
                </div>
                <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                  <span class="text-slate-500">Active Reqs:</span>
                  <span class="font-bold ${districtReqs.length > 0 ? 'text-rose-700' : 'text-slate-400'}">${districtReqs.length}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Live Feed of Requests -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900 font-display">Public Request Log</h2>
        
        <div class="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
          <table class="w-full text-left text-xs sm:text-sm mobile-card-table">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-extrabold">
              <tr>
                <th class="px-5 py-3">Blood Group</th>
                <th class="px-5 py-3">Hospital & District</th>
                <th class="px-5 py-3">Units</th>
                <th class="px-5 py-3">Urgency</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3">Time</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${requests.length === 0 ? `
                <tr><td colspan="6" class="px-5 py-8 text-center text-slate-500">No requests recorded yet.</td></tr>
              ` : requests.map(req => `
                <tr class="hover:bg-slate-50/80 transition">
                  <td class="px-5 py-3 font-extrabold text-rose-800 font-display text-sm">${req.blood_group}</td>
                  <td class="px-5 py-3">
                    <div class="font-bold text-slate-900">${req.hospital_name}</div>
                    <div class="text-xs text-slate-500">${req.district}</div>
                  </td>
                  <td class="px-5 py-3 font-semibold text-slate-700">${req.units_required} unit${req.units_required > 1 ? 's' : ''}</td>
                  <td class="px-5 py-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${req.urgency === 'critical' ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-800'}">
                      ${req.urgency}
                    </span>
                  </td>
                  <td class="px-5 py-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${req.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-50 text-indigo-700'}">
                      ${req.status}
                    </span>
                  </td>
                  <td class="px-5 py-3 text-xs text-slate-400">
                    ${new Date(req.created_at).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}
