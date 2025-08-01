import { useState, useEffect, useCallback, useRef } from 'react';
import { realtimeService, type RealtimeSubscription, type VariableConfig } from '@/lib/firebase';

interface UseFirebaseVariableOptions {
  variablePath?: string;
  variableType?: 'string' | 'number' | 'boolean' | 'object';
  autoConnect?: boolean;
}

interface UseFirebaseVariablesOptions {
  variables?: VariableConfig[];
  autoConnect?: boolean;
}

interface FirebaseVariableState {
  value: any;
  connected: boolean;
  loading: boolean;
  error: string | null;
}

interface FirebaseVariablesState {
  data: Record<string, any>;
  connected: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for connecting to a single Firebase variable
 */
export function useFirebaseVariable(options: UseFirebaseVariableOptions = {}) {
  const { variablePath, variableType = 'string', autoConnect = true } = options;
  const subscriptionRef = useRef<RealtimeSubscription | null>(null);
  
  const [state, setState] = useState<FirebaseVariableState>({
    value: null,
    connected: false,
    loading: false,
    error: null,
  });

  // Connect to variable
  const connect = useCallback(async (path?: string, type?: string) => {
    const targetPath = path || variablePath;
    const targetType = type || variableType;
    
    if (!targetPath) {
      setState(prev => ({ ...prev, error: 'No variable path provided' }));
      return;
    }

    if (!realtimeService.isReady()) {
      setState(prev => ({ ...prev, error: 'Firebase not configured. Please set up Firebase connection first.' }));
      return;
    }

    // Disconnect existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Subscribe to variable data
      subscriptionRef.current = realtimeService.subscribeToVariable(
        targetPath,
        (value) => {
          // Convert value based on expected type
          const convertedValue = convertValue(value, targetType);
          setState(prev => ({
            ...prev,
            value: convertedValue,
            connected: true,
            loading: false,
            error: null,
          }));
        },
        (error) => {
          setState(prev => ({
            ...prev,
            connected: false,
            loading: false,
            error: error.message,
          }));
        }
      );
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        connected: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      }));
    }
  }, [variablePath, variableType]);

  // Disconnect from variable
  const disconnect = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    setState(prev => ({
      ...prev,
      connected: false,
      loading: false,
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && variablePath && realtimeService.isReady()) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, variablePath, connect, disconnect]);

  return {
    // State
    value: state.value,
    connected: state.connected,
    loading: state.loading,
    error: state.error,
    
    // Actions
    connect,
    disconnect,
    clearError,
    
    // Computed
    isReady: state.connected && !state.loading,
    hasValue: state.value !== null && state.value !== undefined,
  };
}

/**
 * Hook for connecting to multiple Firebase variables
 */
export function useFirebaseVariables(options: UseFirebaseVariablesOptions = {}) {
  const { variables = [], autoConnect = true } = options;
  const subscriptionRef = useRef<RealtimeSubscription | null>(null);
  
  const [state, setState] = useState<FirebaseVariablesState>({
    data: {},
    connected: false,
    loading: false,
    error: null,
  });

  // Connect to variables
  const connect = useCallback(async (targetVariables?: VariableConfig[]) => {
    const vars = targetVariables || variables;
    if (vars.length === 0) {
      setState(prev => ({ ...prev, error: 'No variables provided' }));
      return;
    }

    if (!realtimeService.isReady()) {
      setState(prev => ({ ...prev, error: 'Firebase not configured. Please set up Firebase connection first.' }));
      return;
    }

    // Disconnect existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Subscribe to variables data
      subscriptionRef.current = realtimeService.subscribeToVariables(
        vars,
        (data) => {
          setState(prev => ({
            ...prev,
            data,
            connected: true,
            loading: false,
            error: null,
          }));
        },
        (error) => {
          setState(prev => ({
            ...prev,
            connected: false,
            loading: false,
            error: error.message,
          }));
        }
      );
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        connected: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      }));
    }
  }, [variables]);

  // Disconnect from variables
  const disconnect = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    setState(prev => ({
      ...prev,
      connected: false,
      loading: false,
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && variables.length > 0 && realtimeService.isReady()) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, variables, connect, disconnect]);

  return {
    // State
    data: state.data,
    connected: state.connected,
    loading: state.loading,
    error: state.error,
    
    // Actions
    connect,
    disconnect,
    clearError,
    
    // Computed
    isReady: state.connected && !state.loading,
    variableCount: Object.keys(state.data).length,
    getValue: (path: string) => state.data[path],
  };
}

// Helper function to convert values
function convertValue(value: any, expectedType: string): any {
  if (value === null || value === undefined) {
    return value;
  }

  switch (expectedType) {
    case 'string':
      return String(value);
    case 'number':
      return Number(value);
    case 'boolean':
      return Boolean(value);
    case 'object':
      return typeof value === 'object' ? value : {};
    default:
      return value;
  }
}