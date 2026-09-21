/**
 * VIORA In-App Notifications & Admin Telemetry Services
 */

import { getSupabase, withTimeout } from '../core/supabase.js';

export const NotificationService = {
  async markAsRead(notificationId) {
    const sb = getSupabase();
    if (!sb) return;
    try {
      await sb.from('notifications').update({ read: true }).eq('id', notificationId);
    } catch (err) {
      console.warn('[VIORA] markAsRead error:', err);
    }
  }
};

export const AdminService = {
  async fetchPlatformStats() {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await withTimeout(
        sb.rpc('get_platform_stats'),
        5000,
        'get_platform_stats'
      );
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[VIORA] fetchPlatformStats notice:', err);
      return null;
    }
  },

  async fetchAuditLogs(limit = 20) {
    const sb = getSupabase();
    if (!sb) return [];
    try {
      const { data, error } = await withTimeout(
        sb.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(limit),
        5000,
        'fetchAuditLogs'
      );
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('[VIORA] fetchAuditLogs notice:', err);
      return [];
    }
  }
};

export const AuthService = {
  async getCurrentUserProfile(userId) {
    const sb = getSupabase();
    if (!sb || !userId) return null;
    try {
      const { data, error } = await sb.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      return data;
    } catch (err) {
      return null;
    }
  }
};
