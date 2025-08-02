import React from 'react';

// Simple widget type definition
export type WidgetType = "temperature" | "humidity" | "temperature-chart" | "humidity-chart";

// Simplified widget configuration
export interface WidgetConfig {
  // Basic identification
  i: string;
  type: WidgetType;
  
  // Layout
  x: number;
  y: number;
  w: number;
  h: number;
  
  // Grid constraints (optional)
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  
  // Display
  title?: string;
  
  // Data source (optional)
  firebasePath?: string;
  
  // Widget-specific properties
  props?: Record<string, any>;
}

// Simple widget props interface
export interface WidgetProps {
  config: WidgetConfig;
  editMode?: boolean;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  className?: string;
}

// Simple widget component type
export type WidgetComponent = React.ComponentType<WidgetProps>;

// Widget definition for easy registration
export interface SimpleWidgetDefinition {
  type: WidgetType;
  name: string;
  description: string;
  component: WidgetComponent;
  defaultProps?: Record<string, any>;
  defaultConstraints?: {
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
  };
}

// Utility functions
export function createWidgetConfig(type: WidgetType, overrides?: Partial<WidgetConfig>): WidgetConfig {
  return {
    i: `${type}-${Date.now()}`,
    type,
    x: 0,
    y: 0,
    w: 2,
    h: 2,
    title: type.charAt(0).toUpperCase() + type.slice(1),
    props: {},
    // Default constraints will be applied by the grid system
    ...overrides,
  };
}

export function getWidgetDisplayName(type: WidgetType): string {
  const names: Record<WidgetType, string> = {
    temperature: 'Temperature',
    humidity: 'Humidity',
    'temperature-chart': 'Temperature Chart',
    'humidity-chart': 'Humidity Chart',
  };
  return names[type] || type;
}
