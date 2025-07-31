import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

class FirebaseClient {
  private app: FirebaseApp | null = null;
  private db: Database | null = null;
  private config: FirebaseConfig | null = null;

  /**
   * Initialize Firebase with user-provided config
   */
  initialize(config: FirebaseConfig): boolean {
    console.log('🔧 Firebase: Initializing with config:', { 
      projectId: config.projectId, 
      databaseURL: config.databaseURL,
      authDomain: config.authDomain 
    });
    
    try {
      // Validate required fields
      if (!config.databaseURL || !config.projectId) {
        console.error('❌ Firebase: Missing required fields - databaseURL or projectId');
        throw new Error('Database URL and Project ID are required');
      }

      console.log('✅ Firebase: Config validation passed');
      
      this.config = config;
      this.app = initializeApp(config);
      console.log('✅ Firebase: App initialized successfully');
      
      this.db = getDatabase(this.app);
      console.log('✅ Firebase: Database initialized successfully');
      
      // Save config to localStorage for auto-connect
      this.saveConfigToStorage(config);
      console.log('💾 Firebase: Config saved to localStorage');
      
      return true;
    } catch (error) {
      console.error('❌ Firebase: Failed to initialize:', error);
      this.reset();
      return false;
    }
  }

  /**
   * Reset Firebase connection
   */
  reset(): void {
    console.log('🔄 Firebase: Resetting connection');
    this.app = null;
    this.db = null;
    this.config = null;
    // Clear saved config from localStorage
    this.clearConfigFromStorage();
    console.log('✅ Firebase: Reset complete');
  }

  /**
   * Get database instance
   */
  getDatabase(): Database | null {
    if (!this.db) {
      console.warn('⚠️ Firebase: Database not initialized');
    }
    return this.db;
  }

  /**
   * Get app instance
   */
  getApp(): FirebaseApp | null {
    if (!this.app) {
      console.warn('⚠️ Firebase: App not initialized');
    }
    return this.app;
  }

  /**
   * Get current config
   */
  getConfig(): FirebaseConfig | null {
    if (!this.config) {
      console.warn('⚠️ Firebase: No config available');
    }
    return this.config;
  }

  /**
   * Check if Firebase is initialized
   */
  isInitialized(): boolean {
    const initialized = this.app !== null && this.db !== null;
    console.log('🔍 Firebase: Initialization status:', initialized);
    return initialized;
  }

  /**
   * Auto-initialize from saved config
   */
  autoInitialize(): boolean {
    console.log('🔄 Firebase: Attempting auto-initialization');
    const savedConfig = this.loadConfigFromStorage();
    if (savedConfig) {
      console.log('📋 Firebase: Found saved config, attempting to initialize');
      return this.initialize(savedConfig);
    } else {
      console.log('📋 Firebase: No saved config found');
      return false;
    }
  }

  /**
   * Save config to localStorage
   */
  private saveConfigToStorage(config: FirebaseConfig): void {
    try {
      localStorage.setItem('firebase_config', JSON.stringify(config));
      console.log('💾 Firebase: Config saved to localStorage');
    } catch (error) {
      console.warn('⚠️ Firebase: Failed to save config to localStorage:', error);
    }
  }

  /**
   * Load config from localStorage
   */
  private loadConfigFromStorage(): FirebaseConfig | null {
    try {
      const saved = localStorage.getItem('firebase_config');
      if (saved) {
        const config = JSON.parse(saved);
        console.log('📋 Firebase: Loaded config from localStorage:', { 
          projectId: config.projectId, 
          databaseURL: config.databaseURL 
        });
        return config;
      } else {
        console.log('📋 Firebase: No saved config in localStorage');
        return null;
      }
    } catch (error) {
      console.warn('⚠️ Firebase: Failed to load config from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear config from localStorage
   */
  private clearConfigFromStorage(): void {
    try {
      localStorage.removeItem('firebase_config');
      console.log('🗑️ Firebase: Config cleared from localStorage');
    } catch (error) {
      console.warn('⚠️ Firebase: Failed to clear config from localStorage:', error);
    }
  }
}

// Export singleton instance
export const firebaseClient = new FirebaseClient();