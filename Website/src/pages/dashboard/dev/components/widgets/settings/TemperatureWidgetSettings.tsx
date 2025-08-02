import { Thermometer, Database, Palette } from 'lucide-react';
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
    {
      key: 'description',
      type: 'textarea',
      label: 'Description',
      description: 'Optional description for the widget',
      placeholder: 'Temperature sensor monitoring...',
      rows: 2,
    },

    // Firebase Configuration Section
    {
      type: 'section',
      title: 'Firebase Configuration',
      description: 'Configure data source connection',
      icon: <Database className="w-4 h-4" />,
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
      title: 'Temperature Display',
      description: 'Configure how temperature is displayed',
      icon: <Thermometer className="w-4 h-4" />,
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
          key: 'props.showTrend',
          type: 'boolean',
          label: 'Show Trend Indicator',
          description: 'Display up/down arrows for temperature trends',
          defaultValue: true,
        },
      ],
    },

    // Color Ranges Section
    {
      type: 'section',
      title: 'Color Ranges',
      description: 'Define color coding for different temperature ranges',
      icon: <Palette className="w-4 h-4" />,
      fields: [
        {
          key: 'props.colorRanges.0.min',
          type: 'number',
          label: 'Cold Range - Min (°C)',
          description: 'Minimum temperature for cold range',
          defaultValue: -10,
          step: 1,
        },
        {
          key: 'props.colorRanges.0.max',
          type: 'number',
          label: 'Cold Range - Max (°C)',
          description: 'Maximum temperature for cold range',
          defaultValue: 0,
          step: 1,
        },
        {
          key: 'props.colorRanges.0.color',
          type: 'text',
          label: 'Cold Range - Color',
          description: 'CSS color for cold temperatures',
          defaultValue: '#3b82f6',
          placeholder: '#3b82f6',
        },
        {
          key: 'props.colorRanges.1.min',
          type: 'number',
          label: 'Cool Range - Min (°C)',
          description: 'Minimum temperature for cool range',
          defaultValue: 0,
          step: 1,
        },
        {
          key: 'props.colorRanges.1.max',
          type: 'number',
          label: 'Cool Range - Max (°C)',
          description: 'Maximum temperature for cool range',
          defaultValue: 20,
          step: 1,
        },
        {
          key: 'props.colorRanges.1.color',
          type: 'text',
          label: 'Cool Range - Color',
          description: 'CSS color for cool temperatures',
          defaultValue: '#10b981',
          placeholder: '#10b981',
        },
        {
          key: 'props.colorRanges.2.min',
          type: 'number',
          label: 'Warm Range - Min (°C)',
          description: 'Minimum temperature for warm range',
          defaultValue: 20,
          step: 1,
        },
        {
          key: 'props.colorRanges.2.max',
          type: 'number',
          label: 'Warm Range - Max (°C)',
          description: 'Maximum temperature for warm range',
          defaultValue: 30,
          step: 1,
        },
        {
          key: 'props.colorRanges.2.color',
          type: 'text',
          label: 'Warm Range - Color',
          description: 'CSS color for warm temperatures',
          defaultValue: '#f59e0b',
          placeholder: '#f59e0b',
        },
        {
          key: 'props.colorRanges.3.min',
          type: 'number',
          label: 'Hot Range - Min (°C)',
          description: 'Minimum temperature for hot range',
          defaultValue: 30,
          step: 1,
        },
        {
          key: 'props.colorRanges.3.max',
          type: 'number',
          label: 'Hot Range - Max (°C)',
          description: 'Maximum temperature for hot range',
          defaultValue: 50,
          step: 1,
        },
        {
          key: 'props.colorRanges.3.color',
          type: 'text',
          label: 'Hot Range - Color',
          description: 'CSS color for hot temperatures',
          defaultValue: '#ef4444',
          placeholder: '#ef4444',
        },
      ],
    },
  ],
};

export default temperatureWidgetSettingsSchema;