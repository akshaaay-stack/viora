/**
 * VIORA Centralized Supabase Client
 */

import { CONFIG } from '../utils/constants.js';

let supabaseClient = null;

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
          CONFIG.SUPABASE_URL,
          CONFIG.SUPABASE_ANON_KEY,
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
        console.log('[VIORA] Supabase client initialized with URL:', CONFIG.SUPABASE_URL);
      } catch (err) {
        console.error('[VIORA] Failed to create Supabase client:', err);
      }
    }
  }
  return supabaseClient;
}

export function withTimeout(promise, ms = 6000, operationName = 'Database Operation') {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`[VIORA Timeout] ${operationName} timed out after ${ms}ms`));
    }, ms);

    promise
      .then(res => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}
