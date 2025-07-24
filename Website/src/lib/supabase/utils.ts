import { supabase } from './client'

// Authentication utilities
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
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

// Database utilities
export const db = {
  // Generic select function
  select: (table: string) => supabase.from(table).select(),
  
  // Generic insert function
  insert: (table: string, data: any) => supabase.from(table).insert(data),
  
  // Generic update function
  update: (table: string, data: any) => supabase.from(table).update(data),
  
  // Generic delete function
  delete: (table: string) => supabase.from(table).delete(),
}

// Export the supabase client for direct access
export { supabase }
export default supabase 