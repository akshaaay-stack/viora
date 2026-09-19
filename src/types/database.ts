export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type KeralaDistrict =
  | 'Alappuzha'
  | 'Ernakulam'
  | 'Idukki'
  | 'Kannur'
  | 'Kasaragod'
  | 'Kollam'
  | 'Kottayam'
  | 'Kozhikode'
  | 'Malappuram'
  | 'Palakkad'
  | 'Pathanamthitta'
  | 'Thiruvananthapuram'
  | 'Thrissur'
  | 'Wayanad';

export type UrgencyLevel = 'standard' | 'urgent' | 'critical';
export type RequestStatus = 'open' | 'matching' | 'matched' | 'completed' | 'cancelled' | 'expired';
export type MatchStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';

export interface Donor {
  id: string;
  auth_user_id?: string;
  name: string;
  phone: string;
  phone_verified: boolean;
  blood_group: BloodGroup;
  district: KeralaDistrict;
  locality: string;
  last_donation_date?: string | null;
  available: boolean;
  trust_score: number;
  created_at: string;
  updated_at?: string;
}

export interface PublicDonor {
  id: string;
  blood_group: BloodGroup;
  district: KeralaDistrict;
  locality: string;
  trust_score: number;
  available: boolean;
  approximate_distance?: number;
  created_at: string;
}

export interface BloodRequest {
  id: string;
  requester_id?: string;
  requester_name: string;
  requester_phone: string;
  blood_group_needed: BloodGroup;
  district: KeralaDistrict;
  locality: string;
  hospital_name: string;
  urgency: UrgencyLevel;
  status: RequestStatus;
  current_wave: number;
  created_at: string;
  updated_at?: string;
}

export interface Match {
  id: string;
  request_id: string;
  donor_id: string;
  wave_number: number;
  status: MatchStatus;
  notified_at: string;
  responded_at?: string | null;
  created_at: string;
  donor?: Donor | PublicDonor;
  request?: BloodRequest;
}

export interface Hospital {
  id: string;
  name: string;
  district: KeralaDistrict;
  locality: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}
