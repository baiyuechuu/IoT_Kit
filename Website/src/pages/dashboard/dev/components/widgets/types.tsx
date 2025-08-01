import React from 'react';

// Widget type definitions
export type WidgetType = "temperature" | "sensor_data" | "gauge" | "chart" | "text";

// Base widget configuration interface
export interface BaseWidgetConfig {
  // Widget identification
  i: string;
  type: WidgetType;
  
  // Layout properties
  x: number;
  y: number;
  w: number;
  h: number;
  
  // Layout constraints (optional, will use defaults from WIDGET_CONSTRAINTS)
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
  
  // Widget metadata
  title?: string;
  description?: string;
  
  // Firebase/data source configuration
  firebaseConfig?: {
    path?: string;
    dataType?: 'boolean' | 'number' | 'string' | 'object';
    updateInterval?: number;
    enabled?: boolean;
  };
  
  // Visual configuration
  styling?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: number;
    opacity?: number;
  };
  
  // Widget-specific properties
  props?: Record<string, any>;
}

// Specific widget configuration interfaces
export interface TemperatureWidgetConfig extends BaseWidgetConfig {
  type: 'temperature';
  props?: {
    unit?: 'celsius' | 'fahrenheit';
    showTrend?: boolean;
    colorRanges?: Array<{
      min: number;
      max: number;
      color: string;
      label: string;
    }>;
    precision?: number;
  };
}

export interface SensorDataWidgetConfig extends BaseWidgetConfig {
  type: 'sensor_data';
  props?: {
    sensors?: string[];
    layout?: 'vertical' | 'horizontal' | 'grid';
    showLabels?: boolean;
    showUnits?: boolean;
    precision?: number;
  };
}

export interface GaugeWidgetConfig extends BaseWidgetConfig {
  type: 'gauge';
  props?: {
    min?: number;
    max?: number;
    unit?: string;
    precision?: number;
    segments?: Array<{
      min: number;
      max: number;
      color: string;
      label?: string;
    }>;
    showValue?: boolean;
    showMinMax?: boolean;
  };
}

export interface ChartWidgetConfig extends BaseWidgetConfig {
  type: 'chart';
  props?: {
    chartType?: 'line' | 'bar' | 'area' | 'pie';
    timeRange?: number; // in minutes
    maxDataPoints?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    colors?: string[];
    yAxis?: {
      min?: number;
      max?: number;
      unit?: string;
    };
  };
}

export interface TextWidgetConfig extends BaseWidgetConfig {
  type: 'text';
  props?: {
    fontSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    textAlign?: 'left' | 'center' | 'right';
    format?: string; // Format string for displaying values
    prefix?: string;
    suffix?: string;
  };
}


// Union type for all widget configurations
export type WidgetConfig = 
  | TemperatureWidgetConfig
  | SensorDataWidgetConfig
  | GaugeWidgetConfig
  | ChartWidgetConfig
  | TextWidgetConfig;

// Widget constraints configuration
export interface WidgetConstraints {
  minW: number;
  maxW: number;
  minH: number;
  maxH: number;
  aspectRatio?: number; // Optional fixed aspect ratio
  defaultSize?: {
    w: number;
    h: number;
  };
}

// Widget metadata for development
export interface WidgetMetadata {
  name: string;
  description: string;
  icon?: React.ComponentType<any>;
  category?: 'display' | 'visualization';
  tags?: string[];
  previewImage?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  requiredFeatures?: Array<'firebase' | 'api' | 'storage'>;
}

// Complete widget definition for the development environment
export interface WidgetDefinition {
  type: WidgetType;
  metadata: WidgetMetadata;
  constraints: WidgetConstraints;
  defaultConfig: Partial<WidgetConfig>;
  component: React.ComponentType<any>;
}

// Firebase configuration validation
export interface FirebaseConnectionStatus {
  connected: boolean;
  configured: boolean;
  error?: string;
  lastUpdate?: Date;
}

// Widget state management
export interface WidgetState {
  value?: any;
  error?: string;
  loading?: boolean;
  lastUpdated?: Date;
  connectionStatus?: FirebaseConnectionStatus;
}

// Widget event handlers
export interface WidgetEventHandlers {
  onValueChange?: (value: any) => void;
  onError?: (error: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSettingsChange?: (settings: Partial<WidgetConfig>) => void;
}

// Common widget props that all widgets should implement
export interface CommonWidgetProps {
  config: WidgetConfig;
  state?: WidgetState;
  editMode?: boolean;
  
