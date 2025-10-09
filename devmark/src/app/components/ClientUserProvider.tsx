'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { UserProvider } from '@/app/context/UserContext';

export default function ClientUserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user.id ?? null);
    };
    getUser();

    
    supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
    });
  }, []);

  return <UserProvider userId={userId}>{children}</UserProvider>;
}

export { ClientUserProvider };