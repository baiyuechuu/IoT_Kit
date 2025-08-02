# Widget Development Manual

## Overview

This manual provides comprehensive guidance for developing widgets in the IoT Kit dashboard system. Widgets are modular components that display data from Firebase or other sources in various formats.

## Table of Contents

1. [Widget Architecture](#widget-architecture)
2. [Creating a New Widget](#creating-a-new-widget)
3. [Widget Types and Interfaces](#widget-types-and-interfaces)
4. [Firebase Integration](#firebase-integration)
5. [Widget Settings](#widget-settings)
6. [Styling and Theming](#styling-and-theming)
7. [Testing and Debugging](#testing-and-debugging)
8. [Best Practices](#best-practices)
9. [Examples](#examples)

## Widget Architecture

### Core Components

The widget system consists of several key components:

- **BaseWidget**: Common wrapper providing Firebase integration and controls
- **Widget Types**: TypeScript interfaces defining widget structure
- **Registry**: Central registry for widget registration
- **Settings Framework**: Configurable settings system
- **Control Components**: Edit mode controls (settings, duplicate, delete)

### File Structure

```
widgets/
├── core/
│   ├── types.tsx          # Widget type definitions
│   ├── BaseWidget.tsx     # Base widget wrapper
│   └── registry.tsx       # Widget registry
├── control/
│   └── Control.tsx        # Edit mode controls
├── settings/
│   ├── index.tsx          # Settings registry
│   ├── WidgetSettingsFramework.tsx
│   └── TemperatureWidgetSettings.tsx
├── YourWidget.tsx         # Your widget implementation
└── index.tsx              # Widget exports
```

## Creating a New Widget

### Step 1: Define Widget Type

First, add your widget type to the `WidgetType` union in `core/types.tsx`:

```typescript
export type WidgetType = "temperature" | "gauge" | "chart" | "text" | "button" | "your-widget";
```

### Step 2: Create Widget Component

Create your widget component following this structure:

```typescript
import React from 'react';
import { BaseWidget, useWidgetFirebase } from './core/BaseWidget';
import type { WidgetProps } from './core/types';

export function YourWidget({ 
  config, 
  editMode, 
  onSettings,
  onDelete,
  className = ""
}: WidgetProps) {
  const { firebasePath, props: widgetProps } = config;
  
  // Firebase integration
  const {
    firebaseValue,
    connectionStatus,
    firebaseError,
    connectFirebase,
    disconnectFirebase,
    isFirebaseConfigured,
    shouldConnect,
  } = useWidgetFirebase({
    firebasePath,
    dataType: 'number', // or 'string', 'boolean', 'object'
    editMode,
  });

  // Auto-connect when configured and not in edit mode
  React.useEffect(() => {
    if (shouldConnect) {
      connectFirebase();
    }
    return () => {
      if (isFirebaseConfigured) {
        disconnectFirebase();
      }
    };
  }, [shouldConnect, connectFirebase, disconnectFirebase, isFirebaseConfigured]);

  // Process your data
  const processedValue = React.useMemo(() => {
    if (firebaseValue === null || firebaseValue === undefined) {
      return null;
    }
    // Your data processing logic here
    return firebaseValue;
  }, [firebaseValue]);

  return (
    <BaseWidget
      editMode={editMode}
      onSettings={onSettings}
      onDelete={onDelete}
      firebasePath={firebasePath}
      connectionStatus={connectionStatus}
      firebaseError={firebaseError}
      className={className}
    >
      {/* Your widget content here */}
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-sm font-medium text-gray-700">
          {config.title || 'Your Widget'}
        </h3>
        
        <div className="text-2xl font-bold text-blue-600">
          {processedValue !== null ? processedValue : '--'}
        </div>
        
        {!firebasePath && (
          <div className="text-xs text-gray-500">
            No Firebase path configured
          </div>
        )}
      </div>
    </BaseWidget>
  );
}

export default YourWidget;
```

### Step 3: Register Widget

Add your widget to the registry in `core/registry.tsx`:

```typescript
import { YourWidget } from '../YourWidget';

const WIDGET_REGISTRY: Partial<Record<WidgetType, SimpleWidgetDefinition>> = {
  // ... existing widgets
  'your-widget': {
    type: 'your-widget',
    name: 'Your Widget',
    description: 'Description of your widget functionality',
    component: YourWidget,
    defaultProps: {
      // Your default properties
      someProperty: 'defaultValue',
    }
  }
};
```

### Step 4: Create Settings Schema

Create settings for your widget in `settings/YourWidgetSettings.tsx`:

```typescript
import type { WidgetSettingsSchema } from './WidgetSettingsFramework';

export const yourWidgetSettingsSchema: WidgetSettingsSchema = {
  sections: [
    {
      title: 'Display',
      fields: [
        {
          name: 'title',
          label: 'Widget Title',
          type: 'text',
          defaultValue: 'Your Widget',
        },
        {
          name: 'someProperty',
          label: 'Some Property',
          type: 'select',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
          ],
          defaultValue: 'option1',
        },
      ],
    },
    {
      title: 'Data Source',
      fields: [
        {
          name: 'firebasePath',
          label: 'Firebase Path',
          type: 'text',
          placeholder: 'Enter Firebase path (e.g., /sensors/temperature)',
        },
      ],
    },
  ],
};
```

### Step 5: Register Settings

Add your settings to the registry in `settings/index.tsx`:

```typescript
import { yourWidgetSettingsSchema } from './YourWidgetSettings';

export const WIDGET_SETTINGS_REGISTRY: Record<WidgetType, () => WidgetSettingsSchema> = {
  // ... existing settings
  'your-widget': () => yourWidgetSettingsSchema,
};
```

## Widget Types and Interfaces

### WidgetConfig Interface

```typescript
interface WidgetConfig {
  i: string;                    // Unique identifier
  type: WidgetType;             // Widget type
  x: number;                    // Grid X position
  y: number;                    // Grid Y position
  w: number;                    // Grid width
  h: number;                    // Grid height
  title?: string;               // Display title
  firebasePath?: string;        // Firebase data path
  props?: Record<string, any>;  // Widget-specific properties
}
```

### WidgetProps Interface

```typescript
interface WidgetProps {
  config: WidgetConfig;         // Widget configuration
  editMode?: boolean;           // Whether in edit mode
  onSettings?: () => void;      // Settings callback
  onDelete?: () => void;        // Delete callback
  className?: string;           // Additional CSS classes
}
```

## Firebase Integration

### Using the Firebase Hook

The `useWidgetFirebase` hook provides common Firebase functionality:

```typescript
const {
  firebaseValue,        // Current Firebase value
  connectionStatus,     // 'disconnected' | 'connecting' | 'connected' | 'error'
  firebaseError,        // Error message if any
  connectFirebase,      // Function to connect
  disconnectFirebase,   // Function to disconnect
  isFirebaseConfigured, // Whether Firebase path is set
  shouldConnect,        // Whether to auto-connect
} = useWidgetFirebase({
  firebasePath,
  dataType: 'number',   // 'boolean' | 'number' | 'string' | 'object'
  editMode,
});
```

### Data Type Conversion

Use the built-in converters for data type conversion:

```typescript
import { DataTypeConverters } from './core/BaseWidget';

const booleanValue = DataTypeConverters.toBoolean(firebaseValue, 'number');
const numberValue = DataTypeConverters.toNumber(firebaseValue);
const stringValue = DataTypeConverters.toString(firebaseValue);
```

### Firebase Connection Indicator

The `BaseWidget` automatically shows a connection indicator:

- 🟢 Green: Connected
- 🟡 Yellow: Connecting
- 🔴 Red: Error
- ⚪ Gray: Disconnected

## Widget Settings

### Settings Schema Structure

```typescript
interface WidgetSettingsSchema {
  sections: {
    title: string;
    fields: {
      name: string;
      label: string;
      type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea';
      defaultValue?: any;
      placeholder?: string;
      options?: { value: string; label: string }[];
      min?: number;
      max?: number;
      step?: number;
    }[];
  }[];
}
```

### Field Types

- **text**: Text input
- **number**: Number input with optional min/max/step
- **select**: Dropdown with options
- **checkbox**: Boolean toggle
- **textarea**: Multi-line text input

### Accessing Settings in Widget

Settings are passed through the `config.props` object:

```typescript
const { firebasePath, props: widgetProps } = config;

// Access your settings
const title = widgetProps?.title || config.title;
const someProperty = widgetProps?.someProperty || 'defaultValue';
```

## Styling and Theming

### Using Tailwind CSS

Widgets use Tailwind CSS for styling. Common patterns:

```typescript
// Responsive design
<div className="text-sm md:text-base lg:text-lg">

// Conditional styling
<div className={`text-2xl font-bold ${isError ? 'text-red-600' : 'text-blue-600'}`}>

// Gradients and backgrounds
<div className="bg-gradient-to-br from-blue-50 to-blue-100">

// Hover effects
<div className="hover:bg-gray-50 transition-colors">
```

### Dark Mode Support

Use CSS variables for theme-aware colors:

```typescript
<div className="text-gray-700 dark:text-gray-300">
<div className="bg-white dark:bg-gray-800">
```

### Responsive Design

Ensure widgets work on different screen sizes:

```typescript
<div className="text-xs sm:text-sm md:text-base">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
```

## Testing and Debugging

### Development Tips

1. **Use Edit Mode**: Test widgets in edit mode to see controls
2. **Firebase Testing**: Use Firebase emulator for testing
3. **Console Logging**: Add console.log for debugging
4. **Error Boundaries**: Handle errors gracefully

### Common Issues

1. **Firebase Connection**: Check path format and permissions
2. **Data Types**: Ensure proper type conversion
3. **Styling**: Verify Tailwind classes are applied
4. **Performance**: Use React.useMemo for expensive calculations

### Debugging Checklist

- [ ] Widget renders without errors
- [ ] Firebase connection works
- [ ] Settings are applied correctly
- [ ] Responsive design works
- [ ] Dark mode works
- [ ] Edit mode controls function
- [ ] Error states are handled

## Best Practices

### Performance

1. **Memoization**: Use `React.useMemo` for expensive calculations
2. **Event Handlers**: Use `React.useCallback` for event handlers
3. **Dependencies**: Minimize useEffect dependencies
4. **Cleanup**: Properly cleanup Firebase connections

### Code Organization

1. **Separation of Concerns**: Keep logic separate from presentation
2. **Reusable Components**: Extract common patterns
3. **Type Safety**: Use TypeScript interfaces
4. **Documentation**: Add JSDoc comments

### Error Handling

1. **Graceful Degradation**: Handle missing data
2. **User Feedback**: Show loading and error states
3. **Validation**: Validate configuration
4. **Fallbacks**: Provide default values

### Accessibility

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Add accessibility attributes
3. **Keyboard Navigation**: Support keyboard interaction
4. **Color Contrast**: Ensure sufficient contrast

## Examples

### Simple Counter Widget

```typescript
export function CounterWidget({ config, editMode, onSettings, onDelete }: WidgetProps) {
  const { firebasePath } = config;
  const [count, setCount] = React.useState(0);

  const {
    firebaseValue,
    connectionStatus,
    firebaseError,
  } = useWidgetFirebase({
    firebasePath,
    dataType: 'number',
    editMode,
  });

  React.useEffect(() => {
    if (firebaseValue !== null && firebaseValue !== undefined) {
      setCount(Number(firebaseValue));
    }
  }, [firebaseValue]);

  return (
    <BaseWidget
      editMode={editMode}
      onSettings={onSettings}
      onDelete={onDelete}
      firebasePath={firebasePath}
      connectionStatus={connectionStatus}
      firebaseError={firebaseError}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-sm font-medium text-gray-700">
          {config.title || 'Counter'}
        </h3>
        
        <div className="text-4xl font-bold text-blue-600">
          {count}
        </div>
        
        <button
          onClick={() => setCount(count + 1)}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Increment
        </button>
      </div>
    </BaseWidget>
  );
}
```

### Gauge Widget

```typescript
export function GaugeWidget({ config, editMode, onSettings, onDelete }: WidgetProps) {
  const { firebasePath, props: widgetProps } = config;
  
  const {
    firebaseValue,
    connectionStatus,
    firebaseError,
  } = useWidgetFirebase({
    firebasePath,
    dataType: 'number',
    editMode,
  });

  const value = React.useMemo(() => {
    if (firebaseValue === null || firebaseValue === undefined) return 0;
    return Number(firebaseValue);
  }, [firebaseValue]);

  const min = widgetProps?.min || 0;
  const max = widgetProps?.max || 100;
  const percentage = Math.min(Math.max((value - min) / (max - min) * 100, 0), 100);

  return (
    <BaseWidget
      editMode={editMode}
      onSettings={onSettings}
      onDelete={onDelete}
      firebasePath={firebasePath}
      connectionStatus={connectionStatus}
      firebaseError={firebaseError}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-sm font-medium text-gray-700">
          {config.title || 'Gauge'}
        </h3>
        
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 35}`}
              strokeDashoffset={`${2 * Math.PI * 35 * (1 - percentage / 100)}`}
              className="text-blue-600 transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-700">
              {Math.round(value)}
            </span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          {min} - {max}
        </div>
      </div>
    </BaseWidget>
  );
}
```

## Conclusion

This manual provides the foundation for creating widgets in the IoT Kit dashboard system. Follow the patterns and best practices outlined here to create robust, maintainable widgets that integrate seamlessly with the existing system.

For additional support or questions, refer to the existing widget implementations or consult the development team.
