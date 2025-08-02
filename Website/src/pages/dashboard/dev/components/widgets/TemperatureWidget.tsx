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

  // Auto-connect when configured and not in edit mode
  useEffect(() => {


    if (shouldConnect && isFirebaseConfigured) {
      connectFirebase();
    } else if (editMode) {
      disconnectFirebase();
    }
  }, [shouldConnect, isFirebaseConfigured, editMode, connectFirebase, disconnectFirebase]);

  // Handle Firebase errors
  useEffect(() => {
    if (firebaseError && onError) {
      onError(firebaseError);
    }
  }, [firebaseError, onError]);

  // Convert Firebase value to temperature
  const temperature = React.useMemo(() => {
    if (firebaseValue === null || firebaseValue === undefined) {
      return null;
    }
    const converted = DataTypeConverters.toNumber(firebaseValue);
    return converted;
  }, [firebaseValue]);

  // Temperature conversion
  const convertTemperature = (temp: number | null, unit: 'celsius' | 'fahrenheit') => {
    if (temp === null) {
      return null;
    }
    if (unit === 'fahrenheit') {
      const fahrenheit = (temp * 9/5) + 32;
      return fahrenheit;
    }
    return temp;
  };

  // Get temperature color based on ranges
  const getTemperatureColor = (temp: number | null) => {
    if (temp === null) {
      return 'text-gray-400';
    }
    
    // Try to get colorRanges from multiple sources
    const colorRanges = widgetProps?.colorRanges || config.props?.colorRanges;

    if (!colorRanges || !Array.isArray(colorRanges) || colorRanges.length === 0) {
      return getFallbackTemperatureColor(temp);
    }
    
    for (let i = 0; i < colorRanges.length; i++) {
      const range = colorRanges[i];
      
      if (range && typeof range === 'object' && typeof range.min === 'number' && typeof range.max === 'number' && range.color) {
        if (temp >= range.min && temp <= range.max) {
          const colorClass = `text-[${range.color}]`;
          return colorClass;
        }
      }
    }
    return getFallbackTemperatureColor(temp);
  };

  // Fallback color system based on temperature ranges
  const getFallbackTemperatureColor = (temp: number) => {
    if (temp < 0) {
      return 'text-blue-600';
    } else if (temp < 15) {
      return 'text-cyan-600';
    } else if (temp < 25) {
      return 'text-green-600';
    } else if (temp < 35) {
      return 'text-yellow-600';
    } else {
      return 'text-red-600';
    }
  };

  // Mock trend calculation (in real implementation, this would compare with previous values)
  const getTrend = () => {
    // This would typically compare current value with historical data
    // For now, returning neutral trend
    return 'neutral' as 'up' | 'down' | 'neutral';
  };

  const displayTemperature = convertTemperature(temperature, widgetProps?.unit || 'celsius');
  const unit = widgetProps?.unit || 'celsius';
  const precision = widgetProps?.precision || 1;
  const showTrend = widgetProps?.showTrend !== false;
  const trend = getTrend();

  const formatTemperature = (temp: number | null) => {
    if (temp === null) {
      return '--';
    }
    const formatted = temp.toFixed(precision);
    return formatted;
  };

  const getUnitSymbol = (unit: 'celsius' | 'fahrenheit') => {
    const symbol = unit === 'celsius' ? '°C' : '°F';
    return symbol;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
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