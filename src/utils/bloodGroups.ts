import { BloodGroup } from '../types/database';

export const ALL_BLOOD_GROUPS: BloodGroup[] = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export interface BloodGroupMeta {
  group: BloodGroup;
  name: string;
  antigen: string;
  canGiveTo: BloodGroup[];
  canReceiveFrom: BloodGroup[];
  isUniversalDonor?: boolean;
  isUniversalRecipient?: boolean;
}

export const BLOOD_GROUP_DETAILS: Record<BloodGroup, BloodGroupMeta> = {
  'O-': { group: 'O-', name: 'O Negative', antigen: 'None', canGiveTo: ALL_BLOOD_GROUPS, canReceiveFrom: ['O-'], isUniversalDonor: true },
  'O+': { group: 'O+', name: 'O Positive', antigen: 'Rh(D)', canGiveTo: ['O+', 'A+', 'B+', 'AB+'], canReceiveFrom: ['O+', 'O-'] },
  'A+': { group: 'A+', name: 'A Positive', antigen: 'A, Rh(D)', canGiveTo: ['A+', 'AB+'], canReceiveFrom: ['A+', 'A-', 'O+', 'O-'] },
  'A-': { group: 'A-', name: 'A Negative', antigen: 'A', canGiveTo: ['A+', 'A-', 'AB+', 'AB-'], canReceiveFrom: ['A-', 'O-'] },
  'B+': { group: 'B+', name: 'B Positive', antigen: 'B, Rh(D)', canGiveTo: ['B+', 'AB+'], canReceiveFrom: ['B+', 'B-', 'O+', 'O-'] },
  'B-': { group: 'B-', name: 'B Negative', antigen: 'B', canGiveTo: ['B+', 'B-', 'AB+', 'AB-'], canReceiveFrom: ['B-', 'O-'] },
  'AB+': { group: 'AB+', name: 'AB Positive', antigen: 'A, B, Rh(D)', canGiveTo: ['AB+'], canReceiveFrom: ALL_BLOOD_GROUPS, isUniversalRecipient: true },
  'AB-': { group: 'AB-', name: 'AB Negative', antigen: 'A, B', canGiveTo: ['AB+', 'AB-'], canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'] }
};
