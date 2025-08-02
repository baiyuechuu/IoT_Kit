import type { WidgetSettingsSchema } from './WidgetSettingsFramework';

export const temperatureWidgetSettingsSchema: WidgetSettingsSchema = {
  sections: [
    // General Settings
    {
      key: 'title',
      type: 'text',
      label: 'Widget Title',
      description: 'Display name for the temperature widget',
      defaultValue: 'Temperature',
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
          description: 'Path to temperature data in Firebase (e.g., /sensors/temperature)',
          defaultValue: '/sensors/temperature',
          required: true,
          placeholder: '/sensors/temperature',
        },
      ],
    },

    // Temperature Display Section
    {
      type: 'section',
      fields: [
        {
          key: 'props.unit',
          type: 'select',
          label: 'Temperature Unit',
          description: 'Display temperature in Celsius or Fahrenheit',
          defaultValue: 'celsius',
          options: [
            { value: 'celsius', label: 'Celsius (°C)' },
            { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
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

export default temperatureWidgetSettingsSchema;