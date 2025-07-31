// Firebase exports
console.log('📦 Firebase: Loading Firebase modules...');

export { firebaseClient, type FirebaseConfig } from './client';
export { realtimeService, type RealtimeSubscription, type VariableConfig } from './realtime';

// Re-export Firebase functions that might be needed
export {
  ref,
  onValue,
  off,
  type DataSnapshot
} from 'firebase/database';

console.log('✅ Firebase: All modules loaded successfully');
