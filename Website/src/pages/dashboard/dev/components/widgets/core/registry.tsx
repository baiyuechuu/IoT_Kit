import type { 
  WidgetType, 
  SimpleWidgetDefinition,
  WidgetComponent
} from './types';
import { TemperatureWidget } from '../widget/TemperatureWidget';

// Simple widget registry
const WIDGET_REGISTRY: Partial<Record<WidgetType, SimpleWidgetDefinition>> = {
  temperature: {
    type: 'temperature',
    name: 'Temperature',
    description: 'Display temperature data with unit conversion and color ranges',
    component: TemperatureWidget,
    defaultProps: {
      unit: 'celsius',
      precision: 1,
    },
    defaultConstraints: {
      minW: 3,
      maxW: 4,
      minH: 2,
      maxH: 2,
    }
  }
};

// Simple registration function
export function registerWidget(definition: SimpleWidgetDefinition) {
  WIDGET_REGISTRY[definition.type] = definition;
}

// Utility functions
export function getWidgetDefinition(type: WidgetType): SimpleWidgetDefinition | undefined {
  return WIDGET_REGISTRY[type];
}

export function getWidgetComponent(type: WidgetType): WidgetComponent | undefined {
  return WIDGET_REGISTRY[type]?.component;
}

export function getAllWidgetTypes(): WidgetType[] {
  return Object.keys(WIDGET_REGISTRY) as WidgetType[];
}

export function getAllWidgetDefinitions(): SimpleWidgetDefinition[] {
  return Object.values(WIDGET_REGISTRY);
}

// Get widget constraints (widget-specific or fallback to defaults)
export function getWidgetConstraints(type: WidgetType) {
  const definition = WIDGET_REGISTRY[type];
  return definition?.defaultConstraints || {
    minW: 1,
    maxW: 6,
    minH: 1,
    maxH: 4,
  };
}

// Export for backward compatibility
export const WIDGET_CONISTRAINTS = {};
