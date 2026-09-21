import { supabase } from './supabase';
import { BloodRequest, KeralaDistrict, BloodGroup } from '../types/database';

export async function createBloodRequest(params: {
  bloodGroup: BloodGroup;
  district: KeralaDistrict;
  locality: string;
  hospitalName: string;
  urgency: 'standard' | 'urgent' | 'critical';
  requesterName: string;
  requesterPhone: string;
}) {
  const { data: request, error } = await supabase
    .from('requests')
    .insert([
      {
        blood_group_needed: params.bloodGroup,
        district: params.district,
        locality: params.locality,
        hospital_name: params.hospitalName,
        urgency: params.urgency,
        requester_name: params.requesterName,
        requester_phone: params.requesterPhone,
        status: 'matching',
        current_wave: 1
      }
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  await triggerWaveMatching(request.id, 1);
  return request as BloodRequest;
}

export async function triggerWaveMatching(requestId: string, wave = 1) {
  const { data, error } = await supabase.rpc('find_and_notify_eligible_donors', {
    p_request_id: requestId,
    p_wave: wave
  });
  if (error) console.error('Error in find_and_notify_eligible_donors:', error);
  return data;
}

export async function escalateWave(requestId: string) {
  const { data, error } = await supabase.rpc('escalate_request_wave', {
    p_request_id: requestId
  });
  if (error) console.error('Error in escalate_request_wave:', error);
  return data;
}

export async function respondToMatch(matchId: string, response: 'accepted' | 'declined') {
  const { data, error } = await supabase.rpc('respond_to_match', {
    p_match_id: matchId,
    p_response: response
  });
  if (error) throw error;
  return data;
}

export async function revealContact(matchId: string) {
  const { data, error } = await supabase.rpc('reveal_contact', {
    p_match_id: matchId
  });
  if (error) throw error;
  return data;
}
