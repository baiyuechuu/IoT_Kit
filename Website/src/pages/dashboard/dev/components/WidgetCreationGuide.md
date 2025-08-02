# Widget Creation Guide - Detailed Process

This guide provides a comprehensive walkthrough for creating new widgets in the IoT Kit dashboard development environment.

## Overview

A widget consists of several interconnected components:
1. **Widget Component** - The main React component that renders the widget
2. **Settings Schema** - Configuration options for the widget
3. **Registry Entry** - Registration in the widget system
4. **Type Definitions** - TypeScript types for the widget
5. **Integration Points** - Where the widget connects to the dashboard

## Step-by-Step Process

### Step 1: Define Widget Type

First, add your widget type to the type definitions:

**File: `Website/src/pages/dashboard/dev/components/widgets/core/types.tsx`**

```typescript
// Add your widget type
export type WidgetType = "temperature" | "humidity" | "your-widget-type";

// Add display name mapping
export function getWidgetDisplayName(type: WidgetType): string {
  const names: Record<WidgetType, string> = {
    temperature: 'Temperature',
    humidity: 'Humidity',
    'your-widget-type': 'Your Widget Name',
  };
  return names[type] || type;
}
```

### Step 2: Create Widget Component

**File: `Website/src/pages/dashboard/dev/components/widgets/widget/YourWidget.tsx`**

```typescript
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Control from "../control/Control";
import { useFirebaseVariable } from "@/hooks/useFirebase";
import type { WidgetProps } from "../core/types";
import { YourIcon } from "react-icons/your-icon-library";

export function YourWidget({
  config,
  editMode,
  onSettings,
  onDuplicate,
  onDelete,
  className = "",
}: WidgetProps) {
  const { firebasePath, props: widgetProps } = config;

  // State management
  const [displayValue, setDisplayValue] = useState(widgetProps?.defaultValue || 0);

  // Firebase integration
  const {
    value: firebaseValue,
    loading: firebaseLoading,
    error: firebaseError,
  } = useFirebaseVariable({
    variablePath: firebasePath,
    variableType: "number", // or "string", "boolean", "object"
    autoConnect: !editMode && !!firebasePath,
  });

  // Auto-connect when configured and not in edit mode
  useEffect(() => {
    // Firebase connection is handled automatically by useFirebaseVariable
  }, [editMode, firebasePath]);

  // Data processing
  const processedValue = React.useMemo(() => {
    if (firebaseValue === null || firebaseValue === undefined) {
      return null;
    }
    const converted = Number(firebaseValue);
    return isNaN(converted) ? null : converted;
  }, [firebaseValue]);

  // Widget-specific logic
  const formatValue = (value: number | null) => {
    if (value === null) return "--";
    const precision = widgetProps?.precision || 1;
    return value.toFixed(precision);
  };

  const getBackgroundStyle = (value: number | null) => {
    if (value === null) return "bg-gradient-to-br from-gray-50 to-gray-100";
    
    // Your custom styling logic
    if (value < 30) return "bg-gradient-to-r from-red-300 to-red-400";
    if (value < 70) return "bg-gradient-to-r from-yellow-300 to-orange-300";
    return "bg-gradient-to-r from-green-300 to-green-400";
  };

  const formattedValue = formatValue(processedValue);
  const backgroundStyle = getBackgroundStyle(processedValue);

  return (
    <Card
      className={`p-3 h-full flex flex-col relative group ${backgroundStyle} ${className}`}
    >
      {editMode && (
        <Control 
          onSettings={onSettings} 
          onDuplicate={onDuplicate} 
          onDelete={onDelete} 
        />
      )}

      <div className="flex flex-col items-center justify-center h-full space-y-2">
        {/* Title */}
        {config.title && (
          <h3 className="text-sm font-medium text-gray-700 text-center absolute top-2 left-4">
            {config.title}
          </h3>
        )}

        {/* Icon */}
        <div className="flex items-center justify-center absolute bottom-2 right-1">
          <YourIcon className="w-10 h-10 text-black" />
        </div>

        {/* Main Display */}
        <div className="flex items-end space-x-2 absolute bottom-1 left-4">
          <span className="text-6xl font-bold text-black">
            {formattedValue}
          </span>
          <span className="text-3xl font-medium mb-1 text-gray-600">
            {widgetProps?.unit || "unit"}
          </span>
        </div>

        {/* Interactive Elements */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {/* Your interaction logic */}}
          className="absolute top-2 right-2 text-xs px-2 py-1 h-6 bg-white/10 backdrop-blur-sm text-gray-700 border-gray-100/30"
        >
          Action
        </Button>

        {/* Status Indicators */}
        {!firebasePath && (
          <div className="text-xs text-gray-500 text-center">
            No Firebase path configured
          </div>
        )}

        {firebaseError && (
          <div className="text-xs text-red-500 text-center">
            Connection error: {firebaseError}
          </div>
        )}

        {firebaseLoading && (
          <div className="text-xs text-yellow-600 text-center">
            Connecting...
          </div>
        )}
      </div>
    </Card>
  );
}

export default YourWidget;
```

