import { supabase } from './client';
import type { User } from '@supabase/supabase-js';

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

export interface OAuthValidation {
  valid: boolean;
  error?: string;
}

export const auth = {
  // Đăng ký với email/password
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
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

  // Đăng nhập với email/password
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

  // Đăng nhập với Google
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
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi' 
      };
    }
  },

  // Đăng nhập với GitHub
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
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi' 
      };
    }
  },

  // Đăng xuất
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
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi' 
      };
    }
  },

  // Lấy session hiện tại
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

  // Lắng nghe thay đổi auth state
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Xác thực OAuth user (có thể mở rộng để thêm logic kiểm tra)
  async validateOAuthUser(_user: User): Promise<OAuthValidation> {
    try {
      // Có thể thêm logic xác thực tùy chỉnh tại đây
      // Ví dụ: kiểm tra domain email, danh sách whitelist, etc.
      // Parameter _user có thể được sử dụng cho validation logic
      
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
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi' 
      };
    }
  },
}; 