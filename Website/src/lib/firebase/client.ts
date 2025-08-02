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
  measurementId?: string;
}

class FirebaseClient {
  private app: FirebaseApp | null = null;
  private db: Database | null = null;
  private config: FirebaseConfig | null = null;

  /**
   * Initialize Firebase with user-provided config
   */
  initialize(config: FirebaseConfig): boolean {
    try {
      // Validate required fields
      if (!config.databaseURL || !config.projectId) {
        throw new Error('Database URL and Project ID are required');
      }

      // Validate database URL format
      if (!config.databaseURL.startsWith('https://') && !config.databaseURL.startsWith('http://')) {
        throw new Error('Database URL must start with https:// or http://');
      }

      this.config = config;
      this.app = initializeApp(config);
      
      this.db = getDatabase(this.app);
      
      // Save config to localStorage for auto-connect
      this.saveConfigToStorage(config);
      
      return true;
    } catch (error) {
      this.reset();
      return false;
    }
  }

  /**
   * Reset Firebase connection
   */
  reset(): void {
    this.app = null;
    this.db = null;
    this.config = null;
    // Clear saved config from localStorage
    this.clearConfigFromStorage();
  }

  /**
   * Get database instance
   */
  getDatabase(): Database | null {
    if (!this.db) {
      console.warn('Firebase: Database not initialized');
    }
    return this.db;
  }

  /**
   * Get app instance
   */
  getApp(): FirebaseApp | null {
    if (!this.app) {
    }
    return this.app;
  }

  /**
   * Get current config
   */
  getConfig(): FirebaseConfig | null {
    if (!this.config) {
    }
    return this.config;
  }

  /**
   * Check if Firebase is initialized
   */
  isInitialized(): boolean {
    const initialized = this.app !== null && this.db !== null;
    return initialized;
  }

  /**
   * Auto-initialize from saved config
   */
  autoInitialize(): boolean {
    const savedConfig = this.loadConfigFromStorage();
    if (savedConfig) {
      return this.initialize(savedConfig);
    } else {
      return false;
    }
  }

  /**
   * Save config to localStorage
   */
  private saveConfigToStorage(config: FirebaseConfig): void {
    try {
      localStorage.setItem('firebase_config', JSON.stringify(config));
    } catch (error) {
      console.warn('Firebase: Failed to save config to localStorage:', error);
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
        return config;
      } else {
        return null;
      }
    } catch (error) {
      console.warn('Firebase: Failed to load config from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear config from localStorage
   */
  private clearConfigFromStorage(): void {
    try {
      localStorage.removeItem('firebase_config');
    } catch (error) {
      console.warn('Firebase: Failed to clear config from localStorage:', error);
    }
  }
}

// Export singleton instance
export const firebaseClient = new FirebaseClient();