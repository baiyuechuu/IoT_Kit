import type { 
  WidgetType, 
  SimpleWidgetDefinition,
  WidgetComponent
} from './types';
import { TemperatureWidget } from '../widget/TemperatureWidget';
import { HumidityWidget } from '../widget/HumidityWidget';
import { TemperatureChartWidget } from '../widget/TemperatureChartWidget';
import { HumidityChartWidget } from '../widget/HumidityChartWidget';
import { ClockWidget } from '../widget/ClockWidget';

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
  },
  humidity: {
    type: 'humidity',
    name: 'Humidity',
    description: 'Display humidity data with unit conversion and color ranges',
    component: HumidityWidget,
    defaultProps: {
      unit: 'percentage',
      precision: 1,
    },
    defaultConstraints: {
      minW: 3,
      maxW: 4,
      minH: 2,
      maxH: 2,
    }
  },
  'temperature-chart': {
    type: 'temperature-chart',
    name: 'Temperature Chart',
    description: 'Display temperature data as a line chart with unit conversion',
    component: TemperatureChartWidget,
    defaultProps: {
      unit: 'celsius',
      precision: 1,
    },
    defaultConstraints: {
      minW: 4,
      maxW: 6,
      minH: 3,
      maxH: 4,
    }
  },
  'humidity-chart': {
    type: 'humidity-chart',
    name: 'Humidity Chart',
    description: 'Display humidity data as a line chart with unit conversion',
    component: HumidityChartWidget,
    defaultProps: {
      unit: 'percentage',
      precision: 1,
    },
    defaultConstraints: {
      minW: 4,
      maxW: 6,
      minH: 3,
      maxH: 4,
    }
  },
  clock: {
    type: 'clock',
    name: 'Clock',
    description: 'Display the current time',
    component: ClockWidget,
    defaultProps: {},
    defaultConstraints: {
      minW: 3,
      maxW: 4,
      minH: 2,
      maxH: 2,
    }
  },
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
