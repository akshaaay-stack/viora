/**
 * VIORA Central Reactive State Store
 */

class VioraState {
  constructor() {
    this.state = {
      activeTab: 'landing', // 'landing' | 'request' | 'donor' | 'requests' | 'admin' | 'login' | 'signup' | 'onboarding' | 'notifications' | 'profile' | 'detail'
      selectedRequestId: null,
      userRole: 'requester', // 'donor' | 'requester' | 'admin'
      sessionUser: null,
      userProfile: null,
      currentDonor: null,
      donors: [],
      requests: [],
      notifications: [],
      platformStats: null,
      connectionState: 'connecting', // 'connecting' | 'connected' | 'error'
      connectionError: null,
      isLoading: false,
      activeModal: null,
      toast: null
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
        console.error('[VIORA State] Listener error:', err);
      }
    }
  }

  setState(partial) {
    this.state = { ...this.state, ...partial };
    this.notify();
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

  openModal(modalData) {
    this.setState({ activeModal: modalData });
  }

  closeModal() {
    this.setState({ activeModal: null });
  }
}

export const store = new VioraState();
