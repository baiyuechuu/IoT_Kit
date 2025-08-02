import type { WidgetSettingsSchema } from './WidgetSettingsFramework';

export const temperatureChartWidgetSettingsSchema: WidgetSettingsSchema = {
  sections: [
    // General Settings
    {
      key: 'title',
      type: 'text',
      label: 'Widget Title',
      description: 'Display name for the temperature chart widget',
      defaultValue: 'Temperature Chart',
      maxLength: 50,
    },

    // Sensor Configuration Section
    {
      type: 'section',
      fields: [
        {
          key: 'props.selectedSensors',
          type: 'multiSelect',
          label: 'Sensors to Display',
          description: 'Select up to 3 sensors to display on the chart',
          defaultValue: ['sensor1', 'sensor2', 'sensor3'],
          options: [
            { value: 'sensor1', label: 'Sensor 1' },
            { value: 'sensor2', label: 'Sensor 2' },
            { value: 'sensor3', label: 'Sensor 3' },
          ],
        },
      ],
    },

    // Chart Display Section
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
        {
          key: 'props.chartHeight',
          type: 'number',
          label: 'Chart Height',
          description: 'Height of the chart area in pixels',
          defaultValue: 200,
          min: 100,
          max: 400,
          step: 10,
        },
        {
          key: 'props.maxDataPoints',
          type: 'number',
          label: 'Max Data Points',
          description: 'Maximum number of data points to keep in chart history',
          defaultValue: 11,
          min: 5,
          max: 100,
          step: 1,
        },
        {
          key: 'props.showDots',
          type: 'boolean',
          label: 'Show Data Points',
          description: 'Display dots at each data point',
          defaultValue: true,
        },
        {
          key: 'props.showLegend',
          type: 'boolean',
          label: 'Show Legend',
          description: 'Display legend for multiple sensors',
          defaultValue: true,
        },
      ],
    },
  ],
};

export default temperatureChartWidgetSettingsSchema; 