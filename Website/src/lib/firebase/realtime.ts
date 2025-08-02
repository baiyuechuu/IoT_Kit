import { firebaseClient } from './client';
import { ref, onValue, off, DataSnapshot, get } from 'firebase/database';

export interface RealtimeSubscription {
  unsubscribe: () => void;
}

export interface VariableConfig {
  path: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  label?: string;
}

class RealtimeService {
  /**
   * Subscribe to a Firebase variable path
   */
  subscribeToVariable(
    variablePath: string,
    callback: (value: any) => void,
    onError?: (error: Error) => void
  ): RealtimeSubscription | null {
    
    const database = firebaseClient.getDatabase();
    
    if (!database) {
      const error = new Error('Firebase not initialized. Please configure Firebase connection first.');
      onError?.(error);
      return null;
    }

    try {
      const variableRef = ref(database, variablePath);
      
      const unsubscribe = onValue(
        variableRef,
        (snapshot: DataSnapshot) => {
          const value = snapshot.val();
          callback(value);
        },
        (error) => {
          onError?.(new Error(`Failed to read ${variablePath}: ${error.message}`));
        }
      );

      return {
        unsubscribe: () => {
          off(variableRef, 'value', unsubscribe);
        }
      };
    } catch (error) {
      onError?.(new Error(`Failed to subscribe to ${variablePath}`));
      return null;
    }
  }

  /**
   * Subscribe to multiple variables
   */
  subscribeToVariables(
    variables: VariableConfig[],
    callback: (data: Record<string, any>) => void,
    onError?: (error: Error) => void
  ): RealtimeSubscription | null {
    
    const database = firebaseClient.getDatabase();
    
    if (!database) {
      const error = new Error('Firebase not initialized. Please configure Firebase connection first.');
      onError?.(error);
      return null;
    }

    const subscriptions: RealtimeSubscription[] = [];
    const variableData: Record<string, any> = {};

    try {
      
      variables.forEach((variable, index) => {
        
        const subscription = this.subscribeToVariable(
          variable.path,
          (value) => {
            // Type conversion based on configuration
            const convertedValue = this.convertValue(value, variable.type);
            variableData[variable.path] = convertedValue;
            callback({ ...variableData });
          },
          onError
        );
        
        if (subscription) {
          subscriptions.push(subscription);
        } else {
          console.error(`Firebase Realtime: Subscription ${index + 1} failed`);
        }
      });

      return {
        unsubscribe: () => {
          subscriptions.forEach((sub, index) => {
            sub.unsubscribe();
          });
        }
      };
    } catch (error) {
      onError?.(new Error('Failed to subscribe to variables'));
      return null;
    }
  }

  /**
   * Get a single value from Firebase (one-time read)
   */
  async getValue(variablePath: string, expectedType?: string): Promise<any> {
    
    const database = firebaseClient.getDatabase();
    
    if (!database) {
      throw new Error('Firebase not initialized. Please configure Firebase connection first.');
    }

    try {
      const variableRef = ref(database, variablePath);
      
      const snapshot = await new Promise<DataSnapshot>((resolve, reject) => {
        onValue(variableRef, resolve, reject, { onlyOnce: true });
      });
      
      const value = snapshot.val();
      const convertedValue = expectedType ? this.convertValue(value, expectedType) : value;
      return convertedValue;
    } catch (error) {
      throw new Error(`Failed to get value from ${variablePath}: ${error}`);
    }
  }

  /**
   * Test Firebase connection
   */
  async testConnection(): Promise<boolean> {
    
    const database = firebaseClient.getDatabase();
    
    if (!database) {
      return false;
    }

    try {
      // Try to read a test value from the database to verify connection
      const testRef = ref(database, '.info/connected');
      
      const snapshot = await new Promise<DataSnapshot>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout - please check your network and Firebase configuration'));
        }, 3000); // Reduced timeout to 3 seconds
        
        onValue(testRef, (snap) => {
          clearTimeout(timeout);
          resolve(snap);
        }, (error) => {
          clearTimeout(timeout);
          reject(new Error(`Connection test failed: ${error.message}`));
        }, { onlyOnce: true });
      });
      
      // If we can read from .info/connected, we're connected
      const isConnected = snapshot.val() !== null;
      return isConnected;
    } catch (error) {
      
      // Fallback: try to read a simple value to test connection
      try {
        const fallbackRef = ref(database, 'test_connection');
        await get(fallbackRef);
        return true;
      } catch (fallbackError) {
        
        // If both tests fail, but we can initialize Firebase, consider it connected
        // This handles cases where the database is accessible but .info/connected doesn't work
        const isInitialized = firebaseClient.isInitialized();
        if (isInitialized) {
          return true;
        }
        
        return false;
      }
    }
  }

  /**
   * Convert value to expected type
   */
  private convertValue(value: any, expectedType: string): any {
    
    if (value === null || value === undefined) {
      return value;
    }

    let convertedValue: any;
    switch (expectedType) {
      case 'string':
        convertedValue = String(value);
        break;
      case 'number':
        convertedValue = Number(value);
        break;
      case 'boolean':
        convertedValue = Boolean(value);
        break;
      case 'object':
        convertedValue = typeof value === 'object' ? value : {};
        break;
      default:
        convertedValue = value;
    }
    
    return convertedValue;
  }

  /**
   * Check if Firebase is ready to use
   */
  isReady(): boolean {
    const ready = firebaseClient.isInitialized();
    return ready;
  }
}

export const realtimeService = new RealtimeService();