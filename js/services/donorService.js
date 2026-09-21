/**
 * VIORA Donor Service
 */

import { getSupabase, withTimeout } from '../core/supabase.js';
import { calculateDonorEligibility } from '../utils/dates.js';

export const DonorService = {
  async fetchAllDonors() {
    const sb = getSupabase();
    if (!sb) return [];
    try {
      const { data, error } = await withTimeout(
        sb.from('donors').select('*').order('name', { ascending: true }),
        6000,
        'fetchAllDonors'
      );
      if (error) throw error;
      return (data || []).map(donor => ({
        ...donor,
        eligibility: calculateDonorEligibility(donor.last_donation_date)
      }));
    } catch (err) {
      console.warn('[VIORA] fetchAllDonors error:', err);
      return [];
    }
  },

  async registerDonor({
    name,
    phone,
    email = null,
    bloodGroup,
    district,
    locality,
    lastDonationDate = null,
    available = true
  }) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase client unavailable');

    const { data, error } = await withTimeout(
      sb
        .from('donors')
        .insert({
          name,
          phone,
          email,
          blood_group: bloodGroup,
          district,
          locality,
          last_donation_date: lastDonationDate || null,
          available
        })
        .select()
        .single(),
      6000,
      'registerDonor'
    );

    if (error) throw error;
    return data;
  },

  async toggleAvailability(donorId, available) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase client unavailable');

    const { data, error } = await withTimeout(
      sb
        .from('donors')
        .update({ available, updated_at: new Date().toISOString() })
        .eq('id', donorId)
        .select()
        .single(),
      5000,
      'toggleAvailability'
    );

    if (error) throw error;
    return data;
  },

  async fetchDonorInbox(donorId) {
    const sb = getSupabase();
    if (!sb || !donorId) return { matches: [], notifications: [] };

    try {
      const [matchesRes, notifsRes] = await Promise.all([
        withTimeout(
          sb
            .from('request_matches')
            .select(`
              id,
              request_id,
              donor_id,
              match_score,
              status,
              created_at,
              responded_at,
              blood_requests (
                id,
                patient_identifier,
                blood_group,
                units_required,
                district,
                hospital_name,
                locality,
                urgency,
                status,
                required_by,
                notes,
                created_at
              )
            `)
            .eq('donor_id', donorId)
            .order('created_at', { ascending: false }),
          5000,
          'fetchDonorInboxMatches'
        ),
        withTimeout(
          sb
            .from('notifications')
            .select('*')
            .eq('donor_id', donorId)
            .order('created_at', { ascending: false }),
          5000,
          'fetchDonorInboxNotifications'
        )
      ]);

      return {
        matches: matchesRes.data || [],
        notifications: notifsRes.data || []
      };
    } catch (err) {
      console.warn('[VIORA] fetchDonorInbox notice:', err);
      return { matches: [], notifications: [] };
    }
  }
};
