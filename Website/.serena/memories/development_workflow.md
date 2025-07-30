# Development Workflow

## Available Commands

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Documentation
- `npm run generate-docs` - Generate documentation

## Development Environment

### Development Mode
- Dashboard shows DevPage when `import.meta.env.DEV` is true
- Full widget editing capabilities
- Real-time auto-save functionality
- Advanced widget management features

### Production Mode
- Shows production dashboard with tabs
- Waitlist and Manifest components
- Simplified user interface

## Code Style and Conventions

### TypeScript
- Strict TypeScript configuration
- Type-safe widget configuration
- Interface-first development

### React Patterns
- Functional components with hooks
- Custom hooks for state management
- Component composition

### Styling
- Tailwind CSS for styling
- Responsive design patterns
- Dark/light theme support

### File Organization
- Feature-based directory structure
- Shared components in `src/components/`
- Page components in `src/pages/`
- Hooks in `src/hooks/`
- Types in `src/types/`

## Key Development Files

### Dashboard Development
- `src/pages/dashboard/dev/DevPage.tsx` - Main development dashboard
- `src/pages/dashboard/dev/components/MainDashboard.tsx` - Grid layout component
- `src/pages/dashboard/dev/components/widgets/` - Widget implementations
- `src/pages/dashboard/dev/components/AddWidgetDialog.tsx` - Widget addition
- `src/pages/dashboard/dev/components/WidgetSettingsDialog.tsx` - Widget editing

### Hooks
- `src/hooks/useDashboard.ts` - Dashboard state management
- `src/hooks/useAuth.ts` - Authentication
- `src/hooks/useConfirmation.tsx` - Confirmation dialogs

### Services
- `src/lib/supabase/dashboard.ts` - Dashboard data operations