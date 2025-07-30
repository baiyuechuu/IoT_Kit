# Current Project Focus: Information Display Widgets

## Project Context
- **Project**: IoT Kit Website Dashboard
- **Current Task**: Create information display widgets for Firebase data (temperature, humidity)
- **Goal**: Replace control widgets with display widgets for sensor data monitoring

## Current Widget System
- **BaseWidget.tsx**: Common Firebase functionality and widget wrapper
- **SwitchWidget.tsx**: Control widget (to be removed)
- **Registry**: Widget type definitions and constraints
- **Firebase Integration**: useFirebase hook for real-time data

## Immediate Next Steps
1. Update widget types to remove control widgets
2. Create TemperatureWidget.tsx
3. Create HumidityWidget.tsx
4. Update widget registry
5. Remove SwitchWidget.tsx

## Key Files to Modify
- `src/pages/dashboard/dev/components/widgets/types.tsx`
- `src/pages/dashboard/dev/components/widgets/registry.tsx`
- `src/pages/dashboard/dev/components/widgets/SwitchWidget.tsx` (remove)
- Create new widget files

## Firebase Data Structure Expected
```json
{
  "sensors": {
    "temperature": 25.5,
    "humidity": 65.2,
    "timestamp": 1234567890
  }
}
```

## Widget Categories
- **Display**: temperature, humidity, sensor_data, gauge, text
- **Visualization**: chart
- **Removed**: control, input categories

## Development Approach
- Use existing BaseWidget framework
- Leverage useWidgetFirebase hook for data connection
- Focus on data visualization over control
- Maintain responsive design
- Include error handling and loading states