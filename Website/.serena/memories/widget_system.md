# Widget System Documentation

## Current Widget Types

### Switch Widget
- **Purpose**: Toggle on/off control for IoT devices
- **Constraints**: 2x2 minimum, 3x3 maximum
- **Properties**: title (required)
- **Features**: Real-time state display, edit mode support

## Widget Configuration Interface

```typescript
interface WidgetConfig {
  i: string;           // Unique identifier
  type: WidgetType;    // Widget type
  x: number;           // Grid X position
  y: number;           // Grid Y position
  w: number;           // Width in grid units
  h: number;           // Height in grid units
  minW?: number;       // Minimum width
  maxW?: number;       // Maximum width
  minH?: number;       // Minimum height
  maxH?: number;       // Maximum height
  static?: boolean;    // Whether widget is static
  props?: Record<string, any>; // Widget-specific properties
}
```



## Widget Development Guidelines

### Adding New Widgets
1. Define widget type in `WidgetType` union
2. Add constraints to `WIDGET_CONSTRAINTS`
3. Create widget component in `widgets/` directory
4. Add to `WIDGET_TYPES` array in `AddWidgetDialog`
5. Implement widget-specific configuration form

## AI-Assisted Widget Development

### AI Development Support
- **Code Generation**: AI can generate widget components automatically
- **Type Safety**: AI ensures proper TypeScript interfaces
- **Best Practices**: AI follows established patterns and conventions
- **Error Handling**: AI includes proper error states and loading
- **Responsive Design**: AI implements mobile-friendly layouts

### AI Development Workflow
1. **Widget Specification**: Describe widget purpose and requirements
2. **Component Generation**: AI creates widget component with proper structure
3. **Configuration Form**: AI generates settings form for widget
4. **Integration**: AI adds widget to system with proper types
5. **Testing**: AI includes basic functionality testing

### AI Development Commands
```bash
# AI can help with:
- "Create a new gauge widget for temperature display"
- "Add a chart widget for sensor data visualization"
- "Generate settings form for LED indicator widget"
- "Implement real-time data connection for switch widget"
- "Create widget with Firebase integration"
```

## Firebase IoT Integration

### Firebase Connection Features
- **Connection Button**: Add Firebase connection button in dashboard
- **Configuration Dialog**: Enter Firebase project details
- **Real-time Data**: Connect widgets to Firebase Realtime Database
- **IoT Device Support**: Support for various IoT device types

### Firebase Setup Workflow
1. **Project Configuration**: Enter Firebase project ID and credentials
2. **Database Rules**: Configure security rules for IoT data
3. **Device Registration**: Register IoT devices in Firebase
4. **Data Mapping**: Map device data to widget variables

### Widget-Firebase Integration
- **Variable Mapping**: Connect widget variables to Firebase paths
- **Real-time Updates**: Automatic data updates from Firebase
- **Data Types**: Support for different IoT data types
- **Error Handling**: Connection status and error management

### Enhanced Widget Creation Process
1. **Widget Type Selection**: Choose widget type (gauge, switch, chart, etc.)
2. **Widget Naming**: Enter descriptive widget name
3. **Variable Configuration**: 
   - Enter variable name (e.g., "temperature", "humidity")
   - Select data type (number, boolean, string)
   - Choose Firebase path for data source
4. **Display Settings**: Configure how data is displayed
5. **Save to Supabase**: Store widget configuration in database

### Widget Configuration Interface
```typescript
interface WidgetConfig {
  id: string;
  name: string;
  type: WidgetType;
  firebasePath: string;    // Firebase data path
  variableName: string;    // Variable name for display
  dataType: 'number' | 'boolean' | 'string';
  displaySettings: {
    unit?: string;         // e.g., "°C", "%", "V"
    minValue?: number;
    maxValue?: number;
    updateInterval?: number; // Real-time update interval
  };
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}
```

### Firebase Connection UI
- **Connection Status**: Visual indicator of Firebase connection
- **Project Settings**: Firebase project configuration
- **Device Management**: IoT device registration and management
- **Data Preview**: Real-time data preview for testing