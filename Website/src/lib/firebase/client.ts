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
    try {
      // Validate required fields
      if (!config.databaseURL || !config.projectId) {
        throw new Error('Database URL and Project ID are required');
      }

      this.config = config;
      this.app = initializeApp(config);
      this.db = getDatabase(this.app);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
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
  }

  /**
   * Get database instance
   */
  getDatabase(): Database | null {
    return this.db;
  }

  /**
   * Get app instance
   */
  getApp(): FirebaseApp | null {
    return this.app;
  }

  /**
   * Get current config
   */
  getConfig(): FirebaseConfig | null {
    return this.config;
  }

  /**
   * Check if Firebase is initialized
   */
  isInitialized(): boolean {
    return this.app !== null && this.db !== null;
  }
}

// Export singleton instance
export const firebaseClient = new FirebaseClient();