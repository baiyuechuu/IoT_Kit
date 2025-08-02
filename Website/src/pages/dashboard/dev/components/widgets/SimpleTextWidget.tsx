import React from 'react';
import { Card } from '@/components/ui/card';
import type { WidgetProps } from './core/types';
import Control from '../control/Control';

export function SimpleTextWidget({ config, editMode, onSettings, onDelete, className = "" }: WidgetProps) {
  const { title, props } = config;
  const text = props?.text || 'Hello World';
  const fontSize = props?.fontSize || 16;
  const textColor = props?.textColor || '#000000';

  return (
    <Card className={`p-4 h-full flex flex-col relative group ${className}`}>
      {editMode && (
        <Control
          onSettings={onSettings}
          onDelete={onDelete}
        />
      )}
      
      <div className="flex-1 flex items-center justify-center">
        <div 
          style={{ 
            fontSize: `${fontSize}px`, 
            color: textColor,
            textAlign: 'center'
          }}
        >
          {text}
        </div>
      </div>
    </Card>
  );
}

// Example of how to register this widget:
// import { registerWidget } from './core/registry';
// 
// registerWidget({
//   type: 'text',
//   name: 'Text',
//   description: 'Display custom text with styling',
//   component: SimpleTextWidget,
//   defaultProps: {
//     text: 'Hello World',
//     fontSize: 16,
//     textColor: '#000000'
//   }
// }); 