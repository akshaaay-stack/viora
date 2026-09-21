/**
 * VIORA Master Application Orchestrator & Router
 * Challenge: SC-12 — District Blood Donor Matching
 * Tagline: "The right donor, at the right moment — not everyone, all at once."
 */

import { store } from './core/state.js';
import { navigateTo } from './core/router.js';
import { waitForSupabaseSDK, getSupabase } from './core/supabase.js';
import { setupRealtimeListeners } from './core/realtime.js';

import { DonorService } from './services/donorService.js';
import { RequestService } from './services/requestService.js';
import { MatchingService } from './services/matchingService.js';
import { PrivacyService } from './services/privacyService.js';
import { AdminService } from './services/adminService.js';

import { renderNavbar } from './components/navbar.js';
import { renderModalOverlay } from './components/modal.js';
import { renderToast } from './components/toast.js';

import { renderLandingView } from './views/landingView.js';
import { renderRequestBloodView } from './views/requestBloodView.js';
import { renderDonorDashboardView } from './views/donorDashboardView.js';
import { renderRequesterDashboardView } from './views/requesterDashboardView.js';
import { renderAdminDashboardView } from './views/adminDashboardView.js';
import { renderNotificationsView, renderProfileView } from './views/notificationsView.js';
import { renderLoginView } from './views/loginView.js';
import { renderDemoTourOverlay } from './views/demoTourView.js';

import { KERALA_DISTRICT_DATA } from './utils/constants.js';

class VioraApp {
  constructor() {
    this.appContainer = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    console.log('[VIORA] 🚀 Initializing VIORA Core Engine...');

    this.appContainer = document.getElementById('app');

    // Subscribe to state changes
    store.subscribe(() => this.render());

    // Render initial UI immediately
    this.render();

    // Bootstrap data connection
    await this.bootstrapData();

    // Setup Realtime WebSocket Sync in background
    try {
      setupRealtimeListeners((table, payload) => {
        console.log(`[VIORA Realtime] Sync event (${table})`);
        this.refreshData(false);
      });
    } catch (e) {
      console.warn('[VIORA] Realtime setup warning:', e);
    }
  }

  async bootstrapData() {
    store.setState({ connectionState: 'connecting', connectionError: null, isLoading: true });
    try {
      await waitForSupabaseSDK(3000);
      const client = getSupabase();
      if (!client) throw new Error('Supabase client failed to initialize');

      console.log('[VIORA] Fetching initial datasets...');
      const [donors, requests, stats] = await Promise.all([
        DonorService.fetchAllDonors(),
        RequestService.fetchRequests(),
        AdminService.fetchPlatformStats()
      ]);

      const defaultDonor = donors.find(d => d.name.includes('Faisal')) || donors[0] || null;

      store.setState({
        donors,
        requests,
        platformStats: stats,
        currentDonor: defaultDonor,
        connectionState: 'connected',
        connectionError: null,
        isLoading: false
      });

      if (defaultDonor) {
        const { matches, notifications } = await DonorService.fetchDonorInbox(defaultDonor.id);
        store.setState({ notifications });
      }
    } catch (err) {
      console.error('[VIORA] Bootstrap error:', err);
      store.setState({
        connectionState: 'error',
        connectionError: err.message || 'Unable to connect to Viora database services',
        isLoading: false
      });
    }
  }

  async refreshData(showToastAlert = true) {
    try {
      const [requests, stats] = await Promise.all([
        RequestService.fetchRequests(),
        AdminService.fetchPlatformStats()
      ]);
      store.setState({ requests, platformStats: stats });

      if (store.state.currentDonor) {
        const { notifications } = await DonorService.fetchDonorInbox(store.state.currentDonor.id);
        store.setState({ notifications });
      }
      if (showToastAlert) {
        store.showToast('Data synchronized with Supabase', 'success');
      }
    } catch (err) {
      console.warn('[VIORA] Refresh error:', err);
    }
  }

