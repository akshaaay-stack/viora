/**
 * VIORA Central Reactive Store
 * Manages active user role, current donor profile, real-time data feeds, and UI tabs
 */

import { VioraAPI } from './api.js';
import { waitForSupabaseSDK, getSupabase } from './supabaseClient.js';

class VioraStore {
  constructor() {
    this.state = {
      activeTab: 'home', // 'home' | 'request' | 'donor' | 'requests' | 'admin'
      userRole: 'requester', // 'requester' | 'donor' | 'admin'
      currentDonor: null,
      donors: [],
      requests: [],
      notifications: [],
      platformStats: null,
      isLoading: false,
      connectionState: 'connecting', // 'connecting' | 'connected' | 'error'
      connectionError: null,
      activeModal: null,
      toast: null,
      theme: 'light' // 'light' | 'dark'
    };

    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error('[VIORA] Store subscriber error:', err);
      }
    }
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  async init() {
    console.log('[VIORA] ⏳ Initializing application and connecting to Supabase...');
    this.setState({ connectionState: 'connecting', connectionError: null, isLoading: true });

    try {
      // 1. Ensure Supabase SDK is available
      const sdkReady = await waitForSupabaseSDK(3000);
      if (!sdkReady) {
        console.warn('[VIORA] Supabase SDK took longer than expected; proceeding with client attempt');
      }

      const client = getSupabase();
      if (!client) {
        throw new Error('Supabase client failed to initialize. Please check network connectivity.');
      }

      console.log('[VIORA] 📦 Fetching initial data from Supabase...');
      const [donors, requests, stats] = await Promise.all([
        VioraAPI.fetchDonors(),
        VioraAPI.fetchBloodRequests(),
        VioraAPI.fetchPlatformStats()
      ]);

      // Set default selected donor (e.g. Faisal Rahman O+ in Ernakulam)
      const defaultDonor = donors.find(d => d.name.includes('Faisal')) || donors[0] || null;

      this.setState({
        donors,
        requests,
        platformStats: stats,
        currentDonor: defaultDonor,
        connectionState: 'connected',
        connectionError: null,
        isLoading: false
      });

      console.log('[VIORA] ✅ Successfully connected and loaded data:', {
        donorsCount: donors.length,
        requestsCount: requests.length,
        statsAvailable: !!stats
      });

      if (defaultDonor) {
        await this.refreshDonorInbox(defaultDonor.id);
      }
    } catch (err) {
      console.error('[VIORA] ❌ Initialization error:', err);
      this.setState({
        connectionState: 'error',
        connectionError: err.message || 'Unable to connect to Viora database services',
        isLoading: false
      });
    }
  }

  async refreshData() {
    try {
      const [requests, stats] = await Promise.all([
        VioraAPI.fetchBloodRequests(),
        VioraAPI.fetchPlatformStats()
      ]);
      this.setState({ requests, platformStats: stats });

      if (this.state.currentDonor) {
        await this.refreshDonorInbox(this.state.currentDonor.id);
      }
    } catch (err) {
      console.error('[VIORA] Store refresh error:', err);
    }
  }

  async refreshDonorInbox(donorId) {
    if (!donorId) return;
    try {
      const { matches, notifications } = await VioraAPI.fetchDonorInbox(donorId);
      this.setState({ notifications });
    } catch (err) {
      console.error('[VIORA] Error refreshing donor inbox:', err);
    }
  }

  setRole(role) {
    this.setState({ userRole: role });
    if (role === 'donor') {
      this.setState({ activeTab: 'donor' });
    } else if (role === 'requester') {
      this.setState({ activeTab: 'request' });
    } else if (role === 'admin') {
      this.setState({ activeTab: 'admin' });
    }
  }

  setCurrentDonor(donor) {
    this.setState({ currentDonor: donor });
    if (donor) {
      this.refreshDonorInbox(donor.id);
    }
  }

  setActiveTab(tab) {
    this.setState({ activeTab: tab });
  }

  showToast(message, type = 'success', duration = 4000) {
    this.setState({ toast: { message, type } });
    setTimeout(() => {
      if (this.state.toast?.message === message) {
        this.setState({ toast: null });
      }
    }, duration);
  }

  clearToast() {
    this.setState({ toast: null });
  }
}

export const store = new VioraStore();
