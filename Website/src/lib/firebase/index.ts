// Firebase exports
export { firebaseClient, type FirebaseConfig } from './client';
export { realtimeService, type RealtimeSubscription, type VariableConfig } from './realtime';

// Re-export Firebase functions that might be needed
export {
  ref,
  onValue,
  off,
  type DataSnapshot
} from 'firebase/database';
