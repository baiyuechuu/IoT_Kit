import { useState, useEffect, useCallback, useRef } from 'react';
import { realtimeService, type RealtimeSubscription } from '@/lib/firebase';

interface SensorData {
  [sensorId: string]: number;
}

interface UseFirebaseSensorsOptions {
  sensorType: 'temperature' | 'humidity';
  autoConnect?: boolean;
}

interface FirebaseSensorsState {
  data: SensorData;
  connected: boolean;
  loading: boolean;
  error: string | null;
  sensorIds: string[];
}

/**
 * Hook for connecting to multiple sensors of a specific type (temperature or humidity)
 */
export function useFirebaseSensors(options: UseFirebaseSensorsOptions) {
  const { sensorType, autoConnect = true } = options;
  const subscriptionRef = useRef<RealtimeSubscription | null>(null);
  
  const [state, setState] = useState<FirebaseSensorsState>({
    data: {},
    connected: false,
    loading: false,
    error: null,
    sensorIds: [],
  });

  // Connect to sensors
  const connect = useCallback(async () => {
    if (!realtimeService.isReady()) {
      setState(prev => ({ 
        ...prev, 
        error: 'Firebase not configured. Please set up Firebase connection first.' 
      }));
      return;
    }

    // Disconnect existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Subscribe to the sensor type path (e.g., /sensors/temperature or /sensors/humidity)
      const sensorPath = `/sensors/${sensorType}`;
      
      subscriptionRef.current = realtimeService.subscribeToVariable(
        sensorPath,
        (value) => {
          if (value && typeof value === 'object') {
            // Extract sensor IDs and their values
            const sensorData: SensorData = {};
            const sensorIds: string[] = [];
            
            Object.keys(value).forEach(sensorId => {
              const sensorValue = Number(value[sensorId]);
              if (!isNaN(sensorValue)) {
                sensorData[sensorId] = sensorValue;
                sensorIds.push(sensorId);
              }
            });

            setState(prev => ({
              ...prev,
              data: sensorData,
              sensorIds,
              connected: true,
              loading: false,
              error: null,
            }));
          } else {
            setState(prev => ({
              ...prev,
              data: {},
              sensorIds: [],
              connected: true,
              loading: false,
              error: null,
            }));
          }
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
  }, [sensorType]);

  // Disconnect from sensors
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

  // Get sensor value
  const getSensorValue = useCallback((sensorId: string): number | null => {
    return state.data[sensorId] ?? null;
  }, [state.data]);

  // Get all sensor values as array for charts
  const getSensorValuesArray = useCallback(() => {
    return Object.entries(state.data).map(([sensorId, value]) => ({
      sensorId,
      value,
    }));
  }, [state.data]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && realtimeService.isReady()) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    // State
    data: state.data,
    sensorIds: state.sensorIds,
    connected: state.connected,
    loading: state.loading,
    error: state.error,
    
    // Actions
    connect,
    disconnect,
    clearError,
    
    // Computed
    isReady: state.connected && !state.loading,
    hasData: Object.keys(state.data).length > 0,
    sensorCount: state.sensorIds.length,
    getSensorValue,
    getSensorValuesArray,
  };
} 