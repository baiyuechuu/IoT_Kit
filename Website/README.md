# IoT Kit Website

A modern React + TypeScript application for managing IoT devices with secure authentication using Supabase.

## Features

- 🔐 **Secure Authentication** with restricted access
  - Email/password authentication (restricted to specific email)
  - Google OAuth integration
  - GitHub OAuth integration
  - Protected routes and automatic redirects
- 🎨 **Modern UI** with Tailwind CSS and shadcn/ui components
- 📱 **Responsive Design** optimized for all devices
- ⚡ **Fast Development** with Vite and Hot Module Replacement
- 🛡️ **Type Safety** with TypeScript throughout

## Authentication System

This application implements a **restricted authentication system** that only allows access to specific users:

### Allowed Users
- **Email**: `ebevutru@gmail.com` (for email/password and Google OAuth)
- **GitHub**: `@baiyuechuu` (for GitHub OAuth)

### Authentication Features
- Multiple sign-in methods (Email, Google, GitHub)
- Automatic OAuth user validation
- Protected dashboard routes
- Session management with persistent login
- Secure logout functionality

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Website
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   bun dev
   ```

## Supabase Configuration

### 1. Authentication Settings

In your Supabase dashboard, configure the following:

#### Auth Settings
- Enable email confirmations (optional for development)
- Set up site URL: `http://localhost:5173` (development) or your production URL

#### OAuth Providers

**Google OAuth:**
1. Go to Authentication > Providers > Google
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

**GitHub OAuth:**
1. Go to Authentication > Providers > GitHub
2. Enable GitHub provider
3. Add your GitHub OAuth credentials
4. Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 2. Database Types

Generate TypeScript types from your Supabase schema:
```bash
bunx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── magicui/         # Magic UI components
│   ├── ProtectedRoute.tsx
│   └── ...
├── hooks/
│   └── useAuth.ts       # Authentication hook
├── lib/
│   └── supabase/        # Supabase configuration
│       ├── client.ts
│       ├── utils.ts     # Auth utilities
│       └── server.ts
├── pages/
│   ├── login/           # Login page components
│   ├── signup/          # Signup page components
│   ├── dashboard/       # Protected dashboard
│   └── ...
├── routes/              # Route configurations
└── types/
    └── supabase.ts      # Database types
```

## Authentication Flow

1. **Login/Signup**: Users can sign in using email/password or OAuth providers
2. **Validation**: The system validates users against the allowed list
3. **Redirect**: Successful authentication redirects to the dashboard
4. **Protection**: Protected routes automatically redirect unauthenticated users
5. **Session**: Authentication state is managed globally with the `useAuth` hook

## Usage

### Authentication Hook

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Wrap any component that requires authentication
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

## Development

### Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun preview` - Preview production build
- `bun lint` - Run ESLint

### Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Supabase Auth
- **Routing**: React Router DOM
- **State Management**: React hooks
- **Icons**: Lucide React, React Icons

## Security Notes

- Authentication is restricted to specific users only
- OAuth users are validated after successful authentication
- Unauthorized users are automatically signed out
- All routes to the dashboard are protected
- Environment variables contain sensitive Supabase credentials

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test authentication flows
5. Submit a pull request

## License

This project is private and restricted to authorized users only.