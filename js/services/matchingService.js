/**
 * VIORA Matching & Accept/Decline Engine Service
 */

import { getSupabase, withTimeout } from '../core/supabase.js';

export const MatchingService = {
  async createAndMatchRequest({
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
  }
};
