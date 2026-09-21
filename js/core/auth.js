/**
 * VIORA Supabase Auth Core Wrapper
 */

import { getSupabase } from './supabase.js';
import { store } from './state.js';

export async function getCurrentSession() {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data: { session }, error } = await sb.auth.getSession();
    if (error) throw error;
    return session;
  } catch (err) {
    console.warn('[VIORA Auth] getSession notice:', err);
    return null;
  }
}

export async function signInUser(email, password) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase client unavailable');
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpUser(email, password, metadata = {}) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase client unavailable');
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.auth.signOut();
  } catch (err) {
    console.warn('[VIORA Auth] signOut warning:', err);
  }
  store.setState({
    sessionUser: null,
    userProfile: null,
    userRole: 'requester'
  });
}
