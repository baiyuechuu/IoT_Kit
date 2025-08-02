import type { WidgetSettingsSchema } from './WidgetSettingsFramework';

export const clockWidgetSettingsSchema: WidgetSettingsSchema = {
  sections: [
    // General Settings
    {
      key: 'title',
      type: 'text',
      label: 'Widget Title',
      description: 'Display name for the clock widget',
      defaultValue: 'Clock',
      maxLength: 50,
    },

    // Humidity Display Section
    {
      type: 'section',
      fields: [
        {
          key: 'props.format',
          type: 'select',
          label: 'Clock Format',
          description: 'Select the format for the clock',
          defaultValue: '24-hour',
          options: [
            { value: '24-hour', label: '24-hour (e.g., 15:30)' },
            { value: '12-hour', label: '12-hour (e.g., 3:30 PM)' },
          ],
        },
      ],
    },
  ],
};

export default clockWidgetSettingsSchema;
