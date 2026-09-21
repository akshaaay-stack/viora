/**
 * VIORA Centralized Blood Group Compatibility Engine
 * 8x8 Compatibility Matrix implementation
 */

import { CONFIG } from './constants.js';

export function isBloodCompatible(donorBg, recipientBg) {
  if (!donorBg || !recipientBg) return false;
  const d = donorBg.trim().toUpperCase();
  const r = recipientBg.trim().toUpperCase();

  // Universal Donor O-
  if (d === 'O-') return true;

  // O+ can donate to O+, A+, B+, AB+
  if (d === 'O+') return ['O+', 'A+', 'B+', 'AB+'].includes(r);

  // A- can donate to A-, A+, AB-, AB+
  if (d === 'A-') return ['A-', 'A+', 'AB-', 'AB+'].includes(r);

  // A+ can donate to A+, AB+
  if (d === 'A+') return ['A+', 'AB+'].includes(r);

  // B- can donate to B-, B+, AB-, AB+
  if (d === 'B-') return ['B-', 'B+', 'AB-', 'AB+'].includes(r);

  // B+ can donate to B+, AB+
  if (d === 'B+') return ['B+', 'AB+'].includes(r);

  // AB- can donate to AB-, AB+
  if (d === 'AB-') return ['AB-', 'AB+'].includes(r);

  // AB+ can only donate to AB+ (Universal recipient)
  if (d === 'AB+') return r === 'AB+';

  return false;
}

export function getCompatibleDonorGroups(recipientBg) {
  return CONFIG.BLOOD_GROUPS.filter(donorBg => isBloodCompatible(donorBg, recipientBg));
}

export function getCompatibleRecipientGroups(donorBg) {
  return CONFIG.BLOOD_GROUPS.filter(recipientBg => isBloodCompatible(donorBg, recipientBg));
}
