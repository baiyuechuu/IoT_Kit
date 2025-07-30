# Dashboard Development Instructions

## ⚠️ DEVELOPMENT FOCUS INSTRUCTIONS ⚠️
**IGNORE**: Production dashboard with Waitlist/Manifest tabs  
**FOCUS**: Development dashboard (`src/pages/dashboard/dev/`) for IoT widget system  
**Primary Target**: Widget-based IoT device management interface

## Overview
The dashboard system consists of two main modes:
1. **Production Dashboard**: Simple tab-based interface with Waitlist and Manifest
2. **Development Dashboard**: Advanced widget-based system for IoT device management

## Development Dashboard Features

### Core Functionality
- **Widget Management**: Add, edit, delete, duplicate widgets
- **Drag & Drop**: Reposition widgets on grid
- **Resize**: Adjust widget dimensions
- **Edit Mode**: Toggle between view and edit modes
- **Auto-save**: Real-time saving with visual feedback
- **Responsive**: Mobile and desktop optimized

### Widget System
- **Current Widget**: Switch widget for IoT device control
- **Extensible**: Easy to add new widget types
- **Constraints**: Size limits for proper display
- **Configuration**: Widget-specific settings

### Key Components

#### DevPage.tsx
- Main development dashboard component
- Handles authentication and loading states
- Manages widget state and operations
- Provides edit mode toggle
- Handles error states and user feedback

#### MainDashboard.tsx
- Grid layout component using react-grid-layout
- Renders widgets based on their type
- Handles drag, resize, and layout changes
- Manages widget interactions

#### Widget System
- **SwitchWidget**: Toggle control for IoT devices
- **AddWidgetDialog**: Widget selection and configuration
- **WidgetSettingsDialog**: Widget editing and management

### Development Workflow

#### Adding New Widgets
1. Define widget type in `WidgetType` union
2. Add constraints to `WIDGET_CONSTRAINTS`
3. Create widget component
4. Add to `WIDGET_TYPES` in AddWidgetDialog
5. Implement configuration form

#### Widget Development Guidelines
- Use TypeScript for type safety
- Follow existing widget patterns
- Implement responsive design
- Add proper error handling
- Include loading states

### State Management
- **useDashboard Hook**: Manages widget state and synchronization
- **useAuth Hook**: Authentication state
- **useConfirmation Hook**: Confirmation dialogs

### Error Handling
- Loading states for all async operations
- Error boundaries for widget failures
- User-friendly error messages
- Retry mechanisms

### Performance Considerations
- Lazy loading for widgets
- Debounced auto-save
- Optimized re-renders
- Memory management for large dashboards

## Supabase Integration for Development Dashboard

### Authentication
- **useAuth Hook**: Manages user authentication state
- **Protected Routes**: Dashboard requires authentication
- **Login Flow**: Redirects to auth if not authenticated
- **Session Management**: Automatic session handling

### Database Operations
- **Dashboard Service**: `src/lib/supabase/dashboard.ts`
  - `getDashboard()`: Fetch dashboard data
  - `updateDashboard()`: Save dashboard changes
  - `createDashboard()`: Create new dashboard
  - `deleteDashboard()`: Remove dashboard

### Real-time Features
- **Auto-save**: Widget changes automatically saved to Supabase
- **Visual Feedback**: Cloud icons show save status
- **Error Handling**: Database errors displayed to user
- **Offline Support**: Changes cached when offline

### Data Structure
```typescript
// Dashboard table structure
interface Dashboard {
  id: string;
  name: string;
  user_id: string;
  widgets: WidgetConfig[];
  created_at: string;
  updated_at: string;
  is_public: boolean;
}
```

### Widget Persistence
- **Widget State**: Stored as JSON in Supabase
- **Layout Data**: Grid positions saved automatically
- **Widget Properties**: Configuration persisted per widget
- **Version Control**: Timestamps for change tracking

### Development Setup
1. **Environment Variables**: Configure Supabase URL and keys
2. **Database Schema**: Ensure dashboard and widgets tables exist
3. **Authentication**: Set up Supabase Auth providers
4. **Real-time**: Enable real-time subscriptions if needed