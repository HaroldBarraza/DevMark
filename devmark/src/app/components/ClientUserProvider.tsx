'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { UserProvider } from '@/app/context/UserContext';

/**
 * ClientUserProvider component that manages user authentication state
 * Wraps the application with user context and handles auth state changes
 */
export default function ClientUserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches the current user session and sets the user ID
     */
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user.id ?? null);
    };
    
    getUser();

    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
    });

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <UserProvider userId={userId}>{children}</UserProvider>;
}

export { ClientUserProvider };