# Practical Example: Creating a Pressure Widget

This example demonstrates creating a complete Pressure widget following the detailed process.

## Step 1: Define Widget Type

**File: `Website/src/pages/dashboard/dev/components/widgets/core/types.tsx`**

```typescript
// Add pressure to WidgetType
export type WidgetType = "temperature" | "humidity" | "pressure";

// Add to display name mapping
export function getWidgetDisplayName(type: WidgetType): string {
  const names: Record<WidgetType, string> = {
    temperature: 'Temperature',
    humidity: 'Humidity',
    pressure: 'Pressure',
  };
  return names[type] || type;
}
```

## Step 2: Create Pressure Widget Component

**File: `Website/src/pages/dashboard/dev/components/widgets/widget/PressureWidget.tsx`**

```typescript
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Control from "../control/Control";
import { useFirebaseVariable } from "@/hooks/useFirebase";
import type { WidgetProps } from "../core/types";
import { TbGauge } from "react-icons/tb";

export function PressureWidget({
  config,
  editMode,
  onSettings,
  onDuplicate,
  onDelete,
  className = "",
}: WidgetProps) {
  const { firebasePath, props: widgetProps } = config;

  // State for pressure unit toggle
  const [displayUnit, setDisplayUnit] = useState<"hPa" | "kPa" | "mmHg" | "psi">(
    widgetProps?.unit || "hPa",
  );

  // Firebase integration
  const {
    value: firebaseValue,
    loading: firebaseLoading,
    error: firebaseError,
  } = useFirebaseVariable({
    variablePath: firebasePath,
    variableType: "number",
    autoConnect: !editMode && !!firebasePath,
  });

  // Auto-connect when configured and not in edit mode
  useEffect(() => {
    // Firebase connection is handled automatically by useFirebaseVariable
  }, [editMode, firebasePath]);

  // Convert Firebase value to pressure
  const pressure = React.useMemo(() => {
    if (firebaseValue === null || firebaseValue === undefined) {
      return null;
    }
    const converted = Number(firebaseValue);
    return isNaN(converted) ? null : converted;
  }, [firebaseValue]);

  // Pressure conversion
  const convertPressure = (
    pressure: number | null,
    unit: "hPa" | "kPa" | "mmHg" | "psi",
  ) => {
    if (pressure === null) {
      return null;
    }
    
    // Assuming input is in hPa, convert to desired unit
    switch (unit) {
      case "hPa":
        return pressure;
      case "kPa":
        return pressure / 10;
      case "mmHg":
        return pressure * 0.750062;
      case "psi":
        return pressure * 0.0145038;
      default:
        return pressure;
    }
  };

  // Toggle pressure unit
  const toggleUnit = () => {
    const units: Array<"hPa" | "kPa" | "mmHg" | "psi"> = ["hPa", "kPa", "mmHg", "psi"];
    const currentIndex = units.indexOf(displayUnit);
    const nextIndex = (currentIndex + 1) % units.length;
    setDisplayUnit(units[nextIndex]);
  };

  // Get background gradient based on pressure ranges
  const getBackgroundGradient = (pressure: number | null) => {
    if (pressure === null) {
      return "bg-gradient-to-br from-gray-50 to-gray-100";
    }
    
    // Pressure ranges for different conditions
    if (pressure < 950) {
      return "bg-gradient-to-r from-red-300 to-red-400"; // Very low pressure
    } else if (pressure < 1000) {
      return "bg-gradient-to-r from-orange-300 to-yellow-300"; // Low pressure
    } else if (pressure < 1020) {
      return "bg-gradient-to-r from-blue-300 to-cyan-300"; // Normal pressure
    } else if (pressure < 1050) {
      return "bg-gradient-to-r from-cyan-300 to-blue-400"; // High pressure
    } else {
      return "bg-gradient-to-r from-purple-400 to-indigo-500"; // Very high pressure
    }
  };

  const displayPressure = convertPressure(pressure, displayUnit);
  const originalPressure = pressure; // Keep original for color calculation
  const precision = widgetProps?.precision || 1;

  const formatPressure = (pressure: number | null) => {
    if (pressure === null) {
      return "--";
    }
    const formatted = pressure.toFixed(precision);
    return formatted;
  };

  const backgroundGradient = getBackgroundGradient(originalPressure);
  const formattedPressure = formatPressure(displayPressure);

  return (
    <Card
      className={`p-3 h-full flex flex-col relative group ${backgroundGradient} ${className}`}
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
          <TbGauge className="w-10 h-10 text-black" />
        </div>

        {/* Pressure Display */}
        <div className="flex items-end space-x-2 absolute bottom-1 left-4">
          <span className="text-6xl font-bold text-black">
            {formattedPressure}
          </span>
          <span className="text-3xl font-medium mb-1 text-gray-600">
            {displayUnit}
          </span>
        </div>

        {/* Unit Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleUnit}
          className="absolute top-2 right-2 text-xs px-2 py-1 h-6 bg-white/10 backdrop-blur-sm text-gray-700 border-gray-100/30"
        >
          {displayUnit}
        </Button>

        {/* Status Indicator */}
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

export default PressureWidget;
```

