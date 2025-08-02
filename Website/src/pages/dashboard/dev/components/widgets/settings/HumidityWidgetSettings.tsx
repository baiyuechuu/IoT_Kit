import type { WidgetSettingsSchema } from './WidgetSettingsFramework';

export const humidityWidgetSettingsSchema: WidgetSettingsSchema = {
  sections: [
    // General Settings
    {
      key: 'title',
      type: 'text',
      label: 'Widget Title',
      description: 'Display name for the humidity widget',
      defaultValue: 'Humidity',
      maxLength: 50,
    },

    // Firebase Configuration Section
    {
      type: 'section',
      fields: [
        {
          key: 'firebasePath',
          type: 'text',
          label: 'Firebase Path',
          description: 'Path to humidity data in Firebase (e.g., /sensors/humidity)',
          defaultValue: '/sensors/humidity',
          required: true,
          placeholder: '/sensors/humidity',
        },
      ],
    },

    // Humidity Display Section
    {
      type: 'section',
      fields: [
        {
          key: 'props.unit',
          type: 'select',
          label: 'Humidity Unit',
          description: 'Display humidity in percentage or decimal format',
          defaultValue: 'percentage',
          options: [
            { value: 'percentage', label: 'Percentage (%)' },
            { value: 'decimal', label: 'Decimal (0-1)' },
          ],
        },
        {
          key: 'props.precision',
          type: 'number',
          label: 'Decimal Precision',
          description: 'Number of decimal places to display',
          defaultValue: 1,
          min: 0,
          max: 3,
          step: 1,
        },
      ],
    },
  ],
};

export default humidityWidgetSettingsSchema; 