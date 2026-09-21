/**
 * VIORA Data & RPC API Service
 * Interacts with Supabase PostgreSQL functions with timeout protection
 */

import { getSupabase, waitForSupabaseSDK } from './supabaseClient.js';
import { calculateDonorEligibility } from './eligibility.js';

// Helper to prevent hanging queries
function withTimeout(promise, ms = 6000, operationName = 'Database Operation') {
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

export const VioraAPI = {
  /**
   * Fetch live platform statistics for Admin dashboard
   */
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
      console.warn('[VIORA] Warning fetching platform stats:', err);
      return null;
    }
  },

  /**
   * Create emergency blood request & execute database matching pipeline
   */
  async createBloodRequest({
    requesterName,
    requesterPhone,
    bloodGroup,
    unitsRequired,
    district,
    hospitalName,
    urgency = 'urgent',
    patientIdentifier = 'Patient Emergency',
    locality = '',
    notes = '',
    requiredBy = null
  }) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase client unavailable');

    const { data, error } = await withTimeout(
      sb.rpc('create_and_match_blood_request', {
        p_requester_name: requesterName,
        p_requester_phone: requesterPhone,
        p_blood_group: bloodGroup,
        p_units_required: parseInt(unitsRequired, 10) || 1,
        p_district: district,
        p_hospital_name: hospitalName,
        p_urgency: urgency,
        p_patient_identifier: patientIdentifier,
        p_locality: locality,
        p_notes: notes,
        p_required_by: requiredBy ? new Date(requiredBy).toISOString() : null
      }),
      8000,
      'create_and_match_blood_request'
    );

    if (error) throw error;
    return data;
  },

  /**
   * Fetch all blood requests with their match status
   */
  async fetchBloodRequests() {
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
        'fetchBloodRequests'
      );

      if (error) {
        console.warn('[VIORA] Warning fetching blood requests:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.warn('[VIORA] Error fetching blood requests:', err);
      return [];
    }
  },

  /**
   * Fetch all donors for directory / switcher
   */
  async fetchDonors() {
    const sb = getSupabase();
    if (!sb) return [];

    try {
      const { data, error } = await withTimeout(
        sb
          .from('donors')
          .select('*')
          .order('name', { ascending: true }),
        6000,
        'fetchDonors'
      );

      if (error) {
        console.warn('[VIORA] Warning fetching donors:', error);
        return [];
      }

      return (data || []).map(donor => ({
        ...donor,
        eligibility: calculateDonorEligibility(donor.last_donation_date)
      }));
    } catch (err) {
      console.warn('[VIORA] Error fetching donors:', err);
      return [];
    }
  },

  /**
   * Fetch incoming matched requests for a specific donor
   */
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
          'fetchDonorMatches'
        ),
        withTimeout(
          sb
            .from('notifications')
            .select('*')
            .eq('donor_id', donorId)
            .order('created_at', { ascending: false }),
          5000,
          'fetchDonorNotifications'
        )
      ]);

      return {
        matches: matchesRes.data || [],
        notifications: notifsRes.data || []
      };
    } catch (err) {
      console.warn('[VIORA] Warning fetching donor inbox:', err);
      return { matches: [], notifications: [] };
    }
  },

  /**
   * Accept a blood match (atomic server-side re-check & contact reveal unlock)
   */
  async acceptMatch(matchId, donorId) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase client unavailable');

    const { data, error } = await withTimeout(
      sb.rpc('accept_blood_match', {
        p_match_id: matchId,
        p_donor_id: donorId
      }),
      6000,
      'accept_blood_match'
    );

    if (error) throw error;
    return data;
  },

  /**
   * Decline a blood match
   */
  async declineMatch(matchId, donorId) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase client unavailable');

    const { data, error } = await withTimeout(
      sb.rpc('decline_blood_match', {
        p_match_id: matchId,
        p_donor_id: donorId
      }),
      6000,
      'decline_blood_match'
    );

    if (error) throw error;
    return data;
  },

  /**
   * Privacy Gate: Retrieve revealed contact for an accepted match
   */
  async getRevealedContact(matchId) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase client unavailable');

    const { data, error } = await withTimeout(
      sb.rpc('get_revealed_contact', {
        p_match_id: matchId
      }),
      6000,
      'get_revealed_contact'
    );

    if (error) throw error;
    return data;
  },

  /**
   * Mark a blood request as fulfilled
   */
  async fulfillRequest(requestId) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase client unavailable');

    const { data, error } = await withTimeout(
      sb.rpc('fulfill_blood_request', {
        p_request_id: requestId
      }),
      6000,
      'fulfill_blood_request'
    );

    if (error) throw error;
    return data;
  },

  /**
   * Toggle donor availability status
   */
  async setDonorAvailability(donorId, available) {
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
      'setDonorAvailability'
    );

    if (error) throw error;
    return data;
  },

  /**
   * Register a new donor
   */
  async registerDonor({
    name,
    phone,
    email,
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

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId) {
    const sb = getSupabase();
    if (!sb) return;

    await sb
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
  }
};