  render() {
    if (!this.appContainer) return;
    const state = store.state;

    // 1. Connection Error Screen
    if (state.connectionState === 'error') {
      this.appContainer.innerHTML = `
        <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
          <div class="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
            <div class="w-16 h-16 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mx-auto shadow-inner">
              <i data-lucide="wifi-off" class="w-8 h-8"></i>
            </div>
            <div class="space-y-2">
              <h2 class="text-2xl font-extrabold text-slate-900 font-display">Connection Notice</h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                ${state.connectionError || 'Unable to connect to Viora database services.'}
              </p>
            </div>
            <button onclick="window.vioraApp.bootstrapData()" class="w-full py-3.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 btn-touch">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
              <span>Retry Connection</span>
            </button>
            <p class="text-[11px] text-slate-400">Target Node: jpultvoodifhjqmbsjvh • Kerala Cluster</p>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }


    // 3. Connected Application Layout
    let mainView = '';
    switch (state.activeTab) {
      case 'landing':
        mainView = renderLandingView();
        break;
      case 'request':
        mainView = renderRequestBloodView();
        break;
      case 'donor':
        mainView = renderDonorDashboardView();
        break;
      case 'requests':
        mainView = renderRequesterDashboardView();
        break;
      case 'admin':
        mainView = renderAdminDashboardView();
        break;
      case 'notifications':
        mainView = renderNotificationsView();
        break;
      case 'profile':
        mainView = renderProfileView();
        break;
      case 'login':
        mainView = renderLoginView();
        break;
      default:
        mainView = renderLandingView();
    }

    this.appContainer.innerHTML = `
      <div class="min-h-screen flex flex-col bg-slate-50/50">
        ${renderNavbar()}
        <main class="flex-1">
          ${mainView}
        </main>
        
        <footer class="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
          <div class="max-w-7xl mx-auto px-4 space-y-2">
            <div class="flex items-center justify-center gap-2 font-bold text-slate-700">
              <span>VIORA</span>
              <span>•</span>
              <span>Kerala District Blood Donor Matching Protocol</span>
            </div>
            <p class="italic text-slate-600">"The right donor, at the right moment — not everyone, all at once."</p>
            <p class="text-[11px] text-slate-400">Challenge SC-12 • Powered by Supabase PostgreSQL with Server-Side Privacy & Interval Enforcement</p>
          </div>
        </footer>

        ${renderDemoTourOverlay()}
        ${renderModalOverlay()}
        ${renderToast()}
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Navigation
  nav(view, params = {}) {
    navigateTo(view, params);
  }

  switchRole(role) {
    store.setState({ userRole: role });
    if (role === 'donor') this.nav('donor');
    else if (role === 'requester') this.nav('request');
    else if (role === 'admin') this.nav('admin');
  }

  handleDistrictChange(district) {
    const dataList = document.getElementById('hospitalSuggestions');
    if (!dataList) return;
    dataList.innerHTML = '';
    const districtInfo = KERALA_DISTRICT_DATA[district];
    if (districtInfo && districtInfo.hospitals) {
      districtInfo.hospitals.forEach(h => {
        const option = document.createElement('option');
        option.value = h.name;
        option.innerText = `${h.name} (${h.locality})`;
        dataList.appendChild(option);
      });
    }
  }

  // Requester Actions
  async handleCreateRequest(event) {
    event.preventDefault();
    const btn = document.getElementById('submitRequestBtn');
    if (btn) btn.disabled = true;

    try {
      const bloodGroup = document.getElementById('reqBloodGroup').value;
      const unitsRequired = document.getElementById('reqUnits').value;
      const district = document.getElementById('reqDistrict').value;
      const hospitalName = document.getElementById('reqHospital').value;
      const locality = document.getElementById('reqLocality')?.value || '';
      const urgency = document.getElementById('reqUrgency').value;
      const requesterName = document.getElementById('reqName').value;
      const requesterPhone = document.getElementById('reqPhone').value;
      const notes = document.getElementById('reqNotes')?.value || '';

      const result = await MatchingService.createAndMatchRequest({
        bloodGroup,
        unitsRequired,
        district,
        hospitalName,
        locality,
        urgency,
        requesterName,
        requesterPhone,
        notes
      });

      if (result && result.success) {
        if (window.confetti) {
          window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        }
        store.showToast(`Request created! ${result.matched_count} eligible donors matched in ${district}.`, 'success');
        await this.refreshData(false);
      } else {
        store.showToast(result?.error || 'Failed to create request', 'error');
      }
    } catch (err) {
      console.error('[VIORA] Create request error:', err);
      store.showToast(err.message || 'Error executing request matching', 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  // Donor Actions
  handleSelectDonor(donorId) {
    const donor = store.state.donors.find(d => d.id === donorId);
    if (donor) {
      store.setState({ currentDonor: donor });
      DonorService.fetchDonorInbox(donorId).then(({ notifications }) => {
        store.setState({ notifications });
      });
    }
  }

  async handleToggleAvailability(donorId, available) {
    try {
      await DonorService.toggleAvailability(donorId, available);
      const donors = await DonorService.fetchAllDonors();
      const current = donors.find(d => d.id === donorId);
      store.setState({ donors, currentDonor: current });
      store.showToast(available ? 'Availability activated!' : 'Availability paused.', 'success');
    } catch (err) {
      store.showToast('Failed to update availability', 'error');
    }
  }

  async handleAcceptMatch(matchId, donorId) {
    try {
      const res = await MatchingService.acceptMatch(matchId, donorId);
      if (res.success) {
        if (window.confetti) {
          window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        store.showToast('Request Accepted! Contact details unlocked.', 'success');
        await this.refreshData(false);
        await this.revealContact(matchId);
      } else {
        store.showToast(res.error || 'Could not accept request', 'error');
      }
    } catch (err) {
      store.showToast(err.message || 'Acceptance error', 'error');
    }
  }

  async handleDeclineMatch(matchId, donorId) {
    try {
      const res = await MatchingService.declineMatch(matchId, donorId);
      if (res.success) {
        store.showToast('Request declined', 'info');
        await this.refreshData(false);
      }
    } catch (err) {
      store.showToast('Decline error', 'error');
    }
  }

  async revealContact(matchId) {
    try {
      const contactData = await PrivacyService.getRevealedContact(matchId);
      if (contactData.is_authorized) {
        store.openModal({ type: 'contactReveal', data: contactData });
      } else {
        store.showToast(contactData.message || 'Access denied by privacy gate', 'error');
      }
    } catch (err) {
      store.showToast('Error querying privacy gate', 'error');
    }
  }

  async handleFulfillRequest(requestId) {
    try {
      const res = await RequestService.fulfillRequest(requestId);
      if (res.success) {
        store.showToast('Request marked as Fulfilled! Donor interval updated.', 'success');
        await this.refreshData(false);
      }
    } catch (err) {
      store.showToast('Error fulfilling request', 'error');
    }
  }

  async handleRegisterDonor(event) {
    event.preventDefault();
    try {
      const name = document.getElementById('regName').value;
      const phone = document.getElementById('regPhone').value;
      const email = document.getElementById('regEmail')?.value || null;
      const bloodGroup = document.getElementById('regBloodGroup').value;
      const district = document.getElementById('regDistrict').value;
      const locality = document.getElementById('regLocality').value;
      const lastDonationDate = document.getElementById('regLastDonationDate')?.value || null;

      const newDonor = await DonorService.registerDonor({
        name,
        phone,
        email,
        bloodGroup,
        district,
        locality,
        lastDonationDate
      });

      store.showToast('Donor profile registered successfully!', 'success');
      this.closeModal();
      const donors = await DonorService.fetchAllDonors();
      const current = donors.find(d => d.id === newDonor.id) || donors[0];
      store.setState({ donors, currentDonor: current, userRole: 'donor' });
      this.nav('donor');
    } catch (err) {
      store.showToast(err.message || 'Registration failed', 'error');
    }
  }

  // Modals & Toasts
  openModal(modalData) {
    store.openModal(modalData);
  }

  closeModal() {
    store.closeModal();
  }

  clearToast() {
    store.clearToast();
  }

  // Quick Demo Login for Judges
  quickDemoLogin(role) {
    this.switchRole(role);
    store.showToast(`Switched perspective to ${role.toUpperCase()}`, 'info');
  }

  // Hackathon Demo Tour Engine
  startDemoTour() {
    window.vioraDemoStep = 1;
    this.nav('landing');
  }

  advanceDemoTour(step) {
    window.vioraDemoStep = step;
    if (step === 2) this.nav('request');
    if (step === 3) this.nav('request');
    if (step === 4) this.nav('donor');
    if (step === 5) this.nav('request');
    this.render();
  }

  async runDemoStepAction() {
    const step = window.vioraDemoStep || 1;
    if (step === 1) {
      this.advanceDemoTour(2);
    } else if (step === 2) {
      await this.autoFillAndSubmitDemoRequest();
      this.advanceDemoTour(3);
    } else if (step === 3) {
      this.switchRole('donor');
      this.advanceDemoTour(4);
    } else if (step === 4) {
      await this.autoAcceptFirstMatch();
      this.advanceDemoTour(5);
    } else if (step === 5) {
      this.nav('admin');
      this.endDemoTour();
    }
  }

  async autoFillAndSubmitDemoRequest() {
    const bgSelect = document.getElementById('reqBloodGroup');
    const distSelect = document.getElementById('reqDistrict');
    const hospInput = document.getElementById('reqHospital');
    const localityInput = document.getElementById('reqLocality');

    if (bgSelect) bgSelect.value = 'O+';
    if (distSelect) distSelect.value = 'Ernakulam';
    if (hospInput) hospInput.value = 'Aster Medcity';
    if (localityInput) localityInput.value = 'Cheranalloor';

    const form = document.getElementById('bloodRequestForm');
    if (form) {
      await this.handleCreateRequest(new Event('submit'));
    }
  }

  async autoAcceptFirstMatch() {
    const donor = store.state.currentDonor;
    if (!donor) return;
    const reqMatches = store.state.requests.flatMap(r => r.request_matches || []);
    const match = reqMatches.find(m => m.donor_id === donor.id && m.status === 'notified');
    if (match) {
      await this.handleAcceptMatch(match.id, donor.id);
    }
  }

  endDemoTour() {
    window.vioraDemoStep = 0;
    this.render();
  }
}

// Instantiate and attach to window
window.vioraApp = new VioraApp();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.vioraApp.init();
  });
} else {
  window.vioraApp.init();
}
