import type { WidgetSettingsSchema } from './WidgetSettingsFramework';
import { Database } from 'lucide-react';

export function getSwitchWidgetSettingsSchema(): WidgetSettingsSchema {
  return {
    sections: [
      // Basic settings
      {
        type: 'text',
        key: 'title',
        label: 'Switch Title',
        description: 'Display name for the switch widget',
        placeholder: 'Enter switch title',
        required: true,
        defaultValue: 'Switch',
      },
      {
        type: 'select',
        key: 'variant',
        label: 'Visual Style',
        description: 'Choose the visual appearance of the switch',
        defaultValue: 'default',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'outline', label: 'Outline' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'destructive', label: 'Destructive' },
        ],
      },
      
      // Firebase configuration section
      {
        type: 'section',
        title: 'Firebase Data Source',
        description: 'Configure Firebase connection for real-time data',
        icon: <Database className="w-4 h-4 text-muted-foreground" />,
        fields: [
          {
            type: 'text',
            key: 'firebasePath',
            label: 'Variable Path',
            description: 'Path to the Firebase variable (e.g., sensors/temperature, devices/light1/status)',
            placeholder: 'e.g., devices/switch1/state',
          },
          {
            type: 'select',
            key: 'dataType',
            label: 'Data Type',
            description: 'Expected data type for the Firebase variable',
            defaultValue: 'boolean',
            options: [
              { value: 'boolean', label: 'Boolean (true/false)' },
              { value: 'number', label: 'Number' },
              { value: 'string', label: 'String' },
              { value: 'object', label: 'Object' },
            ],
          },
          {
            type: 'number',
            key: 'updateInterval',
            label: 'Update Interval (ms)',
            description: 'How often to check for updates (100ms - 60s)',
            defaultValue: 1000,
            min: 100,
            max: 60000,
            placeholder: '1000',
          },
        ],
      },
    ],
  };
}