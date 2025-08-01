import { supabase } from './client';
import type { Database } from '@/types/supabase';
import type { WidgetConfig } from '@/pages/dashboard/dev/components/widgets';

type Dashboard = Database['public']['Tables']['dashboards']['Row'];
type DashboardInsert = Database['public']['Tables']['dashboards']['Insert'];
type DashboardUpdate = Database['public']['Tables']['dashboards']['Update'];

export interface DashboardData {
  id?: string;
  name: string;
  widgets: WidgetConfig[];
  layout_config?: {
    gridWidth?: number;
    cols?: number;
    rowHeight?: number;
    margin?: [number, number];
  };
  is_public?: boolean;
}

export interface DashboardResponse {
  data: Dashboard[] | null;
  error: string | null;
}

export interface SingleDashboardResponse {
  data: Dashboard | null;
  error: string | null;
}

class DashboardService {
  /**
   * Ensure user profile exists in the profiles table
   * This prevents foreign key constraint violations
   */
  private async ensureUserProfile(): Promise<{ user: any | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { user: null, error: 'User not authenticated' };
      }

      // Check if profile exists
      const { error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      // If profile doesn't exist, create it
      if (profileError && profileError.code === 'PGRST116') {
        console.log('Profile not found, creating profile for user:', user.id);
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
          });

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          return { user: null, error: 'Failed to create user profile: ' + insertError.message };
        }

        console.log('Profile created successfully for user:', user.id);
      } else if (profileError) {
        console.error('Error checking user profile:', profileError);
        return { user: null, error: 'Failed to verify user profile: ' + profileError.message };
      }

      return { user, error: null };
    } catch (err) {
      console.error('Unexpected error in ensureUserProfile:', err);
      return { user: null, error: 'An unexpected error occurred while verifying user profile' };
    }
  }

  /**
   * Get all dashboards for the current user
   */
  async getUserDashboards(): Promise<DashboardResponse> {
    try {
      const { user, error: userError } = await this.ensureUserProfile();
      
      if (userError || !user) {
        return { data: null, error: userError || 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching dashboards:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Get a specific dashboard by ID
   */
  async getDashboard(dashboardId: string): Promise<SingleDashboardResponse> {
    try {
      const { user, error: userError } = await this.ensureUserProfile();
      
      if (userError || !user) {
        return { data: null, error: userError || 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('id', dashboardId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching dashboard:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Create a new dashboard
   */
  async createDashboard(dashboardData: DashboardData): Promise<SingleDashboardResponse> {
    try {
      const { user, error: userError } = await this.ensureUserProfile();
      
      if (userError || !user) {
        return { data: null, error: userError || 'User not authenticated' };
      }

      const insertData: DashboardInsert = {
        user_id: user.id,
        name: dashboardData.name,
        widgets: dashboardData.widgets,
        layout_config: dashboardData.layout_config || null,
        is_public: dashboardData.is_public || false,
      };

      const { data, error } = await supabase
        .from('dashboards')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating dashboard:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Update an existing dashboard
   */
  async updateDashboard(dashboardId: string, dashboardData: Partial<DashboardData>): Promise<SingleDashboardResponse> {
    try {
      const { user, error: userError } = await this.ensureUserProfile();
      
      if (userError || !user) {
        return { data: null, error: userError || 'User not authenticated' };
      }

      const updateData: DashboardUpdate = {
        ...(dashboardData.name && { name: dashboardData.name }),
        ...(dashboardData.widgets && { widgets: dashboardData.widgets }),
        ...(dashboardData.layout_config && { layout_config: dashboardData.layout_config }),
        ...(dashboardData.is_public !== undefined && { is_public: dashboardData.is_public }),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('dashboards')
        .update(updateData)
        .eq('id', dashboardId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating dashboard:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Delete a dashboard
   */
  async deleteDashboard(dashboardId: string): Promise<{ error: string | null }> {
    try {
      const { user, error: userError } = await this.ensureUserProfile();
      
      if (userError || !user) {
        return { error: userError || 'User not authenticated' };
      }

      const { error } = await supabase
        .from('dashboards')
        .delete()
        .eq('id', dashboardId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting dashboard:', error);
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { error: 'An unexpected error occurred' };
    }
  }

  /**
   * Auto-save dashboard (debounced save)
   */
  async autoSaveDashboard(dashboardId: string, widgets: WidgetConfig[]): Promise<{ error: string | null }> {
    try {
      const { user, error: userError } = await this.ensureUserProfile();
      
      if (userError || !user) {
        return { error: userError || 'User not authenticated' };
      }

      const { error } = await supabase
        .from('dashboards')
        .update({
          widgets,
          updated_at: new Date().toISOString(),
        })
        .eq('id', dashboardId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error auto-saving dashboard:', error);
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { error: 'An unexpected error occurred' };
    }
  }

  /**
   * Get public dashboards (for sharing/templates)
   */
  async getPublicDashboards(): Promise<DashboardResponse> {
    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('is_public', true)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching public dashboards:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }
}

export const dashboardService = new DashboardService();
