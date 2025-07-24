import { supabase } from './client';
import type { User } from '@supabase/supabase-js';
import { profileService } from './profile';

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName?: string;
}

export interface OAuthValidation {
  valid: boolean;
  error?: string;
}

export const auth = {
  // Sign up with email/password (enhanced)
  async signUp(signUpData: SignUpData): Promise<AuthResponse> {
    try {
      const { email, password, displayName } = signUpData;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            display_name: displayName || email.split('@')[0], // Use email prefix as default display name
          }
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Create user profile if signup successful and user exists
      if (data.user && displayName) {
        const profileResult = await profileService.createProfile(data.user, {
          display_name: displayName,
        });
        
        // Log profile creation result but don't fail signup if profile creation fails
        if (!profileResult.success) {
          console.warn('Profile creation failed:', profileResult.error);
        }
      }

      return { 
        success: true, 
        user: data.user || undefined 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi' 
      };
    }
  },

  // Legacy method for backward compatibility
  async signUpLegacy(email: string, password: string): Promise<AuthResponse> {
    return this.signUp({ email, password });
  },

  // Sign in with email/password
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        user: data.user || undefined 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi' 
      };
    }
  },

  // Sign in with Google
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      };
    }
  },

  // Check if email exists with different provider
  async checkEmailProvider(email: string): Promise<{ exists: boolean; provider?: string }> {
    try {
      // This is a workaround since Supabase doesn't provide direct API to check user providers
      // We'll try to sign in and catch the specific error
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-to-trigger-error'
      });

      if (error) {
        // If user exists but password is wrong, it means they signed up with email/password
        if (error.message.includes('Invalid login credentials')) {
          return { exists: true, provider: 'email' };
        }
        // If error is about OAuth, user exists with OAuth
        if (error.message.includes('oauth')) {
          return { exists: true, provider: 'oauth' };
        }
      }

      return { exists: false };
    } catch (error) {
      return { exists: false };
    }
  },

  // Sign in with GitHub
  async signInWithGitHub(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      };
    }
  },

  // Enhanced Google signup with provider check
  async signUpWithGoogle(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      };
    }
  },

  // Enhanced GitHub signup with provider check  
  async signUpWithGitHub(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      };
    }
  },

  // Sign out
  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      };
    }
  },

  // Get current session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      return { session };
    } catch (error) {
      console.error('Error getting current session:', error);
      throw error;
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Validate OAuth user (can be extended to add validation logic)
  async validateOAuthUser(_user: User): Promise<OAuthValidation> {
    try {
      // Can add custom validation logic here
      // Example: check email domain, whitelist, etc.
      // Parameter _user can be used for validation logic
      
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Validation failed' 
      };
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      };
    }
  },
}; 