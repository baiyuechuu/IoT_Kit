import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { realtimeService, firebaseClient, type FirebaseConfig } from '@/lib/firebase';

interface FirebaseContextState {
  connected: boolean;
  configured: boolean;
  loading: boolean;
  error: string | null;
}

interface FirebaseContextValue extends FirebaseContextState {
  // Actions
  initialize: (config: FirebaseConfig) => Promise<void>;
  reset: () => void;
  testConnection: () => Promise<boolean>;
  checkRealConnection: () => Promise<boolean>;
  clearError: () => void;
  setError: (error: string | null) => void;
  
  // Computed
  isReady: boolean;
  config: FirebaseConfig | null;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

interface FirebaseProviderProps {
  children: ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [connected, setConnected] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Firebase with config
  const initialize = useCallback(async (config: FirebaseConfig) => {
    setLoading(true);
    setError(null);

    try {
      const success = firebaseClient.initialize(config);
      
      if (success) {
        const isConnected = await realtimeService.testConnection();
        setConnected(isConnected);
        setConfigured(true);
        
        if (!isConnected) {
          setError('Firebase initialized but connection test failed. Please check your database settings.');
        }
      } else {
        setError('Failed to initialize Firebase. Please check your configuration.');
        setConnected(false);
        setConfigured(false);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setConnected(false);
      setConfigured(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset Firebase connection
  const reset = useCallback(() => {
    firebaseClient.reset();
    setConnected(false);
    setConfigured(false);
    setError(null);
  }, []);

  // Test connection
  const testConnection = useCallback(async () => {
    if (!configured) {
      setError('Firebase not configured');
      return false;
    }

    setLoading(true);
    try {
      const isConnected = await realtimeService.testConnection();
      setConnected(isConnected);
      setError(isConnected ? null : 'Connection test failed');
      return isConnected;
    } catch (error) {
      setConnected(false);
      setError(error instanceof Error ? error.message : 'Connection test failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, [configured]);

  // Check if Firebase is actually working by testing a real subscription
  const checkRealConnection = useCallback(async () => {
    if (!configured) {
      return false;
    }

    try {
      // Try to subscribe to a test value to see if we can actually receive data
      const testSubscription = realtimeService.subscribeToVariable(
        'test_connection_status',
        (value) => {
          console.log('✅ Firebase: Real connection test successful, received value:', value);
          setConnected(true);
          setError(null);
        },
        (error) => {
          console.log('❌ Firebase: Real connection test failed:', error.message);
          setConnected(false);
          setError('Connection test failed');
        }
      );

      // Clean up the test subscription after a short delay
      setTimeout(() => {
        if (testSubscription) {
          testSubscription.unsubscribe();
        }
      }, 2000);

      return true;
    } catch (error) {
      console.error('❌ Firebase: Real connection test error:', error);
      return false;
    }
  }, [configured]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check initial state - only auto-initialize if there's a saved config, don't show dialog automatically
  useEffect(() => {
    const initializeFromStorage = async () => {
      const wasInitialized = firebaseClient.isInitialized();
      
      if (!wasInitialized) {
        // Try to auto-initialize from saved config silently
        const autoInitSuccess = firebaseClient.autoInitialize();
        if (autoInitSuccess) {
          setConfigured(true);
          // Use the more reliable connection check
          await checkRealConnection();
        }
      } else {
        setConfigured(true);
        // Use the more reliable connection check
        await checkRealConnection();
      }
    };

    initializeFromStorage();
  }, [checkRealConnection]);

  const contextValue: FirebaseContextValue = {
    // State
    connected,
    configured,
    loading,
    error,
    
    // Actions
    initialize,
    reset,
    testConnection,
    checkRealConnection,
    clearError,
    setError,
    
    // Computed
    isReady: configured && connected && !loading,
    config: firebaseClient.getConfig(),
  };

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Hook to use Firebase context
export function useFirebaseConnection() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseConnection must be used within a FirebaseProvider');
  }
  return context;
} 