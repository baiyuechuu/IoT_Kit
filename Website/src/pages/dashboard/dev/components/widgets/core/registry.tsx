import type { 
  WidgetType, 
  SimpleWidgetDefinition,
  WidgetComponent
} from './types';
import { TemperatureWidget } from '../TemperatureWidget';

// Simple widget registry
const WIDGET_REGISTRY: Partial<Record<WidgetType, SimpleWidgetDefinition>> = {
  temperature: {
    type: 'temperature',
    name: 'Temperature',
    description: 'Display temperature data with unit conversion and color ranges',
    component: TemperatureWidget,
    defaultProps: {
      unit: 'celsius',
      showTrend: true,
      precision: 1,
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

// Export for backward compatibility
export const WIDGET_CONISTRAINTS = {};
