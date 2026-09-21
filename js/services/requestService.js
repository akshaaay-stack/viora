/**
 * VIORA Blood Request Service
 */

import { getSupabase, withTimeout } from '../core/supabase.js';

export const RequestService = {
  async fetchRequests() {
    const sb = getSupabase();
    if (!sb) return [];

    try {
      const { data, error } = await withTimeout(
        sb
          .from('blood_requests')
          .select(`
            *,
            request_matches (
              id,
              donor_id,
              match_score,
              status,
              created_at,
              responded_at,
              donors (
                id,
                name,
                blood_group,
                district,
                locality,
                last_donation_date,
                trust_score
              )
            )
          `)
          .order('created_at', { ascending: false }),
        6000,
        'fetchRequests'
      );

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('[VIORA] fetchRequests notice:', err);
      return [];
    }
  },

  async fulfillRequest(requestId) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase client unavailable');

    const { data, error } = await withTimeout(
      sb.rpc('fulfill_blood_request', { p_request_id: requestId }),
      6000,
      'fulfill_blood_request'
    );

    if (error) throw error;
    return data;
  }
};
