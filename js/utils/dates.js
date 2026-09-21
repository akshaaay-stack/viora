/**
 * VIORA Date & Donation Interval Calculation Utilities
 * Enforces configurable 90-day minimum donation interval
 */

import { CONFIG } from './constants.js';

export function calculateDonorEligibility(lastDonationDateStr) {
  const intervalDays = CONFIG.MIN_DONATION_INTERVAL_DAYS;

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
      explanation: `${daysSince} days since last donation (required minimum: ${intervalDays} days). You are ready to volunteer.`
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
      statusText: 'Currently ineligible (Donation interval)',
      statusClass: 'text-amber-800 bg-amber-50 border-amber-200',
      badgeLabel: 'CURRENTLY INELIGIBLE',
      explanation: `Whole blood donation interval active. You donated ${daysSince} days ago. Required safe interval: ${intervalDays} days (${daysRemaining} days remaining until ${formattedDate}).`
    };
  }
}

export function formatRelativeTime(dateInput) {
  if (!dateInput) return 'Just now';
  const date = new Date(dateInput);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}