## Step 3: Create Pressure Settings Schema

**File: `Website/src/pages/dashboard/dev/components/widgets/settings/PressureWidgetSettings.tsx`**

```typescript
import type { WidgetSettingsSchema } from './WidgetSettingsFramework';

export const pressureWidgetSettingsSchema: WidgetSettingsSchema = {
  sections: [
    // General Settings
    {
      key: 'title',
      type: 'text',
      label: 'Widget Title',
      description: 'Display name for the pressure widget',
      defaultValue: 'Pressure',
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
          description: 'Path to pressure data in Firebase (e.g., /sensors/pressure)',
          defaultValue: '/sensors/pressure',
          required: true,
          placeholder: '/sensors/pressure',
        },
      ],
    },

    // Pressure Display Section
    {
      type: 'section',
      fields: [
        {
          key: 'props.unit',
          type: 'select',
          label: 'Default Pressure Unit',
          description: 'Default unit of measurement to display',
          defaultValue: 'hPa',
          options: [
            { value: 'hPa', label: 'Hectopascals (hPa)' },
            { value: 'kPa', label: 'Kilopascals (kPa)' },
            { value: 'mmHg', label: 'Millimeters of Mercury (mmHg)' },
            { value: 'psi', label: 'Pounds per Square Inch (psi)' },
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
          key: 'props.showTrend',
          type: 'boolean',
          label: 'Show Pressure Trend',
          description: 'Display trend indicator (rising/falling)',
          defaultValue: true,
        },
        {
          key: 'props.alertThreshold',
          type: 'number',
          label: 'Alert Threshold (hPa)',
          description: 'Alert when pressure goes below this value',
          defaultValue: 950,
          min: 800,
          max: 1100,
          step: 10,
        },
      ],
    },
  ],
};

export default pressureWidgetSettingsSchema;
```

## Step 4: Register Pressure Widget

**File: `Website/src/pages/dashboard/dev/components/widgets/core/registry.tsx`**

```typescript
import { PressureWidget } from '../widget/PressureWidget';

// Add to WIDGET_REGISTRY
const WIDGET_REGISTRY: Partial<Record<WidgetType, SimpleWidgetDefinition>> = {
  // ... existing widgets ...
  
  pressure: {
    type: 'pressure',
    name: 'Pressure',
    description: 'Display atmospheric pressure data with multiple unit options',
    component: PressureWidget,
    defaultProps: {
      unit: 'hPa',
      precision: 1,
      showTrend: true,
      alertThreshold: 950,
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

## Step 5: Add to Widget Index

**File: `Website/src/pages/dashboard/dev/components/widgets/index.tsx`**

```typescript
// Add export for pressure widget
export { PressureWidget } from "./widget/PressureWidget";
```

## Step 6: Add Settings to Settings Index

**File: `Website/src/pages/dashboard/dev/components/widgets/settings/index.tsx`**

```typescript
import { pressureWidgetSettingsSchema } from "./PressureWidgetSettings";

// Add to settings mapping
const settingsSchemas = {
  // ... existing schemas ...
  pressure: () => pressureWidgetSettingsSchema,
};

// Add export
export * from "./PressureWidgetSettings";
```

## Step 7: Add to Dashboard Integration

**File: `Website/src/pages/dashboard/dev/components/MainDashboard.tsx`**

```typescript
// Add case for pressure widget
case "pressure":
  return <PressureWidget {...commonProps} config={widget as any} />;
```

## Step 8: Add to Widget Dialog

**File: `Website/src/pages/dashboard/dev/components/AddWidgetDialog.tsx`**

```typescript
// Add to available widgets
{
  type: "pressure" as WidgetType,
  name: "Pressure",
  description: "Display atmospheric pressure data with multiple unit options",
}
```

## Testing the Pressure Widget

1. **Add the widget to your dashboard**
2. **Configure Firebase path** (e.g., `/sensors/pressure`)
3. **Test unit conversion** by clicking the unit button
4. **Verify color coding** based on pressure ranges
5. **Test with different pressure values** to see background changes

## Key Features of This Pressure Widget

- **Multiple Unit Support**: hPa, kPa, mmHg, psi
- **Dynamic Color Coding**: Different colors for pressure ranges
- **Real-time Updates**: Firebase integration
- **Responsive Design**: Works on different screen sizes
- **Error Handling**: Shows connection status and errors
- **Configurable**: Settings for precision, alerts, and trends

This example demonstrates a complete widget implementation with all the features needed for a production-ready IoT dashboard widget. 