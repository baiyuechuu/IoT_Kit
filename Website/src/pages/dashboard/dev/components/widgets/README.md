# Simple Widget System

This is a simplified widget system that makes it very easy to create custom widgets.

## Creating a Custom Widget

### 1. Create your widget component

```tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import type { WidgetProps } from './core/types';
import Control from '../control/Control';

export function MyCustomWidget({ config, editMode, onSettings, onDelete, className = "" }: WidgetProps) {
  const { title, props } = config;
  
  // Access your widget's custom properties
  const myValue = props?.myValue || 'default';
  
  return (
    <Card className={`p-4 h-full flex flex-col relative group ${className}`}>
      {editMode && (
        <Control
          onSettings={onSettings}
          onDelete={onDelete}
        />
      )}
      
      <div className="flex-1 flex items-center justify-center">
        <h3>{title}</h3>
        <p>{myValue}</p>
      </div>
    </Card>
  );
}
```

### 2. Register your widget

```tsx
import { registerWidget } from './core/registry';
import { MyCustomWidget } from './MyCustomWidget';

registerWidget({
  type: 'my-custom-widget',
  name: 'My Custom Widget',
  description: 'A simple custom widget example',
  component: MyCustomWidget,
  defaultProps: {
    myValue: 'Hello from my widget!'
  }
});
```

### 3. Add your widget type to the types

```tsx
// In core/types.tsx, add your widget type:
export type WidgetType = "temperature" | "gauge" | "chart" | "text" | "button" | "my-custom-widget";
```

## Widget Props Interface

Your widget component receives these props:

```tsx
interface WidgetProps {
  config: WidgetConfig;        // Widget configuration
  editMode?: boolean;          // Whether widget is in edit mode
  onSettings?: () => void;     // Callback to open settings
  onDelete?: () => void;       // Callback to delete widget
  className?: string;          // Additional CSS classes
}
```

## Widget Configuration

```tsx
interface WidgetConfig {
  i: string;                   // Unique widget ID
  type: WidgetType;            // Widget type
  x: number;                   // Grid X position
  y: number;                   // Grid Y position
  w: number;                   // Grid width
  h: number;                   // Grid height
  title?: string;              // Widget title
  firebasePath?: string;       // Optional Firebase data path
  props?: Record<string, any>; // Your custom properties
}
```

## Example: Simple Text Widget

See `SimpleTextWidget.tsx` for a complete example of a custom widget.

## Benefits of the Simplified System

- **Minimal boilerplate**: Just create a component and register it
- **Simple props interface**: Only what you need
- **Easy to understand**: Clear, straightforward API
- **Flexible**: Add any custom properties you want
- **No complex inheritance**: Just implement the WidgetProps interface

## Firebase Integration (Optional)

If your widget needs Firebase data:

```tsx
import { useFirebaseVariable } from '@/hooks/useFirebase';

export function MyFirebaseWidget({ config }: WidgetProps) {
  const { firebasePath } = config;
  
  const { value, connected, loading, error } = useFirebaseVariable({
    variablePath: firebasePath,
    variableType: 'number',
    autoConnect: true,
  });

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {connected && <p>Value: {value}</p>}
    </div>
  );
}
``` 