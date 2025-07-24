import { useState, useEffect } from 'react';
import { auth } from '@/lib/supabase/utils';

interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial auth state
    const getInitialAuthState = async () => {
      try {
        const { session } = await auth.getCurrentSession();
        setAuthState({
          user: session?.user || null,
          session: session || null,
          loading: false,
        });
      } catch (error) {
        console.error('Error getting initial auth state:', error);
        setAuthState({
          user: null,
          session: null,
          loading: false,
        });
      }
    };

    getInitialAuthState();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      // Validate OAuth users when they sign in and check for provider conflicts
      if (event === 'SIGNED_IN' && session?.user) {
        const provider = session.user.app_metadata?.provider;
        
        if (provider && provider !== 'email') {
          // Check if this email was already registered with email/password
          const email = session.user.email;
          if (email) {
            // Try to find if user exists with different provider
            // Note: This is a simplified check. In production, you might want to store provider info in profiles table
            const userProvider = session.user.app_metadata?.providers || [provider];
            
            // If user has both email and oauth providers, it might be a conflict
            if (userProvider.includes('email') && userProvider.includes(provider) && userProvider.length > 1) {
              console.warn('Provider conflict detected for user:', email);
              // You can choose to allow or deny this based on your business logic
            }
          }
          
          const validation = await auth.validateOAuthUser(session.user);
          if (!validation.valid) {
            console.error('OAuth user validation failed:', validation.error);
            setAuthState({
              user: null,
              session: null,
              loading: false,
            });
            return;
          }
        }
      }

      setAuthState({
        user: session?.user || null,
        session: session || null,
        loading: false,
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    ...authState,
    signOut,
    isAuthenticated: !!authState.user,
  };
} 