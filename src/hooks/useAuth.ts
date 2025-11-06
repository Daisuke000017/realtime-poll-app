import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuthState, ensureAnonymousAuth } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthState((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Ensure anonymous auth on mount
    ensureAnonymousAuth().catch((error) => {
      console.error('Auth error:', error);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { user, loading };
}
