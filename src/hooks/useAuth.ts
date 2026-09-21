import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Donor } from '../types/database';

export function useAuth() {
  const [userPhone, setUserPhone] = useState<string | null>(() => localStorage.getItem('viora_user_phone'));
  const [userRole, setUserRole] = useState<'donor' | 'requester' | null>(() => localStorage.getItem('viora_user_role') as any);
  const [donorProfile, setDonorProfile] = useState<Donor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDonor() {
      if (userPhone && userRole === 'donor') {
        const { data } = await supabase
          .from('donors')
          .select('*')
          .eq('phone', userPhone)
          .single();
        if (data) {
          setDonorProfile(data as Donor);
        }
      }
      setLoading(false);
    }
    loadDonor();
  }, [userPhone, userRole]);

  const setAuth = (phone: string, role: 'donor' | 'requester') => {
    localStorage.setItem('viora_user_phone', phone);
    localStorage.setItem('viora_user_role', role);
    setUserPhone(phone);
    setUserRole(role);
  };

  const signOut = async () => {
    localStorage.removeItem('viora_user_phone');
    localStorage.removeItem('viora_user_role');
    setUserPhone(null);
    setUserRole(null);
    setDonorProfile(null);
    await supabase.auth.signOut();
  };

  return {
    userPhone,
    userRole,
    donorProfile,
    loading,
    setAuth,
    setDonorProfile,
    signOut
  };
}
