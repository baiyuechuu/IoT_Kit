import React, { useEffect } from 'react';
import { BaseWidget, useWidgetFirebase, DataTypeConverters } from './core/BaseWidget';
import type { TemperatureWidgetConfig, CommonWidgetProps } from './core/types';
import { TrendingUp, TrendingDown, Minus, Thermometer } from 'lucide-react';

interface TemperatureWidgetProps extends CommonWidgetProps {
  config: TemperatureWidgetConfig;
}

export function TemperatureWidget({ 
  config, 
  editMode, 
  onConfigChange,
  onError,
  ...props 
}: TemperatureWidgetProps) {
  console.log('🌡️ TemperatureWidget: Initializing with config:', {
    title: config.title,
    firebasePath: config.firebaseConfig?.path,
    dataType: config.firebaseConfig?.dataType,
    unit: config.props?.unit,
    precision: config.props?.precision,
    showTrend: config.props?.showTrend,
    editMode
  });

  const { firebaseConfig, props: widgetProps } = config;
  
  // Firebase integration
  const {
    firebaseValue,
    connectionStatus,
    firebaseError,
    connectFirebase,
    disconnectFirebase,
    shouldConnect,
    isFirebaseConfigured,
  } = useWidgetFirebase({
    firebasePath: firebaseConfig?.path,
    dataType: firebaseConfig?.dataType || 'number',
    editMode,
  });

  console.log('🌡️ TemperatureWidget: Firebase hook state:', {
    firebaseValue,
    connectionStatus,
    firebaseError,
    shouldConnect,
    isFirebaseConfigured
  });

  // Auto-connect when configured and not in edit mode
  useEffect(() => {
    console.log('🌡️ TemperatureWidget: Auto-connect effect triggered:', {
      shouldConnect,
      isFirebaseConfigured,
      editMode
    });

    if (shouldConnect && isFirebaseConfigured) {
      console.log('🌡️ TemperatureWidget: Connecting to Firebase...');
      connectFirebase();
    } else if (editMode) {
      console.log('🌡️ TemperatureWidget: Disconnecting in edit mode');
      disconnectFirebase();
    }
  }, [shouldConnect, isFirebaseConfigured, editMode, connectFirebase, disconnectFirebase]);

  // Handle Firebase errors
  useEffect(() => {
    if (firebaseError && onError) {
      console.error('🌡️ TemperatureWidget: Firebase error detected:', firebaseError);
      onError(firebaseError);
    }
  }, [firebaseError, onError]);

  // Convert Firebase value to temperature
  const temperature = React.useMemo(() => {
    console.log('🌡️ TemperatureWidget: Converting Firebase value:', firebaseValue);
    if (firebaseValue === null || firebaseValue === undefined) {
      console.log('🌡️ TemperatureWidget: Firebase value is null/undefined');
      return null;
    }
    const converted = DataTypeConverters.toNumber(firebaseValue);
    console.log('🌡️ TemperatureWidget: Converted temperature:', converted);
    return converted;
  }, [firebaseValue]);

  // Temperature conversion
  const convertTemperature = (temp: number | null, unit: 'celsius' | 'fahrenheit') => {
    console.log('🌡️ TemperatureWidget: Converting temperature:', { temp, unit });
    if (temp === null) {
      console.log('🌡️ TemperatureWidget: Temperature is null, returning null');
      return null;
    }
    if (unit === 'fahrenheit') {
      const fahrenheit = (temp * 9/5) + 32;
      console.log('🌡️ TemperatureWidget: Converted to Fahrenheit:', fahrenheit);
      return fahrenheit;
    }
    console.log('🌡️ TemperatureWidget: Keeping Celsius:', temp);
    return temp;
  };

  // Get temperature color based on ranges
  const getTemperatureColor = (temp: number | null) => {
    console.log('🌡️ TemperatureWidget: Getting color for temperature:', temp);
    console.log('🌡️ TemperatureWidget: Full config:', config);
    console.log('🌡️ TemperatureWidget: widgetProps:', widgetProps);
    console.log('🌡️ TemperatureWidget: config.props:', config.props);
    
    if (temp === null) {
      console.log('🌡️ TemperatureWidget: Temperature is null, using gray color');
      return 'text-gray-400';
    }
    
    // Try to get colorRanges from multiple sources
    const colorRanges = widgetProps?.colorRanges || config.props?.colorRanges;
    console.log('🌡️ TemperatureWidget: colorRanges from widgetProps:', widgetProps?.colorRanges);
    console.log('🌡️ TemperatureWidget: colorRanges from config.props:', config.props?.colorRanges);
    console.log('🌡️ TemperatureWidget: Final colorRanges:', colorRanges);
    console.log('🌡️ TemperatureWidget: colorRanges type:', typeof colorRanges);
    console.log('🌡️ TemperatureWidget: colorRanges isArray:', Array.isArray(colorRanges));
    
    if (!colorRanges || !Array.isArray(colorRanges) || colorRanges.length === 0) {
      console.log('🌡️ TemperatureWidget: No valid color ranges defined, using fallback colors');
      return getFallbackTemperatureColor(temp);
    }
    
    console.log('🌡️ TemperatureWidget: Checking color ranges:', colorRanges);
    for (let i = 0; i < colorRanges.length; i++) {
      const range = colorRanges[i];
      console.log(`🌡️ TemperatureWidget: Checking range ${i}:`, range);
      console.log(`🌡️ TemperatureWidget: Range ${i} type:`, typeof range);
      console.log(`🌡️ TemperatureWidget: Range ${i} keys:`, range ? Object.keys(range) : 'null');
      
      if (range && typeof range === 'object' && typeof range.min === 'number' && typeof range.max === 'number' && range.color) {
        console.log('🌡️ TemperatureWidget: Valid range found:', range);
        console.log('🌡️ TemperatureWidget: Temperature', temp, 'vs range', range.min, '-', range.max);
        if (temp >= range.min && temp <= range.max) {
          console.log('🌡️ TemperatureWidget: Found matching color range:', range);
          const colorClass = `text-[${range.color}]`;
          console.log('🌡️ TemperatureWidget: Using color class:', colorClass);
          return colorClass;
        }
      } else {
        console.warn('🌡️ TemperatureWidget: Invalid color range object:', range);
        console.warn('🌡️ TemperatureWidget: Range validation failed:', {
          isObject: range && typeof range === 'object',
          hasMin: range && typeof range.min === 'number',
          hasMax: range && typeof range.max === 'number',
          hasColor: range && range.color
        });
      }
    }
    console.log('🌡️ TemperatureWidget: No matching color range, using fallback');
    return getFallbackTemperatureColor(temp);
  };

  // Fallback color system based on temperature ranges
  const getFallbackTemperatureColor = (temp: number) => {
    console.log('🌡️ TemperatureWidget: Using fallback color for temperature:', temp);
    
    if (temp < 0) {
      console.log('🌡️ TemperatureWidget: Cold temperature (blue)');
      return 'text-blue-600';
    } else if (temp < 15) {
      console.log('🌡️ TemperatureWidget: Cool temperature (cyan)');
      return 'text-cyan-600';
    } else if (temp < 25) {
      console.log('🌡️ TemperatureWidget: Mild temperature (green)');
      return 'text-green-600';
    } else if (temp < 35) {
      console.log('🌡️ TemperatureWidget: Warm temperature (yellow)');
      return 'text-yellow-600';
    } else {
      console.log('🌡️ TemperatureWidget: Hot temperature (red)');
      return 'text-red-600';
    }
  };

  // Mock trend calculation (in real implementation, this would compare with previous values)
  const getTrend = () => {
    console.log('🌡️ TemperatureWidget: Calculating trend (mock implementation)');
    // This would typically compare current value with historical data
    // For now, returning neutral trend
    return 'neutral' as 'up' | 'down' | 'neutral';
  };

  const displayTemperature = convertTemperature(temperature, widgetProps?.unit || 'celsius');
  const unit = widgetProps?.unit || 'celsius';
  const precision = widgetProps?.precision || 1;
  const showTrend = widgetProps?.showTrend !== false;
  const trend = getTrend();

  console.log('🌡️ TemperatureWidget: Display values:', {
    displayTemperature,
    unit,
    precision,
    showTrend,
    trend
  });

  const formatTemperature = (temp: number | null) => {
    if (temp === null) {
      console.log('🌡️ TemperatureWidget: Formatting null temperature as "--"');
      return '--';
    }
    const formatted = temp.toFixed(precision);
    console.log('🌡️ TemperatureWidget: Formatted temperature:', formatted);
    return formatted;
  };

  const getUnitSymbol = (unit: 'celsius' | 'fahrenheit') => {
    const symbol = unit === 'celsius' ? '°C' : '°F';
    console.log('🌡️ TemperatureWidget: Unit symbol:', symbol);
    return symbol;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    console.log('🌡️ TemperatureWidget: Getting trend icon for:', trend);
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-blue-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const temperatureColor = getTemperatureColor(displayTemperature);
  const formattedTemperature = formatTemperature(displayTemperature);
  const unitSymbol = getUnitSymbol(unit);
  const trendIcon = getTrendIcon(trend);

  console.log('🌡️ TemperatureWidget: Final render values:', {
    temperatureColor,
    formattedTemperature,
    unitSymbol,
    showTrend,
    connectionStatus,
    isFirebaseConfigured
  });

  return (
    <BaseWidget
      editMode={editMode}
      onSettings={props.onSettings}
      onDuplicate={props.onDuplicate}
      onDelete={props.onDelete}
      firebasePath={firebaseConfig?.path}
      connectionStatus={connectionStatus}
      firebaseError={firebaseError}
      className="bg-gradient-to-br from-blue-50 to-blue-100"
    >
      <div className="flex flex-col items-center justify-center h-full space-y-2">
        {/* Title */}
        {config.title && (
          <h3 className="text-sm font-medium text-gray-700 text-center">
            {config.title}
          </h3>
        )}

        {/* Temperature Icon */}
        <div className="flex items-center justify-center">
          <Thermometer className={`w-6 h-6 ${temperatureColor}`} />
        </div>

        {/* Temperature Display */}
        <div className="flex items-center space-x-2">
          <span className={`text-2xl font-bold ${temperatureColor}`}>
            {formattedTemperature}
          </span>
          <span className="text-lg font-medium text-gray-600">
            {unitSymbol}
          </span>
          {showTrend && (
            <div className="ml-1">
              {trendIcon}
            </div>
          )}
        </div>

        {/* Status Indicator */}
        {!isFirebaseConfigured && (
          <div className="text-xs text-gray-500 text-center">
            No Firebase path configured
          </div>
        )}

        {connectionStatus === 'error' && (
          <div className="text-xs text-red-500 text-center">
            Connection error
          </div>
        )}

        {connectionStatus === 'connecting' && (
          <div className="text-xs text-yellow-600 text-center">
            Connecting...
          </div>
        )}
      </div>
    </BaseWidget>
  );
}

export default TemperatureWidget;