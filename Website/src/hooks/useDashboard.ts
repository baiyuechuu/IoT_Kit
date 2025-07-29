import { useState, useEffect, useCallback, useRef } from 'react';
import { dashboardService, type DashboardData } from '@/lib/supabase/dashboard';
import { useAuth } from './useAuth';
import type { WidgetConfig } from '@/pages/dashboard/dev/components/widgets';

interface UseDashboardOptions {
  dashboardId?: string;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

interface DashboardState {
  dashboard: DashboardData | null;
  widgets: WidgetConfig[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  lastSaved: Date | null;
}

export function useDashboard(options: UseDashboardOptions = {}) {
  const { dashboardId, autoSave = true, autoSaveDelay = 2000 } = options;
  const { isAuthenticated } = useAuth();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [state, setState] = useState<DashboardState>({
    dashboard: null,
    widgets: [],
    loading: false,
    saving: false,
    error: null,
    lastSaved: null,
  });

  // Auto-save function with debouncing
  const debouncedAutoSave = useCallback(
    (widgetData: WidgetConfig[]) => {
      if (!autoSave || !dashboardId || !isAuthenticated) return;

      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout
      autoSaveTimeoutRef.current = setTimeout(async () => {
        setState(prev => ({ ...prev, saving: true }));
        
        try {
          const { error } = await dashboardService.autoSaveDashboard(dashboardId, widgetData);
          
          setState(prev => ({
            ...prev,
            saving: false,
            error: error,
            lastSaved: error ? prev.lastSaved : new Date(),
          }));
        } catch (err) {
          setState(prev => ({
            ...prev,
            saving: false,
            error: err instanceof Error ? err.message : 'Failed to auto-save dashboard',
          }));
        }
      }, autoSaveDelay);
    },
    [dashboardId, autoSave, autoSaveDelay, isAuthenticated]
  );

  // Load dashboard data
  const loadDashboard = useCallback(async (id?: string) => {
    const targetId = id || dashboardId;
    if (!targetId || !isAuthenticated) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await dashboardService.getDashboard(targetId);
      
      if (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error,
        }));
        return;
      }

      const dashboardData: DashboardData = {
        id: data?.id,
        name: data?.name || 'Untitled Dashboard',
        description: data?.description || undefined,
        widgets: (data?.widgets as WidgetConfig[]) || [],
        layout_config: data?.layout_config || undefined,
        is_public: data?.is_public || false,
      };

      setState(prev => ({
        ...prev,
        dashboard: dashboardData,
        widgets: dashboardData.widgets,
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load dashboard',
      }));
    }
  }, [dashboardId, isAuthenticated]);

  // Create new dashboard
  const createDashboard = useCallback(async (dashboardData: Omit<DashboardData, 'id'>) => {
    if (!isAuthenticated) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await dashboardService.createDashboard(dashboardData);
      
      if (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error,
        }));
        return null;
      }

      const newDashboard: DashboardData = {
        id: data?.id,
        name: data?.name || 'Untitled Dashboard',
        description: data?.description || undefined,
        widgets: (data?.widgets as WidgetConfig[]) || [],
        layout_config: data?.layout_config || undefined,
        is_public: data?.is_public || false,
      };

      setState(prev => ({
        ...prev,
        dashboard: newDashboard,
        widgets: newDashboard.widgets,
        loading: false,
        error: null,
        lastSaved: new Date(),
      }));

      return data?.id || null;
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to create dashboard',
      }));
      return null;
    }
  }, [isAuthenticated]);

  // Update dashboard
  const updateDashboard = useCallback(async (updates: Partial<DashboardData>) => {
    if (!dashboardId || !isAuthenticated) return;

    setState(prev => ({ ...prev, saving: true, error: null }));

    try {
      const { data, error } = await dashboardService.updateDashboard(dashboardId, updates);
      
      if (error) {
        setState(prev => ({
          ...prev,
          saving: false,
          error,
        }));
        return;
      }

      const updatedDashboard: DashboardData = {
        id: data?.id,
        name: data?.name || 'Untitled Dashboard',
        description: data?.description || undefined,
        widgets: (data?.widgets as WidgetConfig[]) || [],
        layout_config: data?.layout_config || undefined,
        is_public: data?.is_public || false,
      };

      setState(prev => ({
        ...prev,
        dashboard: updatedDashboard,
        widgets: updatedDashboard.widgets,
        saving: false,
        error: null,
        lastSaved: new Date(),
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        saving: false,
        error: err instanceof Error ? err.message : 'Failed to update dashboard',
      }));
    }
  }, [dashboardId, isAuthenticated]);

  // Update widgets with auto-save
  const updateWidgets = useCallback((newWidgets: WidgetConfig[]) => {
    setState(prev => ({
      ...prev,
      widgets: newWidgets,
    }));

    // Trigger auto-save if enabled
    if (autoSave && dashboardId) {
      debouncedAutoSave(newWidgets);
    }
  }, [autoSave, dashboardId, debouncedAutoSave]);

  // Manual save
  const saveDashboard = useCallback(async () => {
    if (!dashboardId || !isAuthenticated) return;

    setState(prev => ({ ...prev, saving: true, error: null }));

    try {
      const { error } = await dashboardService.autoSaveDashboard(dashboardId, state.widgets);
      
      setState(prev => ({
        ...prev,
        saving: false,
        error: error,
        lastSaved: error ? prev.lastSaved : new Date(),
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        saving: false,
        error: err instanceof Error ? err.message : 'Failed to save dashboard',
      }));
    }
  }, [dashboardId, isAuthenticated, state.widgets]);

  // Delete dashboard
  const deleteDashboard = useCallback(async (id?: string) => {
    const targetId = id || dashboardId;
    if (!targetId || !isAuthenticated) return false;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await dashboardService.deleteDashboard(targetId);
      
      if (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error,
        }));
        return false;
      }

      // Clear state if deleting current dashboard
      if (targetId === dashboardId) {
        setState({
          dashboard: null,
          widgets: [],
          loading: false,
          saving: false,
          error: null,
          lastSaved: null,
        });
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }

      return true;
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to delete dashboard',
      }));
      return false;
    }
  }, [dashboardId, isAuthenticated]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load dashboard on mount or when dashboardId changes
  useEffect(() => {
    if (dashboardId && isAuthenticated) {
      loadDashboard();
    }
  }, [dashboardId, isAuthenticated, loadDashboard]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    dashboard: state.dashboard,
    widgets: state.widgets,
    loading: state.loading,
    saving: state.saving,
    error: state.error,
    lastSaved: state.lastSaved,
    
    // Actions
    loadDashboard,
    createDashboard,
    updateDashboard,
    updateWidgets,
    saveDashboard,
    deleteDashboard,
    clearError,
    
    // Computed
    hasUnsavedChanges: autoSave && !state.saving && state.lastSaved !== null,
    isReady: isAuthenticated && !state.loading,
  };
}

