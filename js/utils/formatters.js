/**
 * VIORA Formatting & Privacy Masking Utilities
 */

export function maskPhone(phone) {
  if (!phone) return '•••• •••• ••';
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length < 4) return '•••• •••• ••';
  const last2 = clean.slice(-2);
  return `•••• •••• ${last2}`;
}

export function maskEmail(email) {
  if (!email) return '••••••••@••••.com';
  const parts = email.split('@');
  if (parts.length !== 2) return '••••••••@••••.com';
  return `${parts[0].slice(0, 2)}••••@${parts[1]}`;
}

export function formatUrgencyBadge(urgency) {
  switch ((urgency || '').toLowerCase()) {
    case 'critical':
      return {
        label: '🚨 Critical Emergency',
        bg: 'bg-rose-600 text-white',
        border: 'border-rose-700'
      };
    case 'urgent':
      return {
        label: '⚠️ Urgent',
        bg: 'bg-amber-100 text-amber-900',
        border: 'border-amber-300'
      };
    default:
      return {
        label: '⏱️ Normal',
        bg: 'bg-slate-100 text-slate-700',
        border: 'border-slate-300'
      };
  }
}

export function formatRequestStatusBadge(status) {
  switch ((status || '').toLowerCase()) {
    case 'fulfilled':
      return { label: 'Fulfilled', bg: 'bg-emerald-100 text-emerald-800' };
    case 'matched':
      return { label: 'Matched (Active)', bg: 'bg-indigo-100 text-indigo-800' };
    case 'active':
      return { label: 'Matching Donors', bg: 'bg-rose-100 text-rose-800' };
    default:
      return { label: status || 'Pending', bg: 'bg-slate-100 text-slate-700' };
  }
}
