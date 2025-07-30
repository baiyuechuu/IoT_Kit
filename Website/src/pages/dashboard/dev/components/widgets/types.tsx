import React from 'react';

// Widget type definitions
export type WidgetType = "switch" | "gauge" | "chart" | "text" | "button" | "slider";

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
export interface SwitchWidgetConfig extends BaseWidgetConfig {
  type: 'switch';
  props?: {
    variant?: 'default' | 'outline' | 'secondary' | 'destructive';
    defaultState?: boolean;
    confirmOnChange?: boolean;
    labels?: {
      on?: string;
      off?: string;
    };
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

export interface ButtonWidgetConfig extends BaseWidgetConfig {
  type: 'button';
  props?: {
    variant?: 'default' | 'outline' | 'secondary' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    action?: {
      type: 'firebase' | 'api' | 'navigation';
      target?: string;
      payload?: any;
    };
    confirmAction?: boolean;
    disabled?: boolean;
  };
}

export interface SliderWidgetConfig extends BaseWidgetConfig {
  type: 'slider';
  props?: {
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    showValue?: boolean;
    orientation?: 'horizontal' | 'vertical';
    marks?: Array<{
      value: number;
      label?: string;
    }>;
  };
}

// Union type for all widget configurations
export type WidgetConfig = 
  | SwitchWidgetConfig
  | GaugeWidgetConfig
  | ChartWidgetConfig
  | TextWidgetConfig
  | ButtonWidgetConfig
  | SliderWidgetConfig;

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
  category?: 'input' | 'display' | 'control' | 'visualization';
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
export function isSwitchWidget(config: WidgetConfig): config is SwitchWidgetConfig {
  return config.type === 'switch';
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

export function isButtonWidget(config: WidgetConfig): config is ButtonWidgetConfig {
  return config.type === 'button';
}

export function isSliderWidget(config: WidgetConfig): config is SliderWidgetConfig {
  return config.type === 'slider';
}

// Utility functions for widget configuration
export function getWidgetDisplayName(type: WidgetType): string {
  const names: Record<WidgetType, string> = {
    switch: 'Switch',
    gauge: 'Gauge',
    chart: 'Chart',
    text: 'Text Display',
    button: 'Button',
    slider: 'Slider',
  };
  return names[type];
}

export function getWidgetIcon(type: WidgetType): string {
  const icons: Record<WidgetType, string> = {
    switch: '🔘',
    gauge: '📊',
    chart: '📈',
    text: '📝',
    button: '🔲',
    slider: '🎛️',
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
    case 'switch':
      return {
        ...baseConfig,
        type: 'switch',
        props: {
          variant: 'default',
          defaultState: false,
          labels: { on: 'ON', off: 'OFF' },
          ...baseConfig.props,
        },
      } as SwitchWidgetConfig;
    
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
    
    case 'button':
      return {
        ...baseConfig,
        type: 'button',
        props: {
          variant: 'default',
          size: 'md',
          confirmAction: false,
          disabled: false,
          ...baseConfig.props,
        },
      } as ButtonWidgetConfig;
    
    case 'slider':
      return {
        ...baseConfig,
        type: 'slider',
        w: 3,
        h: 2,
        props: {
          min: 0,
          max: 100,
          step: 1,
          showValue: true,
          orientation: 'horizontal',
          ...baseConfig.props,
        },
      } as SliderWidgetConfig;
    
    default:
      return baseConfig as WidgetConfig;
  }
}