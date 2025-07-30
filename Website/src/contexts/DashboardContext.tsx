import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react';
import type { WidgetConfig, WidgetType } from '@/pages/dashboard/dev/components/widgets';
import { useDashboard } from '@/hooks/useDashboard';
import { WIDGET_CONSTRAINTS } from '@/pages/dashboard/dev/components/widgets';

// Dashboard state types
interface DashboardContextState {
  // Widget management
  widgets: WidgetConfig[];
  selectedWidget: WidgetConfig | null;
  
  // UI state
  editMode: boolean;
  gridWidth: number;
  isDesktop: boolean;
  
  // Dialog states
  showAddDialog: boolean;
  showSettingsDialog: boolean;
  showFirebaseDialog: boolean;
  
  // Error state
  error: string | null;
  
  // Widget states (for runtime values)
  widgetStates: Record<string, any>;
}

// Action types
type DashboardAction =
  | { type: 'SET_WIDGETS'; payload: WidgetConfig[] }
  | { type: 'ADD_WIDGET'; payload: WidgetConfig }
  | { type: 'UPDATE_WIDGET'; payload: WidgetConfig }
  | { type: 'DELETE_WIDGET'; payload: string }
  | { type: 'DUPLICATE_WIDGET'; payload: WidgetConfig }
  | { type: 'SET_SELECTED_WIDGET'; payload: WidgetConfig | null }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'SET_GRID_WIDTH'; payload: number }
  | { type: 'SET_IS_DESKTOP'; payload: boolean }
  | { type: 'SET_SHOW_ADD_DIALOG'; payload: boolean }
  | { type: 'SET_SHOW_SETTINGS_DIALOG'; payload: boolean }
  | { type: 'SET_SHOW_FIREBASE_DIALOG'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WIDGET_STATE'; payload: { widgetId: string; state: any } }
  | { type: 'CLEAR_ALL_WIDGETS' };

// Initial state
const initialState: DashboardContextState = {
  widgets: [],
  selectedWidget: null,
  editMode: false,
  gridWidth: 1200,
  isDesktop: true,
  showAddDialog: false,
  showSettingsDialog: false,
  showFirebaseDialog: false,
  error: null,
  widgetStates: {},
};

// Reducer
function dashboardReducer(state: DashboardContextState, action: DashboardAction): DashboardContextState {
  switch (action.type) {
    case 'SET_WIDGETS':
      return { ...state, widgets: action.payload };
    
    case 'ADD_WIDGET':
      return { ...state, widgets: [...state.widgets, action.payload] };
    
    case 'UPDATE_WIDGET':
      return {
        ...state,
        widgets: state.widgets.map(w => 
          w.i === action.payload.i ? action.payload : w
        ),
      };
    
    case 'DELETE_WIDGET':
      return {
        ...state,
        widgets: state.widgets.filter(w => w.i !== action.payload),
        selectedWidget: state.selectedWidget?.i === action.payload ? null : state.selectedWidget,
      };
    
    case 'DUPLICATE_WIDGET': {
      const newWidget: WidgetConfig = {
        ...action.payload,
        i: `${action.payload.type}-${Date.now()}`,
        x: Math.min(action.payload.x + 1, 12 - action.payload.w),
        y: action.payload.y + 1,
      };
      return { ...state, widgets: [...state.widgets, newWidget] };
    }
    
    case 'SET_SELECTED_WIDGET':
      return { ...state, selectedWidget: action.payload };
    
    case 'SET_EDIT_MODE':
      return { ...state, editMode: action.payload };
    
    case 'SET_GRID_WIDTH':
      return { ...state, gridWidth: action.payload };
    
    case 'SET_IS_DESKTOP':
      return { ...state, isDesktop: action.payload };
    
    case 'SET_SHOW_ADD_DIALOG':
      return { ...state, showAddDialog: action.payload };
    
    case 'SET_SHOW_SETTINGS_DIALOG':
      return { ...state, showSettingsDialog: action.payload };
    
    case 'SET_SHOW_FIREBASE_DIALOG':
      return { ...state, showFirebaseDialog: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_WIDGET_STATE':
      return {
        ...state,
        widgetStates: {
          ...state.widgetStates,
          [action.payload.widgetId]: action.payload.state,
        },
      };
    
    case 'CLEAR_ALL_WIDGETS':
      return {
        ...state,
        widgets: [],
        selectedWidget: null,
        widgetStates: {},
      };
    
    default:
      return state;
  }
}

// Context interface
interface DashboardContextValue {
  // State
  state: DashboardContextState;
  
  // Widget management actions
  addWidget: (type: WidgetType, props: Record<string, unknown>) => void;
  updateWidget: (widget: WidgetConfig) => void;
  deleteWidget: (widgetId: string) => void;
  duplicateWidget: (widget: WidgetConfig) => void;
  updateWidgets: (widgets: WidgetConfig[]) => void;
  clearAllWidgets: () => void;
  
  // Widget state management
  setWidgetState: (widgetId: string, state: any) => void;
  getWidgetState: (widgetId: string) => any;
  
  // UI actions
  setEditMode: (editMode: boolean) => void;
  setSelectedWidget: (widget: WidgetConfig | null) => void;
  setShowAddDialog: (show: boolean) => void;
  setShowSettingsDialog: (show: boolean) => void;
  setShowFirebaseDialog: (show: boolean) => void;
  setError: (error: string | null) => void;
  
  // Utility actions
  openWidgetSettings: (widgetId: string) => void;
  updateGridSize: () => void;
}

// Create context
const DashboardContext = createContext<DashboardContextValue | null>(null);

// Provider props
interface DashboardProviderProps {
  children: ReactNode;
  dashboardId?: string;
}

// Provider component
export function DashboardProvider({ children, dashboardId }: DashboardProviderProps) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  
  // Use the existing dashboard hook for persistence
  const {
    widgets: persistedWidgets,
    updateWidgets: updatePersistedWidgets,
    loading,
    saving,
    error,
    lastSaved,
    clearError,
    isReady,
  } = useDashboard({
    dashboardId,
    autoSave: true,
    autoSaveDelay: 1000,
  });

  // Sync persisted widgets with local state
  useEffect(() => {
    if (persistedWidgets && persistedWidgets.length >= 0) {
      dispatch({ type: 'SET_WIDGETS', payload: persistedWidgets });
    }
  }, [persistedWidgets]);

  // Update grid size on window resize
  useEffect(() => {
    const updateSizing = () => {
      const windowWidth = window.innerWidth;
      const paddingOffset = 64;
      const newGridWidth = windowWidth - paddingOffset;
      const newIsDesktop = windowWidth > 1080;

      dispatch({ type: 'SET_GRID_WIDTH', payload: newGridWidth });
      dispatch({ type: 'SET_IS_DESKTOP', payload: newIsDesktop });
    };

    updateSizing();
    window.addEventListener('resize', updateSizing);
    return () => window.removeEventListener('resize', updateSizing);
  }, []);

  // Widget management actions
  const addWidget = useCallback((type: WidgetType, props: Record<string, unknown>) => {
    const constraints = WIDGET_CONSTRAINTS[type];
    const newWidget: WidgetConfig = {
      i: `${type}-${Date.now()}`,
      type,
      x: 0,
      y: 0,
      w: constraints.minW,
      h: constraints.minH,
      props,
    };

    // Find best position for new widget
    const existingPositions = state.widgets.map((w) => ({
      x: w.x,
      y: w.y,
      w: w.w,
      h: w.h,
    }));

    let bestX = 0;
    let bestY = 0;
    let found = false;

    for (let y = 0; y < 20 && !found; y++) {
      for (let x = 0; x <= 12 - newWidget.w && !found; x++) {
        const hasCollision = existingPositions.some((pos) => {
          return !(
            x >= pos.x + pos.w ||
            x + newWidget.w <= pos.x ||
            y >= pos.y + pos.h ||
            y + newWidget.h <= pos.y
          );
        });

        if (!hasCollision) {
          bestX = x;
          bestY = y;
          found = true;
        }
      }
    }

    newWidget.x = bestX;
    newWidget.y = bestY;

    const updatedWidgets = [...state.widgets, newWidget];
    dispatch({ type: 'SET_WIDGETS', payload: updatedWidgets });
    updatePersistedWidgets(updatedWidgets);
  }, [state.widgets, updatePersistedWidgets]);

  const updateWidget = useCallback((widget: WidgetConfig) => {
    const updatedWidgets = state.widgets.map(w => 
      w.i === widget.i ? widget : w
    );
    dispatch({ type: 'SET_WIDGETS', payload: updatedWidgets });
    updatePersistedWidgets(updatedWidgets);
  }, [state.widgets, updatePersistedWidgets]);

  const deleteWidget = useCallback((widgetId: string) => {
    const updatedWidgets = state.widgets.filter(w => w.i !== widgetId);
    dispatch({ type: 'SET_WIDGETS', payload: updatedWidgets });
    updatePersistedWidgets(updatedWidgets);
  }, [state.widgets, updatePersistedWidgets]);

  const duplicateWidget = useCallback((widget: WidgetConfig) => {
    const newWidget: WidgetConfig = {
      ...widget,
      i: `${widget.type}-${Date.now()}`,
      x: Math.min(widget.x + 1, 12 - widget.w),
      y: widget.y + 1,
    };
    const updatedWidgets = [...state.widgets, newWidget];
    dispatch({ type: 'SET_WIDGETS', payload: updatedWidgets });
    updatePersistedWidgets(updatedWidgets);
  }, [state.widgets, updatePersistedWidgets]);

  const updateWidgets = useCallback((widgets: WidgetConfig[]) => {
    dispatch({ type: 'SET_WIDGETS', payload: widgets });
    updatePersistedWidgets(widgets);
  }, [updatePersistedWidgets]);

  const clearAllWidgets = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_WIDGETS' });
    updatePersistedWidgets([]);
  }, [updatePersistedWidgets]);

  // Widget state management
  const setWidgetState = useCallback((widgetId: string, state: any) => {
    dispatch({ type: 'SET_WIDGET_STATE', payload: { widgetId, state } });
  }, []);

  const getWidgetState = useCallback((widgetId: string) => {
    return state.widgetStates[widgetId];
  }, [state.widgetStates]);

  // UI actions
  const setEditMode = useCallback((editMode: boolean) => {
    dispatch({ type: 'SET_EDIT_MODE', payload: editMode });
  }, []);

  const setSelectedWidget = useCallback((widget: WidgetConfig | null) => {
    dispatch({ type: 'SET_SELECTED_WIDGET', payload: widget });
  }, []);

  const setShowAddDialog = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_ADD_DIALOG', payload: show });
  }, []);

  const setShowSettingsDialog = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_SETTINGS_DIALOG', payload: show });
  }, []);

  const setShowFirebaseDialog = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_FIREBASE_DIALOG', payload: show });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  // Utility actions
  const openWidgetSettings = useCallback((widgetId: string) => {
    const widget = state.widgets.find(w => w.i === widgetId);
    if (widget) {
      setSelectedWidget(widget);
      setShowSettingsDialog(true);
    }
  }, [state.widgets, setSelectedWidget, setShowSettingsDialog]);

  const updateGridSize = useCallback(() => {
    const windowWidth = window.innerWidth;
    const paddingOffset = 64;
    const newGridWidth = windowWidth - paddingOffset;
    const newIsDesktop = windowWidth > 1080;

    dispatch({ type: 'SET_GRID_WIDTH', payload: newGridWidth });
    dispatch({ type: 'SET_IS_DESKTOP', payload: newIsDesktop });
  }, []);

  const contextValue: DashboardContextValue = {
    state: {
      ...state,
      // Add persistence state from hook
      loading,
      saving,
      error,
      lastSaved,
      isReady,
    } as DashboardContextState & {
      loading: boolean;
      saving: boolean;
      error: string | null;
      lastSaved: Date | null;
      isReady: boolean;
    },
    
    // Widget management
    addWidget,
    updateWidget,
    deleteWidget,
    duplicateWidget,
    updateWidgets,
    clearAllWidgets,
    
    // Widget state management
    setWidgetState,
    getWidgetState,
    
    // UI actions
    setEditMode,
    setSelectedWidget,
    setShowAddDialog,
    setShowSettingsDialog,
    setShowFirebaseDialog,
    setError,
    
    // Utility actions
    openWidgetSettings,
    updateGridSize,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}

// Hook to use dashboard context
export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
}
