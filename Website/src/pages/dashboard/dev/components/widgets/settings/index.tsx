import type { WidgetType } from '../index';
import type { WidgetSettingsSchema } from './WidgetSettingsFramework';
import { getSwitchWidgetSettingsSchema } from './SwitchWidgetSettings';

// Widget settings registry
export const WIDGET_SETTINGS_REGISTRY: Record<WidgetType, () => WidgetSettingsSchema> = {
  switch: getSwitchWidgetSettingsSchema,
  gauge: () => ({ sections: [] }),
  chart: () => ({ sections: [] }),
  text: () => ({ sections: [] }),
  button: () => ({ sections: [] }),
  slider: () => ({ sections: [] }),
};

// Get settings schema for a widget type
export function getWidgetSettingsSchema(widgetType: WidgetType): WidgetSettingsSchema {
  const schemaGetter = WIDGET_SETTINGS_REGISTRY[widgetType];
  if (!schemaGetter) {
    throw new Error(`No settings schema found for widget type: ${widgetType}`);
  }
  return schemaGetter();
}

// Export framework components
export * from './WidgetSettingsFramework';
export * from './SwitchWidgetSettings';
