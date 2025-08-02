import React from 'react';

// Simple widget type definition
export type WidgetType = "temperature";

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
    ...overrides,
  };
}

export function getWidgetDisplayName(type: WidgetType): string {
  const names: Record<WidgetType, string> = {
    temperature: 'Temperature',
  };
  return names[type] || type;
}
