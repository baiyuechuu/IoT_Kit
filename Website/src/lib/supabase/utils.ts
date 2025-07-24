import { supabase } from './client'

// Allowed users configuration
const ALLOWED_EMAIL = 'ebevutru@gmail.com'
const ALLOWED_GITHUB_USERNAME = 'baiyuechuu'

// Authentication utilities
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    // Check if email is allowed
    if (email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
      return { 
        data: null, 
        error: { message: 'Registration is restricted to authorized users only.' }
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    // Check if email is allowed
    if (email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
      return { 
        data: null, 
        error: { message: 'Access is restricted to authorized users only.' }
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    return { data, error }
  },

  // Sign in with GitHub OAuth
  signInWithGitHub: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    return { data, error }
  },

  // Validate OAuth user after successful login
  validateOAuthUser: async (user: any) => {
    if (!user) return { valid: false, error: 'No user found' }

    // For GitHub users, check username
    if (user.app_metadata?.provider === 'github') {
      const githubUsername = user.user_metadata?.user_name || user.user_metadata?.preferred_username
      if (githubUsername?.toLowerCase() !== ALLOWED_GITHUB_USERNAME.toLowerCase()) {
        // Sign out the unauthorized user
        await supabase.auth.signOut()
        return { 
          valid: false, 
          error: 'Access is restricted to authorized GitHub users only.' 
        }
      }
    }

    // For Google users, check email
    if (user.app_metadata?.provider === 'google') {
      if (user.email?.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
        // Sign out the unauthorized user
        await supabase.auth.signOut()
        return { 
          valid: false, 
          error: 'Access is restricted to authorized Google accounts only.' 
        }
      }
    }

    return { valid: true, error: null }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  getCurrentSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Export the supabase client for direct database operations
export { supabase }
export default supabase 