/**
 * VIORA Centralized Eligibility & Compatibility Engine
 * Mirrors and validates server-side rules for real-time interactive UI updates
 */

import { VIORA_CONFIG } from './config.js';

/**
 * Blood group compatibility matrix
 * Returns true if donor blood group can donate to recipient blood group
 */
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

/**
 * Returns list of compatible donor groups for a given recipient
 */
export function getCompatibleDonorGroups(recipientBg) {
  return VIORA_CONFIG.BLOOD_GROUPS.filter(donorBg => isBloodCompatible(donorBg, recipientBg));
}

/**
 * 90-Day Donation Interval Eligibility Calculator
 * Uses VIORA_CONFIG.MIN_DONATION_INTERVAL_DAYS (default: 90)
 */
export function calculateDonorEligibility(lastDonationDateStr) {
  const intervalDays = VIORA_CONFIG.MIN_DONATION_INTERVAL_DAYS;

  if (!lastDonationDateStr) {
    return {
      isEligible: true,
      daysRemaining: 0,
      daysSince: null,
      nextEligibleDate: new Date(),
      statusText: 'Eligible to donate',
      statusClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      badgeLabel: 'ELIGIBLE TO DONATE',
      explanation: 'No recent whole blood donation recorded. You are fully eligible for emergency matching.'
    };
  }

  const lastDate = new Date(lastDonationDateStr);
  const today = new Date();
  
  // Set both dates to midnight UTC for accurate day difference
  const diffTime = today.setHours(0,0,0,0) - lastDate.setHours(0,0,0,0);
  const daysSince = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const nextEligibleDate = new Date(lastDate);
  nextEligibleDate.setDate(nextEligibleDate.getDate() + intervalDays);

  if (daysSince >= intervalDays) {
    return {
      isEligible: true,
      daysRemaining: 0,
      daysSince,
      nextEligibleDate,
      statusText: 'Eligible to donate',
      statusClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      badgeLabel: 'ELIGIBLE TO DONATE',
      explanation: `${daysSince} days since last donation (mandatory minimum: ${intervalDays} days). You are ready to save a life.`
    };
  } else {
    const daysRemaining = intervalDays - daysSince;
    const formattedDate = nextEligibleDate.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return {
      isEligible: false,
      daysRemaining,
      daysSince,
      nextEligibleDate,
      formattedNextDate: formattedDate,
      statusText: 'Currently ineligible (Interval protection)',
      statusClass: 'text-amber-800 bg-amber-50 border-amber-200',
      badgeLabel: 'CURRENTLY INELIGIBLE',
      explanation: `Whole blood donation interval active. You donated ${daysSince} days ago. Required interval: ${intervalDays} days (${daysRemaining} days remaining until ${formattedDate}).`
    };
  }
}
