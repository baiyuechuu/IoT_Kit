import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface ProviderGuardProps {
  children: React.ReactNode;
}

// Track user authentication providers to prevent conflicts
export function ProviderGuard({ children }: ProviderGuardProps) {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkProviderConflicts = async () => {
      try {
        // Listen for auth state changes to detect provider conflicts
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              const user = session.user;
              const provider = user.app_metadata?.provider;
              const email = user.email;

              // Log provider information for debugging
              console.log('Auth Provider:', provider);
              console.log('User Email:', email);
              console.log('App Metadata:', user.app_metadata);

              // Check for provider conflicts
              if (provider && email) {
                // Store provider info in localStorage for cross-session tracking
                const existingProviders = JSON.parse(
                  localStorage.getItem(`providers_${email}`) || '[]'
                );

                if (!existingProviders.includes(provider)) {
                  existingProviders.push(provider);
                  localStorage.setItem(`providers_${email}`, JSON.stringify(existingProviders));
                }

                // If user has multiple providers, show warning
                if (existingProviders.length > 1) {
                  console.warn('Multiple providers detected for email:', email);
                  console.warn('Providers:', existingProviders);
                  
                  // You can implement additional logic here:
                  // - Force user to use only one provider
                  // - Merge accounts
                  // - Show provider selection UI
                }
              }
            }
          }
        );

        setIsChecking(false);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Provider guard error:', error);
        setIsChecking(false);
      }
    };

    checkProviderConflicts();
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

// Utility functions for provider management
export const providerUtils = {
  // Get stored providers for an email
  getStoredProviders(email: string): string[] {
    try {
      return JSON.parse(localStorage.getItem(`providers_${email}`) || '[]');
    } catch {
      return [];
    }
  },

  // Add provider to stored list
  addProvider(email: string, provider: string): void {
    const providers = this.getStoredProviders(email);
    if (!providers.includes(provider)) {
      providers.push(provider);
      localStorage.setItem(`providers_${email}`, JSON.stringify(providers));
    }
  },

  // Check if email has multiple providers
  hasMultipleProviders(email: string): boolean {
    return this.getStoredProviders(email).length > 1;
  },

  // Clear provider data (useful for logout)
  clearProviderData(email: string): void {
    localStorage.removeItem(`providers_${email}`);
  },

  // Get primary provider (first one used)
  getPrimaryProvider(email: string): string | null {
    const providers = this.getStoredProviders(email);
    return providers.length > 0 ? providers[0] : null;
  }
}; 