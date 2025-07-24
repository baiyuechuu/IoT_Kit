// File test để debug OAuth - có thể xóa sau khi fix
import { auth } from '@/lib/supabase/utils';

export function TestAuth() {
  // Debug environment variables
  console.log('🔍 Environment Check:');
  console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');

  const testGoogle = async () => {
    console.log('Testing Google OAuth...');
    try {
      const result = await auth.signInWithGoogle();
      console.log('Google result:', result);
    } catch (error) {
      console.error('Google error:', error);
    }
  };

  const testGitHub = async () => {
    console.log('Testing GitHub OAuth...');
    try {
      const result = await auth.signInWithGitHub();
      console.log('GitHub result:', result);
    } catch (error) {
      console.error('GitHub error:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2>Test OAuth Providers</h2>
      <button 
        onClick={testGoogle}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Google
      </button>
      <button 
        onClick={testGitHub}
        className="px-4 py-2 bg-gray-800 text-white rounded"
      >
        Test GitHub
      </button>
    </div>
  );
} 