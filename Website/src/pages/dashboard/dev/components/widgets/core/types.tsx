import React from 'react';

// Widget type definitions
export type WidgetType = "temperature";

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

// Union type for all widget configurations
export type WidgetConfig = TemperatureWidgetConfig;

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

// Utility functions for widget configuration
export function getWidgetDisplayName(type: WidgetType): string {
  const names: Record<WidgetType, string> = {
    temperature: 'Temperature',
  };
  return names[type];
}

export function getWidgetIcon(type: WidgetType): string {
  const icons: Record<WidgetType, string> = {
    temperature: '🌡️',
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
    
    default:
      return baseConfig as WidgetConfig;
  }
}