### Step 3: Create Settings Schema

**File: `Website/src/pages/dashboard/dev/components/widgets/settings/YourWidgetSettings.tsx`**

```typescript
import type { WidgetSettingsSchema } from './WidgetSettingsFramework';

export const yourWidgetSettingsSchema: WidgetSettingsSchema = {
  sections: [
    // General Settings
    {
      key: 'title',
      type: 'text',
      label: 'Widget Title',
      description: 'Display name for the widget',
      defaultValue: 'Your Widget',
      maxLength: 50,
    },

    // Firebase Configuration Section
    {
      type: 'section',
      fields: [
        {
          key: 'firebasePath',
          type: 'text',
          label: 'Firebase Path',
          description: 'Path to data in Firebase (e.g., /sensors/your-data)',
          defaultValue: '/sensors/your-data',
          required: true,
          placeholder: '/sensors/your-data',
        },
      ],
    },

    // Widget-specific Settings Section
    {
      type: 'section',
      fields: [
        {
          key: 'props.unit',
          type: 'select',
          label: 'Display Unit',
          description: 'Unit of measurement to display',
          defaultValue: 'default',
          options: [
            { value: 'default', label: 'Default Unit' },
            { value: 'custom', label: 'Custom Unit' },
          ],
        },
        {
          key: 'props.precision',
          type: 'number',
          label: 'Decimal Precision',
          description: 'Number of decimal places to display',
          defaultValue: 1,
          min: 0,
          max: 3,
          step: 1,
        },
        {
          key: 'props.threshold',
          type: 'number',
          label: 'Threshold Value',
          description: 'Threshold for color changes',
          defaultValue: 50,
          min: 0,
          max: 100,
          step: 1,
        },
        {
          key: 'props.enableAlerts',
          type: 'boolean',
          label: 'Enable Alerts',
          description: 'Show alerts when values exceed threshold',
          defaultValue: false,
        },
      ],
    },
  ],
};

export default yourWidgetSettingsSchema;
```

### Step 4: Register Widget

**File: `Website/src/pages/dashboard/dev/components/widgets/core/registry.tsx`**

```typescript
import { YourWidget } from '../widget/YourWidget';

// Add to WIDGET_REGISTRY
const WIDGET_REGISTRY: Partial<Record<WidgetType, SimpleWidgetDefinition>> = {
  // ... existing widgets ...
  
  'your-widget-type': {
    type: 'your-widget-type',
    name: 'Your Widget',
    description: 'Display your custom data with interactive features',
    component: YourWidget,
    defaultProps: {
      unit: 'default',
      precision: 1,
      threshold: 50,
      enableAlerts: false,
    },
    defaultConstraints: {
      minW: 3,
      maxW: 4,
      minH: 2,
      maxH: 2,
    }
  }
};
```

### Step 5: Add to Widget Index

**File: `Website/src/pages/dashboard/dev/components/widgets/index.tsx`**

```typescript
// Add export for your widget
export { YourWidget } from "./widget/YourWidget";
```

### Step 6: Add Settings to Settings Index

**File: `Website/src/pages/dashboard/dev/components/widgets/settings/index.tsx`**

