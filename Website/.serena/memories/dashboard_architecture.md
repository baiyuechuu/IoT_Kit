# Dashboard Architecture

## Dashboard Structure

### Production Dashboard (`src/pages/dashboard/Dashboard.tsx`)
- **Conditional Rendering**: Shows DevPage in development mode, production dashboard otherwise
- **Tab-based Interface**: Waitlist and Manifest tabs
- **Responsive Design**: Mobile and desktop optimized

### Development Dashboard (`src/pages/dashboard/dev/DevPage.tsx`)
- **Widget Management**: Add, edit, delete, duplicate widgets
- **Edit Mode**: Toggle between view and edit modes
- **Real-time Saving**: Auto-save with visual feedback (cloud icons)
- **Error Handling**: Comprehensive error states and loading states
- **Authentication**: Requires user authentication

### Widget System
- **Widget Types**: Currently supports Switch widget, extensible for more
- **Constraints**: Minimum/maximum size constraints for each widget type
- **Grid Layout**: 12-column responsive grid system
- **Positioning**: Automatic collision detection for widget placement

## Key Components

### MainDashboard (`src/pages/dashboard/dev/components/MainDashboard.tsx`)
- **Grid Layout**: Uses react-grid-layout for drag-and-drop functionality
- **Widget Rendering**: Renders widgets based on their type and configuration
- **Edit Mode**: Enables drag, resize, and widget management in edit mode

### Widget System (`src/pages/dashboard/dev/components/widgets/`)
- **SwitchWidget**: Toggle control for IoT devices
- **Widget Configuration**: Type-safe widget configuration interface
- **Constraints**: Size constraints for proper widget display

### Dialogs
- **AddWidgetDialog**: Widget selection and configuration
- **WidgetSettingsDialog**: Widget editing and management
- **Confirmation Dialogs**: Safe deletion and clearing operations

## State Management
- **useDashboard Hook**: Manages widget state, saving, and synchronization
- **useAuth Hook**: Authentication state management
- **useConfirmation Hook**: Confirmation dialog management