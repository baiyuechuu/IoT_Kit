import React from 'react';
import type { 
  WidgetType, 
  WidgetDefinition, 
  WidgetConstraints, 
  WidgetMetadata
} from './types';
import { createDefaultWidgetConfig } from './types';
import { SwitchWidget } from './SwitchWidget';
import { 
  ToggleLeft, 
  Gauge, 
  LineChart, 
  Type, 
  Square, 
  Sliders 
} from 'lucide-react';

// Widget constraints registry
export const WIDGET_CONSTRAINTS_REGISTRY: Record<WidgetType, WidgetConstraints> = {
  switch: {
    minW: 2,
    maxW: 3,
    minH: 2,
    maxH: 3,
    defaultSize: { w: 2, h: 2 }
  },
  gauge: {
    minW: 2,
    maxW: 4,
    minH: 2,
    maxH: 4,
    aspectRatio: 1, // Square aspect ratio for gauges
    defaultSize: { w: 3, h: 3 }
  },
  chart: {
    minW: 3,
    maxW: 12,
    minH: 2,
    maxH: 6,
    defaultSize: { w: 4, h: 3 }
  },
  text: {
    minW: 1,
    maxW: 6,
    minH: 1,
    maxH: 3,
    defaultSize: { w: 2, h: 1 }
  },
  button: {
    minW: 1,
    maxW: 4,
    minH: 1,
    maxH: 2,
    defaultSize: { w: 2, h: 1 }
  },
  slider: {
    minW: 2,
    maxW: 6,
    minH: 1,
    maxH: 3,
    defaultSize: { w: 3, h: 2 }
  }
};

// Widget metadata registry
export const WIDGET_METADATA_REGISTRY: Record<WidgetType, WidgetMetadata> = {
  switch: {
    name: 'Switch',
    description: 'Toggle switch for controlling boolean values',
    icon: ToggleLeft,
    category: 'control',
    tags: ['toggle', 'boolean', 'control', 'input'],
    difficulty: 'beginner',
    requiredFeatures: ['firebase']
  },
  gauge: {
    name: 'Gauge',
    description: 'Circular gauge for displaying numeric values with ranges',
    icon: Gauge,
    category: 'display',
    tags: ['gauge', 'numeric', 'visualization', 'display'],
    difficulty: 'intermediate',
    requiredFeatures: ['firebase']
  },
  chart: {
    name: 'Chart',
    description: 'Line/bar chart for time-series data visualization',
    icon: LineChart,
    category: 'visualization',
    tags: ['chart', 'graph', 'time-series', 'data'],
    difficulty: 'advanced',
    requiredFeatures: ['firebase', 'storage']
  },
  text: {
    name: 'Text Display',
    description: 'Display text or formatted numeric values',
    icon: Type,
    category: 'display',
    tags: ['text', 'display', 'label', 'value'],
    difficulty: 'beginner',
    requiredFeatures: ['firebase']
  },
  button: {
    name: 'Button',
    description: 'Interactive button for triggering actions',
    icon: Square,
    category: 'input',
    tags: ['button', 'action', 'trigger', 'control'],
    difficulty: 'intermediate',
    requiredFeatures: ['firebase', 'api']
  },
  slider: { 
    name: 'Slider',
    description: 'Slider input for selecting numeric values in a range',
    icon: Sliders,
    category: 'input',
    tags: ['slider', 'numeric', 'range', 'input'],
    difficulty: 'intermediate',
    requiredFeatures: ['firebase']
  }
};

// Placeholder components for widgets not yet implemented
function PlaceholderWidget({ type }: { type: WidgetType }) {
  const metadata = WIDGET_METADATA_REGISTRY[type];
  const IconComponent = metadata.icon;
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed border-muted rounded-lg p-4">
      {IconComponent && <IconComponent className="w-8 h-8 mb-2" />}
      <h3 className="font-medium text-sm">{metadata.name}</h3>
      <p className="text-xs text-center mt-1">Coming Soon</p>
    </div>
  );
}

// Component registry
const WIDGET_COMPONENT_REGISTRY: Record<WidgetType, React.ComponentType<any>> = {
  switch: SwitchWidget,
  gauge: (props) => <PlaceholderWidget type="gauge" {...props} />,
  chart: (props) => <PlaceholderWidget type="chart" {...props} />,
  text: (props) => <PlaceholderWidget type="text" {...props} />,
  button: (props) => <PlaceholderWidget type="button" {...props} />,
  slider: (props) => <PlaceholderWidget type="slider" {...props} />,
};

// Complete widget definitions
export const WIDGET_REGISTRY: Record<WidgetType, WidgetDefinition> = {
  switch: {
    type: 'switch',
    metadata: WIDGET_METADATA_REGISTRY.switch,
    constraints: WIDGET_CONSTRAINTS_REGISTRY.switch,
    defaultConfig: createDefaultWidgetConfig('switch'),
    component: WIDGET_COMPONENT_REGISTRY.switch,
  },
  gauge: {
    type: 'gauge',
    metadata: WIDGET_METADATA_REGISTRY.gauge,
    constraints: WIDGET_CONSTRAINTS_REGISTRY.gauge,
    defaultConfig: createDefaultWidgetConfig('gauge'),
    component: WIDGET_COMPONENT_REGISTRY.gauge,
  },
  chart: {
    type: 'chart',
    metadata: WIDGET_METADATA_REGISTRY.chart,
    constraints: WIDGET_CONSTRAINTS_REGISTRY.chart,
    defaultConfig: createDefaultWidgetConfig('chart'),
    component: WIDGET_COMPONENT_REGISTRY.chart,
  },
  text: {
    type: 'text',
    metadata: WIDGET_METADATA_REGISTRY.text,
    constraints: WIDGET_CONSTRAINTS_REGISTRY.text,
    defaultConfig: createDefaultWidgetConfig('text'),
    component: WIDGET_COMPONENT_REGISTRY.text,
  },
  button: {
    type: 'button',
    metadata: WIDGET_METADATA_REGISTRY.button,
    constraints: WIDGET_CONSTRAINTS_REGISTRY.button,
    defaultConfig: createDefaultWidgetConfig('button'),
    component: WIDGET_COMPONENT_REGISTRY.button,
  },
  slider: {
    type: 'slider',
    metadata: WIDGET_METADATA_REGISTRY.slider,
    constraints: WIDGET_CONSTRAINTS_REGISTRY.slider,
    defaultConfig: createDefaultWidgetConfig('slider'),
    component: WIDGET_COMPONENT_REGISTRY.slider,
  },
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
