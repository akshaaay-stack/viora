/**
 * VIORA Notification Center, Profile, and Diagnostic Views
 */

import { store } from '../core/state.js';
import { formatRelativeTime } from '../utils/dates.js';

export function renderNotificationsView() {
  const notifs = store.state.notifications || [];

  return `
    <div class="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div class="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 font-display">Notification Center</h1>
          <p class="text-xs text-slate-500">Live targeted alerts from Supabase PostgreSQL</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
          ${notifs.filter(n => !n.read).length} Unread
        </span>
      </div>

      <div class="space-y-3">
        ${notifs.length === 0 ? `
          <div class="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <i data-lucide="bell-off" class="w-10 h-10 text-slate-300 mx-auto mb-2"></i>
            <div class="text-sm font-bold text-slate-700">No Notifications</div>
            <p class="text-xs text-slate-500 mt-1">You will receive alerts when relevant blood requests match your profile.</p>
          </div>
        ` : notifs.map(n => `
          <div class="p-4 rounded-2xl bg-white border ${n.read ? 'border-slate-200' : 'border-rose-200 bg-rose-50/20 ring-1 ring-rose-100'} shadow-sm flex items-start justify-between gap-4">
            <div class="space-y-1">
              <div class="font-bold text-slate-900 text-sm">${n.title}</div>
              <p class="text-xs text-slate-600 leading-relaxed">${n.message}</p>
              <div class="text-[10px] text-slate-400">${formatRelativeTime(n.created_at)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderProfileView() {
  const donor = store.state.currentDonor;
  return `
    <div class="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-rose-100 text-rose-900 font-extrabold text-2xl flex items-center justify-center font-display">
            ${donor?.blood_group || 'O+'}
          </div>
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900 font-display">${donor?.name || 'Viora User'}</h2>
            <p class="text-xs text-slate-500">${donor?.locality || ''}, ${donor?.district || 'Kerala'} • Registered Donor</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 text-xs">
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div class="font-bold text-slate-500 uppercase text-[10px]">Phone Number</div>
            <div class="text-sm font-semibold text-slate-900 mt-1">${donor?.phone || '+91 98470 XXXXX'}</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div class="font-bold text-slate-500 uppercase text-[10px]">Email</div>
            <div class="text-sm font-semibold text-slate-900 mt-1">${donor?.email || 'donor@kerala.net'}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
