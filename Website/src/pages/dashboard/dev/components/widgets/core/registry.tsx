import React from 'react';
import type { 
  WidgetType, 
  WidgetDefinition, 
  WidgetConstraints, 
  WidgetMetadata
} from './types';
import { createDefaultWidgetConfig } from './types';
import { TemperatureWidget } from '../TemperatureWidget';
import { Thermometer } from 'lucide-react';

// Widget constraints registry
export const WIDGET_CONSTRAINTS_REGISTRY: Record<WidgetType, WidgetConstraints> = {
  temperature: {
    minW: 2,
    maxW: 3,
    minH: 2,
    maxH: 3,
    defaultSize: { w: 2, h: 2 }
  }
};

// Widget metadata registry
export const WIDGET_METADATA_REGISTRY: Record<WidgetType, WidgetMetadata> = {
  temperature: {
    name: 'Temperature',
    description: 'Display temperature data with unit conversion and color ranges',
    icon: Thermometer,
    category: 'display',
    tags: ['temperature', 'sensor', 'display', 'celsius', 'fahrenheit'],
    difficulty: 'beginner',
    requiredFeatures: ['firebase']
  }
};

// Component registry
const WIDGET_COMPONENT_REGISTRY: Record<WidgetType, React.ComponentType<any>> = {
  temperature: TemperatureWidget,
};

// Complete widget definitions
export const WIDGET_REGISTRY: Record<WidgetType, WidgetDefinition> = {
  temperature: {
    type: 'temperature',
    metadata: WIDGET_METADATA_REGISTRY.temperature,
    constraints: WIDGET_CONSTRAINTS_REGISTRY.temperature,
    defaultConfig: createDefaultWidgetConfig('temperature'),
    component: WIDGET_COMPONENT_REGISTRY.temperature,
  }
};

// Utility functions
export function getWidgetDefinition(type: WidgetType): WidgetDefinition {
  return WIDGET_REGISTRY[type];
}

export function getWidgetComponent(type: WidgetType): React.ComponentType<any> {
  return WIDGET_COMPONENT_REGISTRY[type];
}

export function getWidgetConstraints(type: WidgetType): WidgetConstraints {
  return WIDGET_CONSTRAINTS_REGISTRY[type];
}

export function getWidgetMetadata(type: WidgetType): WidgetMetadata {
  return WIDGET_METADATA_REGISTRY[type];
}

export function getAllWidgetTypes(): WidgetType[] {
  return Object.keys(WIDGET_REGISTRY) as WidgetType[];
}

export function getWidgetsByCategory(category: string): WidgetDefinition[] {
  return Object.values(WIDGET_REGISTRY).filter(
    widget => widget.metadata.category === category
  );
}

export function getWidgetsByDifficulty(difficulty: string): WidgetDefinition[] {
  return Object.values(WIDGET_REGISTRY).filter(
    widget => widget.metadata.difficulty === difficulty
  );
}

export function getWidgetsByTags(tags: string[]): WidgetDefinition[] {
  return Object.values(WIDGET_REGISTRY).filter(
    widget => tags.some(tag => 
      widget.metadata.tags?.includes(tag)
    )
  );
}

// Export for backward compatibility
export const WIDGET_CONSTRAINTS = WIDGET_CONSTRAINTS_REGISTRY;
