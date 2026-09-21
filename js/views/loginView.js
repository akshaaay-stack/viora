/**
 * VIORA Authentication Login View
 */

import { store } from '../core/state.js';
import { signInUser } from '../core/auth.js';
import { mapErrorMessage } from '../core/errors.js';

export function renderLoginView() {
  return `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div class="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mx-auto shadow-sm">
            <i data-lucide="log-in" class="w-6 h-6"></i>
          </div>
          <h2 class="text-2xl font-extrabold text-slate-900 font-display">Sign In to VIORA</h2>
          <p class="text-xs text-slate-500">Access emergency blood matching & donor management</p>
        </div>

        <form onsubmit="window.vioraApp.handleLoginForm(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Email Address</label>
            <input type="email" id="loginEmail" required placeholder="doctor@hospital.org or donor@kerala.net" class="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500" />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Password</label>
            <input type="password" id="loginPassword" required placeholder="••••••••" class="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500" />
          </div>

          <div class="pt-2">
            <button type="submit" id="loginSubmitBtn" class="w-full py-3.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 btn-touch">
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
              <span>Sign In</span>
            </button>
          </div>
        </form>

        <!-- Quick Demo Switcher Profiles -->
        <div class="pt-4 border-t border-slate-100">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Hackathon Quick Login:</div>
          <div class="grid grid-cols-3 gap-2">
            <button onclick="window.vioraApp.quickDemoLogin('requester')" class="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 text-center transition">
              Requester
            </button>
            <button onclick="window.vioraApp.quickDemoLogin('donor')" class="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 text-center transition">
              Donor (O+)
            </button>
            <button onclick="window.vioraApp.quickDemoLogin('admin')" class="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 text-center transition">
              Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}
