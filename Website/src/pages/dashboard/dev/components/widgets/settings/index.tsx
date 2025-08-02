import type { WidgetType } from '../index';
import type { WidgetSettingsSchema } from './WidgetSettingsFramework';
import { temperatureWidgetSettingsSchema } from './TemperatureWidgetSettings';

// Widget settings registry
export const WIDGET_SETTINGS_REGISTRY: Record<WidgetType, () => WidgetSettingsSchema> = {
  temperature: () => temperatureWidgetSettingsSchema,
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
export * from './TemperatureWidgetSettings';
