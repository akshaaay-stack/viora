/**
 * Supabase Client Initialization & Realtime Subscription Wrapper
 * Robust initialization with retry polling and timeout protection.
 */

import { VIORA_CONFIG } from './config.js';

let supabaseClient = null;

/**
 * Poll for window.supabase if CDN is slightly delayed
 */
export async function waitForSupabaseSDK(maxWaitMs = 3000) {
  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitMs) {
    if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
      return true;
    }
    await new Promise(r => setTimeout(r, 50));
  }
  return false;
}

export function getSupabase() {
  if (!supabaseClient) {
    if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        supabaseClient = window.supabase.createClient(
          VIORA_CONFIG.SUPABASE_URL,
          VIORA_CONFIG.SUPABASE_ANON_KEY,
          {
            auth: {
              persistSession: true,
              autoRefreshToken: true
            },
            realtime: {
              params: {
                eventsPerSecond: 10
              }
            }
          }
        );
        console.log('[VIORA] ✅ Supabase Client Initialized with URL:', VIORA_CONFIG.SUPABASE_URL);
      } catch (err) {
        console.error('[VIORA] ❌ Failed to create Supabase client:', err);
      }
    } else {
      console.warn('[VIORA] ⚠️ Supabase JS SDK not yet available on window');
    }
  }
  return supabaseClient;
}

/**
 * Non-blocking Realtime channel initialization
 */
export function initRealtimeSubscriptions(onDataChange) {
  const sb = getSupabase();
  if (!sb) {
    console.warn('[VIORA] Realtime skipped: Supabase client not initialized');
    return null;
  }

  try {
    const channel = sb.channel('viora_realtime_feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'request_matches' }, (payload) => {
        console.log('[VIORA] ⚡ Realtime Match Event:', payload);
        if (onDataChange) onDataChange('matches', payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blood_requests' }, (payload) => {
        console.log('[VIORA] ⚡ Realtime Request Event:', payload);
        if (onDataChange) onDataChange('requests', payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
        console.log('[VIORA] ⚡ Realtime Notification Event:', payload);
        if (onDataChange) onDataChange('notifications', payload);
      })
      .subscribe((status) => {
        console.log('[VIORA] 📡 Realtime Subscription Status:', status);
      });

    return channel;
  } catch (err) {
    console.warn('[VIORA] Realtime subscription error (non-fatal):', err);
    return null;
  }
}
