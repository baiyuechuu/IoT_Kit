import { Droplets, Database, Settings } from 'lucide-react';
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
    {
      key: 'description',
      type: 'textarea',
      label: 'Description',
      description: 'Optional description for the widget',
      placeholder: 'Humidity sensor monitoring...',
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
          key: 'firebaseConfig.path',
          type: 'text',
          label: 'Firebase Path',
          description: 'Path to humidity data in Firebase (e.g., /sensors/humidity)',
          defaultValue: '/sensors/humidity',
          required: true,
          placeholder: '/sensors/humidity',
        },
        {
          key: 'firebaseConfig.updateInterval',
          type: 'number',
          label: 'Update Interval (ms)',
          description: 'How often to fetch new data from Firebase',
          defaultValue: 1000,
          min: 100,
          max: 60000,
          step: 100,
        },
        {
          key: 'firebaseConfig.enabled',
          type: 'boolean',
          label: 'Enable Firebase Connection',
          description: 'Connect to Firebase automatically when not in edit mode',
          defaultValue: true,
        },
      ],
    },

    // Humidity Display Section
    {
      type: 'section',
      title: 'Humidity Display',
      description: 'Configure how humidity is displayed',
      icon: <Droplets className="w-4 h-4" />,
      fields: [
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
          description: 'Display up/down arrows for humidity trends',
          defaultValue: true,
        },
      ],
    },

    // Comfort Zone Section
    {
      type: 'section',
      title: 'Comfort Zone Settings',
      description: 'Configure humidity comfort zone indicators',
      icon: <Settings className="w-4 h-4" />,
      fields: [
        {
          key: 'props.showComfortZone',
          type: 'boolean',
          label: 'Show Comfort Zone',
          description: 'Display comfort zone indicators and status',
          defaultValue: true,
        },
        {
          key: 'props.comfortRange.min',
          type: 'number',
          label: 'Comfort Zone - Minimum (%)',
          description: 'Minimum humidity percentage for comfort',
          defaultValue: 30,
          min: 0,
          max: 100,
          step: 1,
        },
        {
          key: 'props.comfortRange.max',
          type: 'number',
          label: 'Comfort Zone - Maximum (%)',
          description: 'Maximum humidity percentage for comfort',
          defaultValue: 60,
          min: 0,
          max: 100,
          step: 1,
        },
      ],
    },
  ],
};

export default humidityWidgetSettingsSchema;