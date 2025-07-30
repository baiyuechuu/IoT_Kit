import { firebaseClient } from './client';
import { ref, onValue, off, DataSnapshot } from 'firebase/database';

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
      onError?.(new Error('Firebase not initialized. Please configure Firebase connection first.'));
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
          console.error('Firebase realtime error:', error);
          onError?.(new Error(`Failed to read ${variablePath}: ${error.message}`));
        }
      );

      return {
        unsubscribe: () => off(variableRef, 'value', unsubscribe)
      };
    } catch (error) {
      console.error('Error subscribing to variable:', error);
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
      onError?.(new Error('Firebase not initialized. Please configure Firebase connection first.'));
      return null;
    }

    const subscriptions: RealtimeSubscription[] = [];
    const variableData: Record<string, any> = {};

    try {
      variables.forEach(variable => {
        const subscription = this.subscribeToVariable(
          variable.path,
          (value) => {
            // Type conversion based on configuration
            variableData[variable.path] = this.convertValue(value, variable.type);
            callback({ ...variableData });
          },
          onError
        );
        
        if (subscription) {
          subscriptions.push(subscription);
        }
      });

      return {
        unsubscribe: () => {
          subscriptions.forEach(sub => sub.unsubscribe());
        }
      };
    } catch (error) {
      console.error('Error subscribing to variables:', error);
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
      return expectedType ? this.convertValue(value, expectedType) : value;
    } catch (error) {
      console.error('Error getting value:', error);
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
      const testRef = ref(database, '.info/connected');
      const snapshot = await new Promise<DataSnapshot>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 5000);
        onValue(testRef, (snap) => {
          clearTimeout(timeout);
          resolve(snap);
        }, reject, { onlyOnce: true });
      });
      
      return snapshot.val() === true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  }

  /**
   * Convert value to expected type
   */
  private convertValue(value: any, expectedType: string): any {
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

  /**
   * Check if Firebase is ready to use
   */
  isReady(): boolean {
    return firebaseClient.isInitialized();
  }
}

export const realtimeService = new RealtimeService();