# Development Plan: IoT Dashboard Enhancement

## 🎯 FOCUSED TASKS ONLY

### 1. Supabase Integration for Data Persistence
**Goal**: Save all dashboard info to Supabase for website loading

**Tasks**:
- [ ] **Dashboard Data Structure**: Define complete dashboard schema in Supabase
  - Dashboard metadata (name, description, settings)
  - Widget configurations (type, position, properties)
  - User permissions and sharing settings
  - Version control and timestamps

- [ ] **CRUD Operations**: Implement complete dashboard operations
  - `createDashboard()`: New dashboard creation
  - `getDashboard()`: Load dashboard with all widgets
  - `updateDashboard()`: Save dashboard changes
  - `deleteDashboard()`: Remove dashboard
  - `listDashboards()`: User's dashboard list

- [ ] **Widget Persistence**: Save widget state to Supabase
  - Widget configuration as JSON
  - Grid layout positions
  - Widget-specific properties
  - Real-time sync status

### 2. Firebase Realtime Database Integration
**Goal**: Connect Firebase for real-time widget data updates

**Tasks**:
- [ ] **Firebase Setup**: Configure Firebase Realtime Database
  - Environment configuration
  - Database rules setup
  - Connection management

- [ ] **Real-time Data Flow**: Implement real-time data updates
  - Widget data subscriptions
  - Real-time value updates
  - Connection status handling
  - Error recovery mechanisms

- [ ] **Widget Data Mapping**: Connect widgets to Firebase data
  - Switch widget: Device on/off states
  - Sensor widgets: Real-time sensor values
  - Status widgets: Device connection states
  - Chart widgets: Time-series data

### 3. Main Dashboard Code Refactoring
**Goal**: Simplify and improve main dashboard for easier widget development

**Tasks**:
- [ ] **Component Structure**: Refactor `MainDashboard.tsx`
  - Separate widget rendering logic
  - Cleaner grid management
  - Better state management
  - Improved error handling

- [ ] **Widget System**: Enhance widget development framework
  - Standardized widget interface
  - Common widget utilities
  - Widget lifecycle management
  - Better type safety

- [ ] **State Management**: Improve dashboard state handling
  - Centralized widget state
  - Better data flow
  - Optimized re-renders
  - Memory management

### 4. Widget Settings Refactoring
**Goal**: Create easy-to-develop widget settings system

**Tasks**:
- [ ] **Settings Framework**: Build flexible widget settings
  - Generic settings form generator
  - Widget-specific configuration
  - Validation system
  - Default value handling

- [ ] **WidgetSettingsDialog**: Refactor for easier development
  - Dynamic form generation
  - Better UX for settings
  - Real-time preview
  - Settings validation

- [ ] **Widget Configuration**: Standardize widget config
  - Common settings interface
  - Type-safe configuration
  - Default configurations
  - Settings documentation

## 📁 Key Files to Work On

### Supabase Integration
- `src/lib/supabase/dashboard.ts` - Dashboard CRUD operations
- `src/types/supabase.ts` - Database type definitions
- `src/hooks/useDashboard.ts` - Dashboard state management

### Firebase Integration
- `src/lib/firebase/` - Firebase configuration and services
- `src/hooks/useFirebase.ts` - Firebase data hooks
- `src/services/realtime.ts` - Real-time data management

### Dashboard Refactoring
- `src/pages/dashboard/dev/components/MainDashboard.tsx` - Main dashboard component
- `src/pages/dashboard/dev/components/widgets/` - Widget system
- `src/hooks/useWidgets.ts` - Widget state management

### Settings Refactoring
- `src/pages/dashboard/dev/components/WidgetSettingsDialog.tsx` - Settings dialog
- `src/components/widgets/settings/` - Widget settings components
- `src/types/widgets.ts` - Widget configuration types

## 🔧 Development Approach

### Phase 1: Supabase Foundation
1. Define database schema
2. Implement CRUD operations
3. Test data persistence
4. Integrate with existing dashboard

### Phase 2: Firebase Real-time
1. Setup Firebase configuration
2. Implement real-time subscriptions
3. Connect widgets to Firebase data
4. Test real-time updates

### Phase 3: Dashboard Refactoring
1. Refactor MainDashboard component
2. Improve widget system
3. Enhance state management
4. Optimize performance

### Phase 4: Settings Enhancement
1. Create settings framework
2. Refactor WidgetSettingsDialog
3. Standardize widget configuration
4. Improve developer experience

## 🎯 Success Criteria
- [ ] Dashboard data persists in Supabase
- [ ] Widgets receive real-time data from Firebase
- [ ] Main dashboard code is clean and maintainable
- [ ] Widget settings are easy to develop and configure
- [ ] All changes maintain backward compatibility