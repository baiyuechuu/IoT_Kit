# GitHub OAuth Setup Guide

If you're seeing the error "Unsupported provider: provider is not enabled", follow these steps to enable GitHub OAuth authentication in your Supabase project.

## 🔧 Enable GitHub OAuth

1. **Create GitHub OAuth App:**
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"
   - Set Homepage URL to your domain
   - Set Authorization callback URL: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Note down your Client ID and Client Secret

2. **Configure in Supabase:**
   - Go to your Supabase Dashboard
   - Navigate to **Authentication** → **Providers**
   - Find **GitHub** and click to configure
   - Toggle "Enable sign in with GitHub"
   - Add your GitHub Client ID and Client Secret
   - Save the configuration

## 📧 Email-Only Authentication

If you prefer not to set up GitHub OAuth, you can use email/password authentication only:

- The system will show user-friendly error messages for disabled providers
- All users can sign up and log in using the email form
- No user restrictions - open registration for everyone

## 🚀 Testing

After enabling GitHub OAuth:
1. Restart your development server
2. Try logging in with GitHub
3. The GitHub OAuth button should now work properly

## 🔍 Finding Your Supabase Project Reference

Your Supabase project reference is in your project URL:
- Format: `https://[PROJECT_REF].supabase.co`
- Example: If your URL is `https://abcdef123456.supabase.co`, then `abcdef123456` is your project reference

## ⚠️ Important Notes

- OAuth redirect URLs must match exactly (including https://)
- Changes may take a few minutes to propagate
- Test in incognito/private browsing mode to avoid cached credentials
- Make sure your Supabase project is not paused 