```typescript
import { yourWidgetSettingsSchema } from "./YourWidgetSettings";

// Add to settings mapping
const settingsSchemas = {
  // ... existing schemas ...
  'your-widget-type': () => yourWidgetSettingsSchema,
};

// Add export
export * from "./YourWidgetSettings";
```

### Step 7: Add to Dashboard Integration

**File: `Website/src/pages/dashboard/dev/components/MainDashboard.tsx`**

```typescript
// Add case for your widget
case "your-widget-type":
  return <YourWidget {...commonProps} config={widget as any} />;
```

### Step 8: Add to Widget Dialog

**File: `Website/src/pages/dashboard/dev/components/AddWidgetDialog.tsx`**

```typescript
// Add to available widgets
{
  type: "your-widget-type" as WidgetType,
  name: "Your Widget",
  description: "Display your custom data with interactive features",
}
```

## Advanced Features

### Using BaseWidget for Common Functionality

If your widget follows common patterns, you can extend the BaseWidget:

```typescript
import { BaseWidget, useWidgetFirebase } from "../core/BaseWidget";

export function YourWidget(props: WidgetProps) {
  const { config, editMode } = props;
  const { firebasePath } = config;
  
  const {
    firebaseValue,
    connectionStatus,
    firebaseError,
    isFirebaseConfigured,
  } = useWidgetFirebase({
    firebasePath,
    dataType: 'number',
    editMode,
  });

  return (
    <BaseWidget
      editMode={editMode}
      onSettings={props.onSettings}
      onDuplicate={props.onDuplicate}
      onDelete={props.onDelete}
      firebasePath={firebasePath}
      connectionStatus={connectionStatus}
      firebaseError={firebaseError}
      className="your-custom-classes"
    >
      {/* Your widget content */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-4xl font-bold">
          {firebaseValue || '--'}
        </span>
      </div>
    </BaseWidget>
  );
}
```

### Custom Validation

Add custom validation to your settings schema:

```typescript
// In your settings file
export function validateYourWidgetSettings(values: Record<string, any>): string[] {
  const errors: string[] = [];
  
  // Custom validation logic
  if (values['props.threshold'] && values['props.threshold'] < 0) {
    errors.push('Threshold must be positive');
  }
  
  if (values['firebasePath'] && !values['firebasePath'].startsWith('/')) {
    errors.push('Firebase path must start with /');
  }
  
  return errors;
}
```

### Custom Styling

For advanced styling, you can use CSS-in-JS or custom classes:

```typescript
// Dynamic styling based on data
const getDynamicStyles = (value: number | null) => {
  if (value === null) return {};
  
  return {
    backgroundColor: value > 80 ? '#ef4444' : value > 60 ? '#f59e0b' : '#10b981',
    color: value > 80 ? 'white' : 'black',
  };
};

// Apply in your component
<div style={getDynamicStyles(processedValue)}>
  {/* content */}
</div>
```

## Best Practices

1. **Type Safety**: Always use TypeScript interfaces for your widget props
2. **Error Handling**: Implement proper error states for Firebase connections
3. **Loading States**: Show loading indicators during data fetching
4. **Responsive Design**: Ensure widgets work on different screen sizes
5. **Accessibility**: Include proper ARIA labels and keyboard navigation
6. **Performance**: Use React.memo for expensive calculations
7. **Testing**: Write unit tests for your widget logic

## Testing Your Widget

1. **Development Testing**: Use the dev dashboard to test your widget
2. **Firebase Testing**: Test with real Firebase data
3. **Settings Testing**: Verify all settings work correctly
4. **Responsive Testing**: Test on different screen sizes
5. **Error Testing**: Test with invalid Firebase paths

## Common Patterns

### Data Display Widgets
- Use `useFirebaseVariable` for data fetching
- Implement proper loading and error states
- Add unit conversion if needed
- Use color coding for different value ranges

### Control Widgets
- Use `useFirebaseVariable` with write capabilities
- Implement proper feedback for user actions
- Add confirmation for destructive actions
- Show current state clearly

### Chart Widgets
- Consider using charting libraries like Chart.js or Recharts
- Implement proper data formatting
- Add zoom and pan capabilities if needed
- Handle real-time updates efficiently

This guide provides a comprehensive foundation for creating any type of widget in the IoT Kit dashboard system. 