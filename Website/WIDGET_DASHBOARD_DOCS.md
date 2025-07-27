# Widget Dashboard Development Manual

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Widget Types](#widget-types)
4. [Rules & Constraints](#rules--constraints)
5. [Development Guidelines](#development-guidelines)
6. [API Reference](#api-reference)
7. [Usage Examples](#usage-examples)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Widget Dashboard is a drag-and-drop, responsive grid-based dashboard system similar to Blynk. It allows users to create custom dashboards with various widget types, each with configurable properties and size constraints.

### Key Components
- **Grid System**: 12-column responsive grid with configurable row height
- **Widget Library**: Pre-built components (Button, Label, Switch, Device Table)
- **Edit/View Modes**: Toggle between configuration and interaction modes
- **Responsive Design**: Desktop-optimized with mobile fallback

---

## ✨ Features

### Core Features
- ✅ **Drag & Drop**: Move widgets freely within grid constraints
- ✅ **Resize**: Adjust widget dimensions with size limits
- ✅ **Grid Visualization**: Column/row coordinates in edit mode
- ✅ **Collision Detection**: Widgets push each other, never overlap
- ✅ **Auto-positioning**: Smart placement for new widgets
- ✅ **Responsive**: Adapts to screen size changes

### Widget Management
- ✅ **Add Widgets**: Step-by-step configuration process
- ✅ **Edit Properties**: Modify widget settings after creation
- ✅ **Duplicate**: Copy widgets with smart positioning
- ✅ **Delete**: Remove widgets with confirmation
- ✅ **Hover Actions**: Settings, duplicate, delete on hover

### User Experience
- ✅ **Clean Interface**: No mock data, empty states
- ✅ **Desktop Notice**: Edit features limited to desktop
- ✅ **Visual Feedback**: Grid lines, hover states, animations
- ✅ **Form Validation**: Required fields, type checking

---

## 🧩 Widget Types

### 1. Button Widget
Interactive button for triggering actions.

**Properties:**
- `title` (required): Button text
- `variant`: Style variant (`default` | `outline` | `secondary` | `destructive`)
- `size`: Button size (`sm` | `default` | `lg`)

**Size Constraints:**
- Minimum: 2×1 (width × height)
- Maximum: 4×2

**Use Cases:**
- Action triggers
- Form submissions
- Navigation
- API calls

### 2. Label Widget
Display text values with optional units.

**Properties:**
- `title` (required): Label title
- `value`: Displayed value (string or number)
- `unit`: Unit of measurement (e.g., °C, %, V)
- `color`: Badge color (`default` | `secondary` | `destructive` | `outline`)

**Size Constraints:**
- Minimum: 2×2
- Maximum: 4×3

**Use Cases:**
- Sensor readings
- Status displays
- Metrics visualization
- Real-time data

### 3. Switch Widget
Toggle control for on/off states.

**Properties:**
- `title` (required): Switch label
- `checked`: Current state (boolean)

**Size Constraints:**
- Minimum: 2×2
- Maximum: 3×3

**Use Cases:**
- Device control
- Feature toggles
- Settings
- Binary states

### 4. Device Table Widget
Paginated list of connected devices.

**Properties:**
- `title` (required): Table title
- `devices`: Array of device objects

**Device Object:**
```typescript
{
  id: string;
  name: string;
  status: "online" | "offline" | "warning";
}
```

**Size Constraints:**
- Minimum: 4×4
- Maximum: 8×8

**Use Cases:**
- Device monitoring
- Connection status
- Device management
- System overview

---

## 📏 Rules & Constraints

### Grid System Rules
1. **12-Column Grid**: Fixed column count, responsive width
2. **Row Height**: 60px base height + 10px margin
3. **Margins**: 10px horizontal and vertical spacing
4. **No Overlap**: Widgets cannot occupy same grid cells
5. **Collision Handling**: Widgets push each other when moved/resized

### Widget Constraints
1. **Minimum Sizes**: Each widget type has minimum dimensions
2. **Maximum Sizes**: Upper limits prevent oversized widgets
3. **Aspect Ratios**: Some widgets maintain specific proportions
4. **Content Fitting**: Minimum sizes ensure content visibility

### Platform Restrictions
1. **Desktop Only**: Edit mode requires screen width > 768px
2. **Touch Support**: View mode works on all devices
3. **Responsive Breakpoints**: Grid adapts to container width
4. **Performance**: Maximum 50 widgets per dashboard recommended

### Data Validation
1. **Required Fields**: Title mandatory for all widgets
2. **Type Safety**: TypeScript enforces property types
3. **Input Sanitization**: Form inputs validated and cleaned
4. **Error Handling**: Graceful fallbacks for invalid data

---

## 🛠 Development Guidelines

### File Structure
```
src/pages/dashboard/dev/
├── DevPage.tsx                 # Main dashboard page
├── components/
│   ├── DashboardGrid.tsx       # Grid layout manager
│   ├── AddWidgetDialog.tsx     # Widget creation dialog
│   ├── WidgetSettingsDialog.tsx # Widget editing dialog
│   └── widgets/
│       ├── index.tsx           # Widget exports & types
│       ├── ButtonWidget.tsx    # Button component
│       ├── LabelWidget.tsx     # Label component
│       ├── SwitchWidget.tsx    # Switch component
│       └── DeviceTableWidget.tsx # Device table component
```

### Creating New Widget Types

1. **Define Widget Interface:**
```typescript
interface MyWidgetProps {
  id: string;
  title?: string;
  customProp?: string;
  editMode?: boolean;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}
```

2. **Implement Widget Component:**
```typescript
export function MyWidget({ 
  id, 
  title = "My Widget", 
  editMode = false,
  onSettings,
  onDuplicate,
  onDelete,
  ...props 
}: MyWidgetProps) {
  return (
    <Card className="p-3 h-full flex flex-col relative group">
      {editMode && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
          {/* Action buttons */}
        </div>
      )}
      {/* Widget content */}
    </Card>
  );
}
```

3. **Add to Widget Registry:**
```typescript
// In widgets/index.tsx
export { MyWidget } from "./MyWidget";

export type WidgetType = "button" | "label" | "switch" | "device-table" | "my-widget";

export const WIDGET_CONSTRAINTS = {
  // ... existing constraints
  "my-widget": { minW: 2, maxW: 6, minH: 2, maxH: 4 },
};
```

4. **Update Grid Renderer:**
```typescript
// In DashboardGrid.tsx
case "my-widget":
  return <MyWidget {...commonProps} />;
```

5. **Add Configuration Form:**
```typescript
// In AddWidgetDialog.tsx and WidgetSettingsDialog.tsx
{selectedType === "my-widget" && (
  <div className="space-y-2">
    <label className="text-sm font-medium">Custom Property</label>
    <input
      type="text"
      value={formData.customProp || ""}
      onChange={(e) => setFormData(prev => ({ ...prev, customProp: e.target.value }))}
      className="w-full p-2 border rounded-md"
    />
  </div>
)}
```

### Styling Guidelines

1. **Consistent Padding**: Use `p-3` for widget containers
2. **Hover States**: Implement smooth transitions for interactions
3. **Z-Index Layers**: 
   - Grid overlay: `z-0`
   - Widgets: `z-10`
   - Action buttons: `z-10`
   - Dialogs: `z-50`
4. **Color Scheme**: Follow existing design tokens
5. **Responsive Text**: Use responsive text sizing (`text-xl lg:text-2xl`)

### State Management

1. **Widget State**: Stored in parent component
2. **Local State**: Use `useState` for component-specific state
3. **Callbacks**: Pass handlers down through props
4. **Persistence**: Implement localStorage/database integration as needed

---

## 📚 API Reference

### Core Types

```typescript
interface WidgetConfig {
  i: string;                    // Unique identifier
  type: WidgetType;            // Widget type
  x: number;                   // Grid column position
  y: number;                   // Grid row position
  w: number;                   // Width in grid units
  h: number;                   // Height in grid units
  minW?: number;               // Minimum width
  maxW?: number;               // Maximum width
  minH?: number;               // Minimum height
  maxH?: number;               // Maximum height
  static?: boolean;            // Prevent drag/resize
  props?: Record<string, any>; // Widget-specific properties
}

type WidgetType = "button" | "label" | "switch" | "device-table";

interface WidgetConstraints {
  minW: number;
  maxW: number;
  minH: number;
  maxH: number;
}
```

### Component Props

#### DashboardGrid
```typescript
interface DashboardGridProps {
  editMode: boolean;
  widgets: WidgetConfig[];
  onLayoutChange: (widgets: WidgetConfig[]) => void;
  onWidgetSettings?: (widgetId: string) => void;
  onWidgetDuplicate?: (widget: WidgetConfig) => void;
  onWidgetDelete?: (widgetId: string) => void;
  width?: number;
  cols?: number;
  rowHeight?: number;
  margin?: [number, number];
}
```

#### AddWidgetDialog
```typescript
interface AddWidgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: WidgetType, props: Record<string, any>) => void;
}
```

#### WidgetSettingsDialog
```typescript
interface WidgetSettingsDialogProps {
  isOpen: boolean;
  widget: WidgetConfig | null;
  onClose: () => void;
  onSave: (widget: WidgetConfig) => void;
  onDelete?: (widgetId: string) => void;
  onDuplicate?: (widget: WidgetConfig) => void;
}
```

### Utility Functions

```typescript
// Find empty space for new widget
function findEmptySpace(
  widgets: WidgetConfig[], 
  newWidget: { w: number; h: number }
): { x: number; y: number }

// Check collision between widgets
function checkCollision(
  widget1: WidgetConfig, 
  widget2: WidgetConfig
): boolean

// Apply widget constraints
function applyConstraints(
  widget: WidgetConfig, 
  constraints: WidgetConstraints
): WidgetConfig
```

---

## 💡 Usage Examples

### Basic Setup

```typescript
import { useState } from 'react';
import { DashboardGrid } from './components/DashboardGrid';
import { WidgetConfig } from './components/widgets';

function MyDashboard() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [editMode, setEditMode] = useState(false);

  const handleLayoutChange = (updatedWidgets: WidgetConfig[]) => {
    setWidgets(updatedWidgets);
  };

  return (
    <DashboardGrid
      editMode={editMode}
      widgets={widgets}
      onLayoutChange={handleLayoutChange}
    />
  );
}
```

### Creating Widgets Programmatically

```typescript
const createButtonWidget = (): WidgetConfig => ({
  i: `button-${Date.now()}`,
  type: "button",
  x: 0,
  y: 0,
  w: 2,
  h: 1,
  props: {
    title: "Click Me",
    variant: "default"
  }
});

const createLabelWidget = (): WidgetConfig => ({
  i: `label-${Date.now()}`,
  type: "label",
  x: 2,
  y: 0,
  w: 2,
  h: 2,
  props: {
    title: "Temperature",
    value: "25.4",
    unit: "°C"
  }
});
```

### Handling Widget Events

```typescript
const handleWidgetClick = (widgetId: string) => {
  console.log(`Widget ${widgetId} clicked`);
  // Implement custom logic
};

const handleSwitchChange = (widgetId: string, checked: boolean) => {
  console.log(`Switch ${widgetId} changed to ${checked}`);
  // Update external state/API
};
```

### Persistence

```typescript
// Save to localStorage
const saveDashboard = (widgets: WidgetConfig[]) => {
  localStorage.setItem('dashboard', JSON.stringify(widgets));
};

// Load from localStorage
const loadDashboard = (): WidgetConfig[] => {
  const saved = localStorage.getItem('dashboard');
  return saved ? JSON.parse(saved) : [];
};

// Save to API
const saveDashboardToAPI = async (widgets: WidgetConfig[]) => {
  await fetch('/api/dashboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ widgets })
  });
};
```

---

## 🎯 Best Practices

### Performance
1. **Memoization**: Use `React.useMemo` for expensive calculations
2. **Callback Optimization**: Wrap event handlers in `useCallback`
3. **Widget Limits**: Recommend maximum 50 widgets per dashboard
4. **Lazy Loading**: Consider code splitting for large widget libraries

### User Experience
1. **Progressive Disclosure**: Start with empty dashboard
2. **Clear Feedback**: Show loading states and confirmations
3. **Error Boundaries**: Implement error handling for widget failures
4. **Accessibility**: Ensure keyboard navigation and screen reader support

### Code Organization
1. **Separation of Concerns**: Keep widget logic separate from grid logic
2. **Type Safety**: Use TypeScript throughout
3. **Consistent Naming**: Follow established conventions
4. **Documentation**: Comment complex logic and edge cases

### Testing
1. **Unit Tests**: Test individual widget components
2. **Integration Tests**: Test grid interactions
3. **Visual Tests**: Snapshot testing for UI consistency
4. **E2E Tests**: Test complete user workflows

### Security
1. **Input Validation**: Sanitize all user inputs
2. **XSS Prevention**: Escape dynamic content
3. **Rate Limiting**: Limit API calls and state updates
4. **Data Validation**: Validate widget configurations

---

## 🔧 Troubleshooting

### Common Issues

#### Widgets Not Rendering
**Problem**: Widgets appear as empty boxes
**Solution**: 
- Check widget type registration in `DashboardGrid.tsx`
- Verify widget props are passed correctly
- Ensure widget component exports are correct

#### Grid Collision Issues
**Problem**: Widgets overlap or don't push correctly
**Solution**:
- Verify `preventCollision: false` in GridLayout props
- Check widget dimensions are within constraints
- Ensure layout updates are properly handled

#### Mobile Edit Mode Not Working
**Problem**: Edit features don't work on mobile
**Solution**:
- This is expected behavior - edit mode is desktop-only
- Ensure `isDesktop` detection is working
- Check responsive breakpoints

#### Widget Settings Not Saving
**Problem**: Widget configuration changes don't persist
**Solution**:
- Verify `onSave` callback is implemented
- Check widget ID matching
- Ensure state updates are immutable

### Debug Tools

```typescript
// Enable grid debugging
const DEBUG_GRID = process.env.NODE_ENV === 'development';

// Log widget positions
const logWidgetPositions = (widgets: WidgetConfig[]) => {
  if (DEBUG_GRID) {
    console.table(widgets.map(w => ({
      id: w.i,
      type: w.type,
      position: `${w.x},${w.y}`,
      size: `${w.w}×${w.h}`
    })));
  }
};

// Validate widget constraints
const validateWidget = (widget: WidgetConfig) => {
  const constraints = WIDGET_CONSTRAINTS[widget.type];
  const errors = [];
  
  if (widget.w < constraints.minW) errors.push(`Width too small: ${widget.w} < ${constraints.minW}`);
  if (widget.w > constraints.maxW) errors.push(`Width too large: ${widget.w} > ${constraints.maxW}`);
  if (widget.h < constraints.minH) errors.push(`Height too small: ${widget.h} < ${constraints.minH}`);
  if (widget.h > constraints.maxH) errors.push(`Height too large: ${widget.h} > ${constraints.maxH}`);
  
  if (errors.length > 0) {
    console.warn(`Widget ${widget.i} validation errors:`, errors);
  }
  
  return errors.length === 0;
};
```

### Performance Monitoring

```typescript
// Monitor render performance
const useRenderTime = (name: string) => {
  const startTime = useRef(Date.now());
  
  useEffect(() => {
    const endTime = Date.now();
    const duration = endTime - startTime.current;
    
    if (duration > 100) {
      console.warn(`Slow render detected: ${name} took ${duration}ms`);
    }
  });
};

// Monitor widget count
const useWidgetLimit = (widgets: WidgetConfig[]) => {
  useEffect(() => {
    if (widgets.length > 50) {
      console.warn(`High widget count: ${widgets.length} widgets may impact performance`);
    }
  }, [widgets.length]);
};
```

---

## 📝 Changelog

### Version 1.0.0
- Initial release with core widget types
- Drag & drop functionality
- Grid visualization
- Edit/view modes
- Desktop-only editing restriction
- Widget configuration dialogs

### Future Enhancements
- [ ] Widget marketplace/plugins
- [ ] Custom widget themes
- [ ] Real-time data connections
- [ ] Dashboard templates
- [ ] Advanced animations
- [ ] Mobile edit support
- [ ] Collaboration features
- [ ] Advanced grid layouts

---

## 📞 Support

For technical support or feature requests:

1. **Documentation**: Check this manual first
2. **Issues**: Create GitHub issues for bugs
3. **Features**: Submit feature requests with use cases
4. **Community**: Join developer discussions

---

**© 2024 IoT Kit Dashboard - Widget Development Manual** 