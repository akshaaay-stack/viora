/**
 * VIORA View Router
 */

import { store } from './state.js';

export function navigateTo(view, params = {}) {
  const updates = { activeTab: view };
  if (params.requestId) updates.selectedRequestId = params.requestId;
  store.setState(updates);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
