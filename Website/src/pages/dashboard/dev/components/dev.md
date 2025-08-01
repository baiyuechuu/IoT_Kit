# Widget Development Guide

This guide explains how to manually develop widgets for the IoT Kit dashboard system, using the Temperature Widget as an example.

## Overview

Widgets are modular components that display IoT data in the dashboard. Each widget consists of:
- **Component**: React component that renders the widget
- **Configuration**: TypeScript interfaces defining widget properties
- **Settings**: Form schema for widget configuration
- **Registry**: Registration in the widget system

## File Structure

```
components/widgets/
├── BaseWidget.tsx           # Base widget wrapper and utilities
├── TemperatureWidget.tsx    # Temperature widget component
├── types.tsx               # TypeScript interfaces
├── registry.tsx            # Widget registration
├── settings/
│   ├── index.tsx           # Settings registry
│   ├── WidgetSettingsFramework.tsx  # Settings form framework
│   └── TemperatureWidgetSettings.tsx # Temperature widget settings
└── index.tsx               # Main exports
```

## Step 1: Define Widget Types

First, add your widget type to the `WidgetType` union in `types.tsx`:

```typescript
export type WidgetType = "temperature" | "your_widget" | ...;
```

## Step 2: Create Widget Configuration Interface

In `types.tsx`, define your widget's configuration interface:

```typescript
export interface YourWidgetConfig extends BaseWidgetConfig {
  type: 'your_widget';
  props?: {
    // Your widget-specific properties
    unit?: 'celsius' | 'fahrenheit';
    showTrend?: boolean;
    // ... other properties
  };
}
```

## Step 3: Create Widget Component

Create your widget component in `YourWidget.tsx`:

```typescript
import React from 'react';
import { BaseWidget, useWidgetFirebase } from './BaseWidget';
import type { YourWidgetConfig, CommonWidgetProps } from './types';

interface YourWidgetProps extends CommonWidgetProps {
  config: YourWidgetConfig;
}

export function YourWidget({ 
  config, 
  editMode, 
  onSettings, 
  onDuplicate, 
  onDelete,
  onError 
}: YourWidgetProps) {
  // Firebase integration
  const {
    firebaseValue,
    connectionStatus,
    firebaseError,
    connectFirebase,
    disconnectFirebase,
    shouldConnect,
    isFirebaseConfigured,
  } = useWidgetFirebase({
    firebasePath: config.firebaseConfig?.path,
    dataType: config.firebaseConfig?.dataType || 'number',
    editMode,
  });

  // Auto-connect when configured and not in edit mode
  useEffect(() => {
    if (shouldConnect && isFirebaseConfigured) {
      connectFirebase();
    } else if (editMode) {
      disconnectFirebase();
    }
  }, [shouldConnect, isFirebaseConfigured, editMode, connectFirebase, disconnectFirebase]);

  // Handle Firebase errors
  useEffect(() => {
    if (firebaseError && onError) {
      onError(firebaseError);
    }
  }, [firebaseError, onError]);

  // Process your data
  const processedValue = React.useMemo(() => {
    if (firebaseValue === null || firebaseValue === undefined) {
      return null;
    }
    // Convert and process your data here
    return Number(firebaseValue);
  }, [firebaseValue]);

  return (
    <BaseWidget
      editMode={editMode}
      onSettings={onSettings}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      firebasePath={config.firebaseConfig?.path}
      connectionStatus={connectionStatus}
      firebaseError={firebaseError}
      className="your-widget-classes"
    >
      {/* Your widget content */}
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-sm font-medium text-gray-700">
          {config.title}
        </h3>
        
        {/* Your widget display logic */}
        <div className="text-2xl font-bold">
          {processedValue !== null ? processedValue : '--'}
        </div>
        
        {/* Status indicators */}
        {!isFirebaseConfigured && (
          <div className="text-xs text-gray-500">
            No Firebase path configured
          </div>
        )}
      </div>
    </BaseWidget>
  );
}
```

## Step 4: Register Widget in Registry

Add your widget to `registry.tsx`:

```typescript
// Add to WIDGET_CONSTRAINTS_REGISTRY
export const WIDGET_CONSTRAINTS_REGISTRY: Record<WidgetType, WidgetConstraints> = {
  // ... existing widgets
  your_widget: {
    minW: 2,
    maxW: 4,
    minH: 2,
    maxH: 4,
    defaultSize: { w: 2, h: 2 }
  },
};

// Add to WIDGET_METADATA_REGISTRY
export const WIDGET_METADATA_REGISTRY: Record<WidgetType, WidgetMetadata> = {
  // ... existing widgets
  your_widget: {
    name: 'Your Widget',
    description: 'Description of your widget',
    icon: YourIcon,
    category: 'display',
    tags: ['your', 'widget', 'tags'],
    difficulty: 'beginner',
    requiredFeatures: ['firebase']
  },
};

// Add to WIDGET_COMPONENT_REGISTRY
const WIDGET_COMPONENT_REGISTRY: Record<WidgetType, React.ComponentType<any>> = {
  // ... existing widgets
  your_widget: YourWidget,
};

// Add to WIDGET_REGISTRY
export const WIDGET_REGISTRY: Record<WidgetType, WidgetDefinition> = {
  // ... existing widgets
  your_widget: {
    type: 'your_widget',
    metadata: WIDGET_METADATA_REGISTRY.your_widget,
    constraints: WIDGET_CONSTRAINTS_REGISTRY.your_widget,
    defaultConfig: createDefaultWidgetConfig('your_widget'),
    component: WIDGET_COMPONENT_REGISTRY.your_widget,
  },
};
```

