/**
 * VIORA Toast Alerts, Badges & Micro-components
 */

import { store } from '../core/state.js';

export function renderToast() {
  const toast = store.state.toast;
  if (!toast) return '';

  return `
    <div class="fixed top-5 right-5 z-50 max-w-sm p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center justify-between gap-3 animate-fade-in">
      <div class="flex items-center gap-2 text-xs font-semibold">
        <i data-lucide="${toast.type === 'success' ? 'check-circle' : toast.type === 'info' ? 'info' : 'alert-circle'}" class="w-4 h-4 ${toast.type === 'success' ? 'text-emerald-400' : toast.type === 'info' ? 'text-sky-400' : 'text-rose-400'}"></i>
        <span>${toast.message}</span>
      </div>
      <button onclick="window.vioraApp.clearToast()" class="text-slate-400 hover:text-white text-xs">✕</button>
    </div>
  `;
}

export function renderStatusBadge(status) {
  switch ((status || '').toLowerCase()) {
    case 'fulfilled':
      return `<span class="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">Fulfilled</span>`;
    case 'accepted':
      return `<span class="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-emerald-600 text-white shadow-xs">Accepted</span>`;
    case 'matched':
      return `<span class="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">Matched</span>`;
    case 'declined':
      return `<span class="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-500">Declined</span>`;
    case 'notified':
      return `<span class="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">Notified</span>`;
    default:
      return `<span class="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-700">${status || 'Pending'}</span>`;
  }
}

export function renderBloodGroupBadge(bg, size = 'md') {
  const sizeClasses = size === 'lg' ? 'px-3.5 py-1.5 text-base' : size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return `<span class="${sizeClasses} rounded-xl bg-rose-100 text-rose-900 font-extrabold font-display border border-rose-200 shadow-2xs">${bg}</span>`;
}
