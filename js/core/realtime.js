/**
 * VIORA Realtime Synchronization Channel
 */

import { getSupabase } from './supabase.js';

export function setupRealtimeListeners(onDataChange) {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const channel = sb.channel('viora_realtime_feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'request_matches' }, (payload) => {
        console.log('[VIORA Realtime] Matches updated:', payload);
        if (onDataChange) onDataChange('matches', payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blood_requests' }, (payload) => {
        console.log('[VIORA Realtime] Blood request updated:', payload);
        if (onDataChange) onDataChange('requests', payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
        console.log('[VIORA Realtime] Notification received:', payload);
        if (onDataChange) onDataChange('notifications', payload);
      })
      .subscribe((status) => {
        console.log('[VIORA Realtime] Status:', status);
      });

    return channel;
  } catch (err) {
    console.warn('[VIORA Realtime] Subscription notice (non-fatal):', err);
    return null;
  }
}
