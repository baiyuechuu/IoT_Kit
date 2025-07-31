import React, { useEffect } from 'react';
import { BaseWidget, useWidgetFirebase, DataTypeConverters } from './BaseWidget';
import type { HumidityWidgetConfig, CommonWidgetProps } from './types';
import { TrendingUp, TrendingDown, Minus, Droplets } from 'lucide-react';

interface HumidityWidgetProps extends CommonWidgetProps {
  config: HumidityWidgetConfig;
}

export function HumidityWidget({ 
  config, 
  editMode, 
  onConfigChange,
  onError,
  ...props 
}: HumidityWidgetProps) {
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

  // Convert Firebase value to humidity
  const humidity = React.useMemo(() => {
    if (firebaseValue === null || firebaseValue === undefined) return null;
    return DataTypeConverters.toNumber(firebaseValue);
  }, [firebaseValue]);

  // Get humidity color and status
  const getHumidityStatus = (humidity: number | null) => {
    if (humidity === null) return { color: 'text-gray-400', status: 'Unknown', bgColor: 'bg-gray-100' };
    
    const { showComfortZone, comfortRange } = widgetProps || {};
    const defaultComfortRange = { min: 30, max: 60 };
    const range = comfortRange || defaultComfortRange;
    
    if (showComfortZone !== false) {
      if (humidity < range.min) {
        return { 
          color: 'text-orange-600', 
          status: 'Too Dry', 
          bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100' 
        };
      } else if (humidity > range.max) {
        return { 
          color: 'text-blue-600', 
          status: 'Too Humid', 
          bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100' 
        };
      } else {
        return { 
          color: 'text-green-600', 
          status: 'Comfortable', 
          bgColor: 'bg-gradient-to-br from-green-50 to-green-100' 
        };
      }
    }
    
    // Default blue theme when comfort zone is disabled
    return { 
      color: 'text-blue-600', 
      status: 'Normal', 
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100' 
    };
  };

  // Mock trend calculation (in real implementation, this would compare with previous values)
  const getTrend = () => {
    // This would typically compare current value with historical data
    // For now, returning neutral trend
    return 'neutral' as 'up' | 'down' | 'neutral';
  };

  const precision = widgetProps?.precision || 1;
  const showTrend = widgetProps?.showTrend !== false;
  const trend = getTrend();
  const humidityStatus = getHumidityStatus(humidity);

  const formatHumidity = (humidity: number | null) => {
    if (humidity === null) return '--';
    return humidity.toFixed(precision);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-orange-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  // Humidity level visualization
  const getHumidityBars = (humidity: number | null) => {
    if (humidity === null) return Array(5).fill('bg-gray-200');
    
    const level = Math.min(Math.floor(humidity / 20), 4);
    return Array(5).fill(0).map((_, index) => 
      index <= level ? 'bg-blue-500' : 'bg-gray-200'
    );
  };

  return (
    <BaseWidget
      editMode={editMode}
      onSettings={props.onSettings}
      onDuplicate={props.onDuplicate}
      onDelete={props.onDelete}
      firebasePath={firebaseConfig?.path}
      connectionStatus={connectionStatus}
      firebaseError={firebaseError}
      className={humidityStatus.bgColor}
    >
      <div className="flex flex-col items-center justify-center h-full space-y-2">
        {/* Title */}
        {config.title && (
          <h3 className="text-sm font-medium text-gray-700 text-center">
            {config.title}
          </h3>
        )}

        {/* Humidity Icon */}
        <div className="flex items-center justify-center">
          <Droplets className={`w-6 h-6 ${humidityStatus.color}`} />
        </div>

        {/* Humidity Display */}
        <div className="flex items-center space-x-2">
          <span className={`text-2xl font-bold ${humidityStatus.color}`}>
            {formatHumidity(humidity)}
          </span>
          <span className="text-lg font-medium text-gray-600">%</span>
          {showTrend && (
            <div className="ml-1">
              {getTrendIcon(trend)}
            </div>
          )}
        </div>

        {/* Humidity Level Bars */}
        <div className="flex space-x-1">
          {getHumidityBars(humidity).map((bgColor, index) => (
            <div 
              key={index} 
              className={`w-2 h-4 rounded ${bgColor}`}
            />
          ))}
        </div>

        {/* Comfort Status */}
        {widgetProps?.showComfortZone !== false && (
          <div className={`text-xs font-medium ${humidityStatus.color}`}>
            {humidityStatus.status}
          </div>
        )}

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

export default HumidityWidget;