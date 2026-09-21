/**
 * VIORA Cryptographic Privacy Gate Service
 */

import { getSupabase, withTimeout } from '../core/supabase.js';

export const PrivacyService = {
  async getRevealedContact(matchId) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase client unavailable');

    const { data, error } = await withTimeout(
      sb.rpc('get_revealed_contact', { p_match_id: matchId }),
      6000,
      'get_revealed_contact'
    );

    if (error) throw error;
    return data;
  }
};
