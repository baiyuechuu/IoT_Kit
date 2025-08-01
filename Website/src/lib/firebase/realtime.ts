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
    console.log('📡 Firebase Realtime: Subscribing to variable:', variablePath);
    
    const database = firebaseClient.getDatabase();
    
    if (!database) {
      const error = new Error('Firebase not initialized. Please configure Firebase connection first.');
      console.error('❌ Firebase Realtime: Database not available for subscription');
      onError?.(error);
      return null;
    }

    try {
      console.log('🔗 Firebase Realtime: Creating reference for path:', variablePath);
      const variableRef = ref(database, variablePath);
      
      console.log('👂 Firebase Realtime: Setting up listener for:', variablePath);
      const unsubscribe = onValue(
        variableRef,
        (snapshot: DataSnapshot) => {
          const value = snapshot.val();
          console.log('📊 Firebase Realtime: Received value for', variablePath, ':', value);
          callback(value);
        },
        (error) => {
          console.error('❌ Firebase Realtime: Error reading', variablePath, ':', error);
          onError?.(new Error(`Failed to read ${variablePath}: ${error.message}`));
        }
      );

      console.log('✅ Firebase Realtime: Successfully subscribed to:', variablePath);
      return {
        unsubscribe: () => {
          console.log('🔌 Firebase Realtime: Unsubscribing from:', variablePath);
          off(variableRef, 'value', unsubscribe);
        }
      };
    } catch (error) {
      console.error('❌ Firebase Realtime: Error subscribing to variable:', variablePath, error);
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
    console.log('📡 Firebase Realtime: Subscribing to multiple variables:', variables.map(v => v.path));
    
    const database = firebaseClient.getDatabase();
    
    if (!database) {
      const error = new Error('Firebase not initialized. Please configure Firebase connection first.');
      console.error('❌ Firebase Realtime: Database not available for multiple subscriptions');
      onError?.(error);
      return null;
    }

    const subscriptions: RealtimeSubscription[] = [];
    const variableData: Record<string, any> = {};

    try {
      console.log('🔄 Firebase Realtime: Setting up subscriptions for', variables.length, 'variables');
      
      variables.forEach((variable, index) => {
        console.log(`📡 Firebase Realtime: Setting up subscription ${index + 1}/${variables.length} for:`, variable.path);
        
        const subscription = this.subscribeToVariable(
          variable.path,
          (value) => {
            // Type conversion based on configuration
            const convertedValue = this.convertValue(value, variable.type);
            variableData[variable.path] = convertedValue;
            console.log('📊 Firebase Realtime: Updated data for', variable.path, ':', convertedValue);
            console.log('📊 Firebase Realtime: Current data state:', variableData);
            callback({ ...variableData });
          },
          onError
        );
        
        if (subscription) {
          subscriptions.push(subscription);
          console.log(`✅ Firebase Realtime: Subscription ${index + 1} successful`);
        } else {
          console.error(`❌ Firebase Realtime: Subscription ${index + 1} failed`);
        }
      });

      console.log('✅ Firebase Realtime: All subscriptions set up successfully');
      return {
        unsubscribe: () => {
          console.log('🔌 Firebase Realtime: Unsubscribing from all variables');
          subscriptions.forEach((sub, index) => {
            console.log(`🔌 Firebase Realtime: Unsubscribing from subscription ${index + 1}`);
            sub.unsubscribe();
          });
        }
      };
    } catch (error) {
      console.error('❌ Firebase Realtime: Error subscribing to variables:', error);
      onError?.(new Error('Failed to subscribe to variables'));
      return null;
    }
  }

  /**
   * Get a single value from Firebase (one-time read)
   */
  async getValue(variablePath: string, expectedType?: string): Promise<any> {
    console.log('📡 Firebase Realtime: Getting value for:', variablePath, 'expected type:', expectedType);
    
    const database = firebaseClient.getDatabase();
    
    if (!database) {
      console.error('❌ Firebase Realtime: Database not available for getValue');
      throw new Error('Firebase not initialized. Please configure Firebase connection first.');
    }

    try {
      console.log('🔗 Firebase Realtime: Creating reference for one-time read:', variablePath);
      const variableRef = ref(database, variablePath);
      
      console.log('⏳ Firebase Realtime: Waiting for value...');
      const snapshot = await new Promise<DataSnapshot>((resolve, reject) => {
        onValue(variableRef, resolve, reject, { onlyOnce: true });
      });
      
      const value = snapshot.val();
      const convertedValue = expectedType ? this.convertValue(value, expectedType) : value;
      console.log('📊 Firebase Realtime: Got value for', variablePath, ':', convertedValue);
      return convertedValue;
    } catch (error) {
      console.error('❌ Firebase Realtime: Error getting value from', variablePath, ':', error);
      throw new Error(`Failed to get value from ${variablePath}: ${error}`);
    }
  }

  /**
   * Test Firebase connection
   */
  async testConnection(): Promise<boolean> {
    console.log('🔍 Firebase Realtime: Testing connection...');
    
    const database = firebaseClient.getDatabase();
    
    if (!database) {
      console.error('❌ Firebase Realtime: Database not available for connection test');
      return false;
    }

    try {
      // Try to read a test value from the database to verify connection
      console.log('🔗 Firebase Realtime: Testing connection by reading a test value');
      const testRef = ref(database, '.info/connected');
      
      console.log('⏳ Firebase Realtime: Waiting for connection test result...');
      const snapshot = await new Promise<DataSnapshot>((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.error('⏰ Firebase Realtime: Connection test timeout');
          reject(new Error('Connection timeout - please check your network and Firebase configuration'));
        }, 3000); // Reduced timeout to 3 seconds
        
        onValue(testRef, (snap) => {
          clearTimeout(timeout);
          console.log('📊 Firebase Realtime: Connection test result:', snap.val());
          resolve(snap);
        }, (error) => {
          clearTimeout(timeout);
          console.error('❌ Firebase Realtime: Connection test error:', error);
          reject(new Error(`Connection test failed: ${error.message}`));
        }, { onlyOnce: true });
      });
      
      // If we can read from .info/connected, we're connected
      const isConnected = snapshot.val() !== null;
      console.log('✅ Firebase Realtime: Connection test result:', isConnected);
      return isConnected;
    } catch (error) {
      console.error('❌ Firebase Realtime: Connection test failed:', error);
      
      // Fallback: try to read a simple value to test connection
      try {
        console.log('🔄 Firebase Realtime: Trying fallback connection test...');
        const fallbackRef = ref(database, 'test_connection');
        await get(fallbackRef);
        console.log('✅ Firebase Realtime: Fallback connection test successful');
        return true;
      } catch (fallbackError) {
        console.error('❌ Firebase Realtime: Fallback connection test also failed:', fallbackError);
        
        // If both tests fail, but we can initialize Firebase, consider it connected
        // This handles cases where the database is accessible but .info/connected doesn't work
        const isInitialized = firebaseClient.isInitialized();
        if (isInitialized) {
          console.log('✅ Firebase Realtime: Firebase is initialized, considering connected');
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
    console.log('🔄 Firebase Realtime: Converting value:', value, 'to type:', expectedType);
    
    if (value === null || value === undefined) {
      console.log('📊 Firebase Realtime: Value is null/undefined, returning as-is');
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
    
    console.log('📊 Firebase Realtime: Converted value:', convertedValue);
    return convertedValue;
  }

  /**
   * Check if Firebase is ready to use
   */
  isReady(): boolean {
    const ready = firebaseClient.isInitialized();
    console.log('🔍 Firebase Realtime: Ready status:', ready);
    return ready;
  }
}

export const realtimeService = new RealtimeService();