## Step 5: Create Settings Schema

Create `YourWidgetSettings.tsx` in the `settings/` folder:

```typescript
import { YourIcon, Database } from 'lucide-react';
import type { WidgetSettingsSchema } from './WidgetSettingsFramework';

export const yourWidgetSettingsSchema: WidgetSettingsSchema = {
  sections: [
    // General Settings
    {
      key: 'title',
      type: 'text',
      label: 'Widget Title',
      description: 'Display name for your widget',
      defaultValue: 'Your Widget',
      maxLength: 50,
    },

    // Firebase Configuration
    {
      type: 'section',
      title: 'Firebase Configuration',
      description: 'Configure data source connection',
      icon: <Database className="w-4 h-4" />,
      fields: [
        {
          key: 'firebaseConfig.path',
          type: 'text',
          label: 'Firebase Path',
          description: 'Path to your data in Firebase',
          defaultValue: '/your/data/path',
          required: true,
          placeholder: '/your/data/path',
        },
        {
          key: 'firebaseConfig.updateInterval',
          type: 'number',
          label: 'Update Interval (ms)',
          description: 'How often to fetch new data',
          defaultValue: 1000,
          min: 100,
          max: 60000,
          step: 100,
        },
      ],
    },

    // Your Widget Properties
    {
      type: 'section',
      title: 'Widget Properties',
      description: 'Configure widget display options',
      icon: <YourIcon className="w-4 h-4" />,
      fields: [
        {
          key: 'props.unit',
          type: 'select',
          label: 'Display Unit',
          description: 'Unit to display',
          defaultValue: 'default',
          options: [
            { value: 'default', label: 'Default' },
            { value: 'custom', label: 'Custom' },
          ],
        },
        {
          key: 'props.showTrend',
          type: 'boolean',
          label: 'Show Trend',
          description: 'Display trend indicator',
          defaultValue: true,
        },
      ],
    },
  ],
};
```

## Step 6: Register Settings

Add your settings to `settings/index.tsx`:

```typescript
import { yourWidgetSettingsSchema } from './YourWidgetSettings';

export const WIDGET_SETTINGS_REGISTRY: Record<WidgetType, () => WidgetSettingsSchema> = {
  // ... existing widgets
  your_widget: () => yourWidgetSettingsSchema,
};
```

## Step 7: Update Default Configuration

Add your widget's default configuration to `types.tsx` in the `createDefaultWidgetConfig` function:

```typescript
case 'your_widget':
  return {
    ...baseConfig,
    type: 'your_widget',
    w: 2,
    h: 2,
    firebaseConfig: {
      path: '/your/data/path',
      dataType: 'number',
      updateInterval: 1000,
      enabled: true,
    },
    props: {
      unit: 'default',
      showTrend: true,
      // ... other default properties
      ...baseConfig.props,
    },
  } as YourWidgetConfig;
```

## Step 8: Export Widget

Add your widget to `index.tsx`:

```typescript
export { YourWidget } from "./YourWidget";
```

## Key Concepts

### BaseWidget
The `BaseWidget` component provides:
- Common layout and styling
- Firebase connection indicators
- Edit mode controls (settings, duplicate, delete)
- Error handling

### Firebase Integration
Use the `useWidgetFirebase` hook for:
- Automatic connection management
- Data type conversion
- Error handling
- Connection status indicators

### Settings Framework
The settings framework provides:
- Form generation from schema
- Validation
- Default values
- Nested object support

### Widget Lifecycle
1. **Creation**: Widget is added to dashboard
2. **Configuration**: User sets up Firebase path and properties
3. **Connection**: Widget connects to Firebase when not in edit mode
4. **Data Display**: Widget renders data with error handling
5. **Updates**: Widget receives real-time updates from Firebase

## Best Practices

1. **Error Handling**: Always handle Firebase connection errors
2. **Loading States**: Show appropriate loading indicators
3. **Default Values**: Provide sensible defaults for all properties
4. **Validation**: Validate user inputs in settings
5. **Responsive Design**: Ensure widgets work at different sizes
6. **Accessibility**: Use proper ARIA labels and keyboard navigation

## Example: Temperature Widget

The Temperature Widget demonstrates all these concepts:

- **Firebase Integration**: Connects to temperature sensor data
- **Data Processing**: Converts values and applies unit conversion
- **Visual Feedback**: Color-coded temperature ranges
- **Settings**: Configurable units, precision, and color ranges
- **Error Handling**: Shows connection status and errors

This provides a complete template for developing new widgets in the IoT Kit dashboard system.