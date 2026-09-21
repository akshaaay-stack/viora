/**
 * VIORA Error Utilities
 */

export function mapErrorMessage(error, defaultMsg = 'An unexpected error occurred. Please try again.') {
  if (!error) return defaultMsg;
  const msg = typeof error === 'string' ? error : error.message || error.error_description || defaultMsg;

  if (msg.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials.';
  }
  if (msg.includes('User already registered')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  if (msg.includes('timed out')) {
    return 'Network request timed out. Please check your internet connection.';
  }
  if (msg.includes('interval')) {
    return 'Whole blood donation interval active (90 days required between donations).';
  }
  return msg;
}
