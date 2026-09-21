/**
 * VIORA Navigation Bar Component
 */

import { store } from '../core/state.js';
import { navigateTo } from '../core/router.js';

export function renderNavbar() {
  const state = store.state;
  const unreadCount = state.notifications.filter(n => !n.read).length;

  return `
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">
          
          <!-- Brand Logo & Tagline -->
          <div class="flex items-center gap-3 cursor-pointer" onclick="window.vioraApp.nav('landing')">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-900 via-rose-700 to-red-600 flex items-center justify-center text-white shadow-md shadow-rose-900/20">
              <i data-lucide="droplet" class="w-6 h-6 fill-current"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-2xl font-extrabold tracking-tight text-slate-900 font-display">VIORA</span>
                <span class="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-rose-50 text-rose-800 border border-rose-200 rounded-full">Kerala SC-12</span>
              </div>
              <p class="hidden md:block text-[11px] text-slate-500 font-medium">District Blood Matching • Privacy-First</p>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="hidden lg:flex items-center gap-1">
            <button onclick="window.vioraApp.nav('landing')" class="px-3.5 py-2 rounded-lg text-sm font-medium transition ${state.activeTab === 'landing' ? 'text-rose-700 bg-rose-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}">
              Home
            </button>
            <button onclick="window.vioraApp.nav('request')" class="px-3.5 py-2 rounded-lg text-sm font-medium transition ${state.activeTab === 'request' ? 'text-rose-700 bg-rose-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}">
              Request Blood
            </button>
            <button onclick="window.vioraApp.nav('donor')" class="px-3.5 py-2 rounded-lg text-sm font-medium transition ${state.activeTab === 'donor' ? 'text-rose-700 bg-rose-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}">
              Donor Hub
            </button>
            <button onclick="window.vioraApp.nav('requests')" class="px-3.5 py-2 rounded-lg text-sm font-medium transition ${state.activeTab === 'requests' ? 'text-rose-700 bg-rose-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}">
              District Feed
            </button>
            <button onclick="window.vioraApp.nav('admin')" class="px-3.5 py-2 rounded-lg text-sm font-medium transition ${state.activeTab === 'admin' ? 'text-rose-700 bg-rose-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}">
              Admin & Data
            </button>
          </nav>

          <!-- Right Action Center -->
          <div class="flex items-center gap-2 sm:gap-3">
            
            <!-- Guided Hackathon Demo Button -->
            <button onclick="window.vioraApp.startDemoTour()" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm hover:from-amber-600 hover:to-amber-700 transition">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
              <span>60s Judge Demo</span>
            </button>

            <!-- Notifications Center Trigger -->
            <button onclick="window.vioraApp.openModal({ type: 'notifications' })" class="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition" title="Notifications">
              <i data-lucide="bell" class="w-5 h-5"></i>
              ${unreadCount > 0 ? `
                <span class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  ${unreadCount}
                </span>
              ` : ''}
            </button>

            <!-- Role Perspective Switcher -->
            <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button onclick="window.vioraApp.switchRole('requester')" class="px-2.5 py-1 rounded-lg text-xs font-semibold transition ${state.userRole === 'requester' ? 'bg-white text-rose-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
                Requester
              </button>
              <button onclick="window.vioraApp.switchRole('donor')" class="px-2.5 py-1 rounded-lg text-xs font-semibold transition ${state.userRole === 'donor' ? 'bg-white text-rose-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
                Donor
              </button>
              <button onclick="window.vioraApp.switchRole('admin')" class="px-2.5 py-1 rounded-lg text-xs font-semibold transition ${state.userRole === 'admin' ? 'bg-white text-rose-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
                Admin
              </button>
            </div>

          </div>

        </div>
      </div>

      <!-- Mobile Sub-Navigation -->
      <div class="lg:hidden flex items-center justify-around px-2 py-2 border-t border-slate-100 bg-slate-50/80 overflow-x-auto text-xs font-medium">
        <button onclick="window.vioraApp.nav('landing')" class="px-3 py-1.5 rounded-lg whitespace-nowrap ${state.activeTab === 'landing' ? 'text-rose-700 bg-white shadow-xs font-bold' : 'text-slate-600'}">Home</button>
        <button onclick="window.vioraApp.nav('request')" class="px-3 py-1.5 rounded-lg whitespace-nowrap ${state.activeTab === 'request' ? 'text-rose-700 bg-white shadow-xs font-bold' : 'text-slate-600'}">Request</button>
        <button onclick="window.vioraApp.nav('donor')" class="px-3 py-1.5 rounded-lg whitespace-nowrap ${state.activeTab === 'donor' ? 'text-rose-700 bg-white shadow-xs font-bold' : 'text-slate-600'}">Donor Hub</button>
        <button onclick="window.vioraApp.nav('requests')" class="px-3 py-1.5 rounded-lg whitespace-nowrap ${state.activeTab === 'requests' ? 'text-rose-700 bg-white shadow-xs font-bold' : 'text-slate-600'}">District Feed</button>
        <button onclick="window.vioraApp.nav('admin')" class="px-3 py-1.5 rounded-lg whitespace-nowrap ${state.activeTab === 'admin' ? 'text-rose-700 bg-white shadow-xs font-bold' : 'text-slate-600'}">Admin</button>
      </div>
    </header>
  `;
}
