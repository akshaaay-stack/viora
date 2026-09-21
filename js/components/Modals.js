/**
 * VIORA Modal Components
 * Contact Reveal Gate, Donor Onboarding, and In-App Notifications Center
 */

import { VIORA_CONFIG } from '../config.js';
import { store } from '../store.js';

export function renderModals() {
  const state = store.state;
  const activeModal = state.activeModal;
  const toast = state.toast;

  return `
    <!-- Toast Notification -->
    ${toast ? `
      <div class="fixed top-5 right-5 z-50 max-w-sm p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center justify-between gap-3 animate-fade-in">
        <div class="flex items-center gap-2 text-xs font-semibold">
          <i data-lucide="${toast.type === 'success' ? 'check-circle' : 'alert-circle'}" class="w-4 h-4 ${toast.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}"></i>
          <span>${toast.message}</span>
        </div>
        <button onclick="window.vioraApp.clearToast()" class="text-slate-400 hover:text-white text-xs">✕</button>
      </div>
    ` : ''}

    <!-- Contact Reveal Gate Modal -->
    ${activeModal?.type === 'contactReveal' ? renderContactRevealModal(activeModal.data) : ''}

    <!-- Donor Registration Modal -->
    ${activeModal?.type === 'donorRegister' ? renderDonorRegisterModal() : ''}

    <!-- Notifications Center Modal -->
    ${activeModal?.type === 'notifications' ? renderNotificationCenterModal() : ''}
  `;
}

function renderContactRevealModal(contactData) {
  const donor = contactData.donor || {};
  const requester = contactData.requester || {};

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        
        <!-- Header -->
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <i data-lucide="shield-check" class="w-6 h-6"></i>
            </div>
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Authorized Access</span>
              <h3 class="text-xl font-extrabold text-slate-900 font-display">Contact Details Unlocked</h3>
            </div>
          </div>
          <button onclick="window.vioraApp.closeModal()" class="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed">
          The donor has accepted this blood request. You may now coordinate transportation and donation directly.
        </p>

        <!-- Donor Card -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Donor Information</div>
          <div class="flex items-center justify-between">
            <div class="font-bold text-slate-900 text-base">${donor.name || 'Verified Donor'}</div>
            <span class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 font-extrabold text-xs">${donor.blood_group}</span>
          </div>

          <div class="space-y-1.5 text-xs text-slate-700">
            <div class="flex items-center gap-2">
              <i data-lucide="phone" class="w-4 h-4 text-slate-400"></i>
              <strong class="text-slate-900">${donor.phone}</strong>
            </div>
            ${donor.email ? `
              <div class="flex items-center gap-2">
                <i data-lucide="mail" class="w-4 h-4 text-slate-400"></i>
                <span>${donor.email}</span>
              </div>
            ` : ''}
            <div class="flex items-center gap-2">
              <i data-lucide="map-pin" class="w-4 h-4 text-slate-400"></i>
              <span>${donor.locality}, ${donor.district}</span>
            </div>
          </div>
        </div>

        <!-- Requester / Hospital Summary -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Treating Facility</div>
          <div class="font-bold text-slate-900">${requester.hospital || 'Hospital'} (${requester.district})</div>
          <div class="text-slate-600">Requester: ${requester.name} (${requester.phone})</div>
        </div>

        <!-- Direct Actions -->
        <div class="grid grid-cols-2 gap-3 pt-2">
          <a href="tel:${donor.phone}" class="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md">
            <i data-lucide="phone-call" class="w-4 h-4"></i>
            <span>Call Donor</span>
          </a>
          <a href="https://wa.me/${(donor.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(donor.name || '')},%20thank%20you%20for%20accepting%20the%20blood%20request%20on%20Viora." target="_blank" class="py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md">
            <i data-lucide="message-square" class="w-4 h-4 text-emerald-400"></i>
            <span>WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  `;
}

function renderDonorRegisterModal() {
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        
        <div class="flex items-start justify-between">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">Kerala Donor Network</span>
            <h3 class="text-2xl font-extrabold text-slate-900 font-display mt-1">Register as a Donor</h3>
          </div>
          <button onclick="window.vioraApp.closeModal()" class="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
        </div>

        <form onsubmit="window.vioraApp.handleRegisterDonor(event)" class="space-y-4">
          
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Full Name <span class="text-rose-600">*</span></label>
            <input type="text" id="regName" required placeholder="e.g. Arun Kumar" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Blood Group <span class="text-rose-600">*</span></label>
              <select id="regBloodGroup" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-rose-500">
                <option value="">Select</option>
                ${VIORA_CONFIG.BLOOD_GROUPS.map(bg => `<option value="${bg}">${bg}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">District <span class="text-rose-600">*</span></label>
              <select id="regDistrict" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500">
                <option value="">Select District</option>
                ${VIORA_CONFIG.KERALA_DISTRICTS.map(dist => `<option value="${dist}">${dist}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Phone Number <span class="text-rose-600">*</span></label>
              <input type="tel" id="regPhone" required placeholder="+91 9XXXX XXXXX" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500" />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Locality / City <span class="text-rose-600">*</span></label>
              <input type="text" id="regLocality" required placeholder="e.g. Kakkanad" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Email Address</label>
            <input type="email" id="regEmail" placeholder="name@example.com" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500" />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Last Whole Blood Donation Date
            </label>
            <input type="date" id="regLastDonationDate" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500" />
            <p class="text-[11px] text-slate-500 mt-1">Leave blank if you have never donated blood before.</p>
          </div>

          <div class="pt-4">
            <button type="submit" class="w-full py-3.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-sm shadow-md transition">
              Complete Registration
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}

function renderNotificationCenterModal() {
  const notifs = store.state.notifications || [];

  return `
    <div class="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-950/40 backdrop-blur-xs animate-fade-in" onclick="window.vioraApp.closeModal()">
      <div class="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 mt-16 sm:mt-20" onclick="event.stopPropagation()">
        
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <i data-lucide="bell" class="w-4 h-4 text-rose-700"></i>
            <h4 class="text-sm font-bold text-slate-900 font-display">In-App Notifications</h4>
          </div>
          <button onclick="window.vioraApp.closeModal()" class="text-slate-400 hover:text-slate-700 text-xs font-bold">✕</button>
        </div>

        <div class="space-y-2 max-h-80 overflow-y-auto">
          ${notifs.length === 0 ? `
            <div class="text-center py-8 text-xs text-slate-400">
              No new notifications.
            </div>
          ` : notifs.map(n => `
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div class="font-bold text-slate-900">${n.title}</div>
              <p class="text-slate-600 leading-relaxed">${n.message}</p>
              <div class="text-[10px] text-slate-400 pt-1">${new Date(n.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;
}