  // Event handlers
  onValueChange?: (value: any) => void;
  onConfigChange?: (config: Partial<WidgetConfig>) => void;
  onError?: (error: string) => void;
  
  // Widget management
  onSettings?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  
  // Additional props
  className?: string;
  disabled?: boolean;
}

// Type guards for widget configurations
export function isTemperatureWidget(config: WidgetConfig): config is TemperatureWidgetConfig {
  return config.type === 'temperature';
}

export function isSensorDataWidget(config: WidgetConfig): config is SensorDataWidgetConfig {
  return config.type === 'sensor_data';
}

export function isGaugeWidget(config: WidgetConfig): config is GaugeWidgetConfig {
  return config.type === 'gauge';
}

export function isChartWidget(config: WidgetConfig): config is ChartWidgetConfig {
  return config.type === 'chart';
}

export function isTextWidget(config: WidgetConfig): config is TextWidgetConfig {
  return config.type === 'text';
}

// Utility functions for widget configuration
export function getWidgetDisplayName(type: WidgetType): string {
  const names: Record<WidgetType, string> = {
    temperature: 'Temperature',
    sensor_data: 'Sensor Data',
    gauge: 'Gauge',
    chart: 'Chart',
    text: 'Text Display',
  };
  return names[type];
}

export function getWidgetIcon(type: WidgetType): string {
  const icons: Record<WidgetType, string> = {
    temperature: '🌡️',
    sensor_data: '📊',
    gauge: '📊',
    chart: '📈',
    text: '📝',
  };
  return icons[type];
}

export function createDefaultWidgetConfig(type: WidgetType, overrides?: Partial<WidgetConfig>): WidgetConfig {
  const baseConfig: BaseWidgetConfig = {
    i: `${type}-${Date.now()}`,
    type,
    x: 0,
    y: 0,
    w: 2,
    h: 2,
    title: getWidgetDisplayName(type),
    firebaseConfig: {
      enabled: false,
      dataType: 'string',
      updateInterval: 1000,
    },
    props: {},
    ...overrides,
  };

  // Type-specific defaults
  switch (type) {
    case 'temperature':
      return {
        ...baseConfig,
        type: 'temperature',
        w: 2,
        h: 2,
        firebaseConfig: {
          path: '/sensors/temperature',
          dataType: 'number',
          updateInterval: 1000,
          enabled: true,
        },
        props: {
          unit: 'celsius',
          showTrend: true,
          precision: 1,
          colorRanges: [
            { min: -10, max: 0, color: '#3b82f6', label: 'Cold' },
            { min: 0, max: 20, color: '#10b981', label: 'Cool' },
            { min: 20, max: 30, color: '#f59e0b', label: 'Warm' },
            { min: 30, max: 50, color: '#ef4444', label: 'Hot' }
          ],
          ...baseConfig.props,
        },
      } as TemperatureWidgetConfig;
    
    case 'sensor_data':
      return {
        ...baseConfig,
        type: 'sensor_data',
        w: 3,
        h: 2,
        firebaseConfig: {
          path: '/sensors',
          dataType: 'object',
          updateInterval: 1000,
          enabled: true,
        },
        props: {
          sensors: ['temperature'],
          layout: 'vertical',
          showLabels: true,
          showUnits: true,
          precision: 1,
          ...baseConfig.props,
        },
      } as SensorDataWidgetConfig;
    
    case 'gauge':
      return {
        ...baseConfig,
        type: 'gauge',
        w: 3,
        h: 3,
        props: {
          min: 0,
          max: 100,
          unit: '',
          precision: 1,
          showValue: true,
          showMinMax: true,
          ...baseConfig.props,
        },
      } as GaugeWidgetConfig;
    
    case 'chart':
      return {
        ...baseConfig,
        type: 'chart',
        w: 4,
        h: 3,
        props: {
          chartType: 'line',
          timeRange: 60,
          maxDataPoints: 100,
          showGrid: true,
          showLegend: true,
          ...baseConfig.props,
        },
      } as ChartWidgetConfig;
    
    case 'text':
      return {
        ...baseConfig,
        type: 'text',
        props: {
          fontSize: 'md',
          fontWeight: 'medium',
          textAlign: 'center',
          ...baseConfig.props,
        },
      } as TextWidgetConfig;
    
    default:
      return baseConfig as WidgetConfig;
  }
}
