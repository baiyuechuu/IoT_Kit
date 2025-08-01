import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import Control from "../control/Control";
import { useFirebaseVariable } from "@/hooks/useFirebase";

export interface BaseWidgetProps {
  id: string;
  title?: string;
  editMode?: boolean;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  // Firebase configuration (common to all widgets)
  firebasePath?: string;
  dataType?: 'boolean' | 'number' | 'string' | 'object';
  updateInterval?: number;
}

/**
 * Hook for common Firebase functionality across widgets
 */
export function useWidgetFirebase(props: Pick<BaseWidgetProps, 'firebasePath' | 'dataType' | 'editMode'>) {
  const { firebasePath, dataType = 'string', editMode } = props;
  
  const {
    value: firebaseValue,
    connected: firebaseConnected,
    loading: firebaseLoading,
    error: firebaseError,
    connect: connectFirebase,
    disconnect: disconnectFirebase,
  } = useFirebaseVariable({
    variablePath: firebasePath,
    variableType: dataType,
    autoConnect: false,
  });

  // Determine connection status
  const getConnectionStatus = (): 'disconnected' | 'connecting' | 'connected' | 'error' => {
    if (!firebasePath) return 'disconnected';
    if (firebaseLoading) return 'connecting';
    if (firebaseError) return 'error';
    if (firebaseConnected) return 'connected';
    return 'disconnected';
  };

  const connectionStatus = getConnectionStatus();

  return {
    firebaseValue,
    connectionStatus,
    firebaseError,
    connectFirebase,
    disconnectFirebase,
    isFirebaseConfigured: !!firebasePath,
    shouldConnect: firebasePath && !editMode,
  };
}

/**
 * Firebase connection indicator component
 */
export function FirebaseIndicator({ 
  status, 
  error, 
  firebasePath 
}: { 
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  error?: string | null;
  firebasePath?: string;
}) {
  if (!firebasePath) return null;

  const getColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500 animate-pulse';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="absolute top-2 right-2 z-10">
      <div 
        className={`w-2 h-2 rounded-full ${getColor()}`}
        title={`Firebase: ${status}${error ? ` - ${error}` : ''}`}
      />
    </div>
  );
}

/**
 * Base widget wrapper component
 */
export function BaseWidget({ 
  children, 
  editMode, 
  onSettings, 
  onDuplicate, 
  onDelete,
  firebasePath,
  connectionStatus,
  firebaseError,
  className = ""
}: {
  children: ReactNode;
  editMode?: boolean;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  firebasePath?: string;
  connectionStatus?: 'disconnected' | 'connecting' | 'connected' | 'error';
  firebaseError?: string | null;
  className?: string;
}) {
  return (
    <Card className={`p-3 h-full flex flex-col relative group ${className}`}>
      {editMode && (
        <Control
          onSettings={onSettings}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      )}
      
      <FirebaseIndicator 
        status={connectionStatus || 'disconnected'}
        error={firebaseError}
        firebasePath={firebasePath}
      />
      
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </Card>
  );
}

/**
 * Data type conversion utilities
 */
export const DataTypeConverters = {
  toBoolean: (value: any, dataType: string): boolean => {
    if (value === null || value === undefined) return false;
    
    switch (dataType) {
      case 'boolean': return Boolean(value);
      case 'number': return Number(value) > 0;
      case 'string': return String(value).toLowerCase() === 'true' || String(value) === '1';
      case 'object': return value?.state || value?.value || false;
      default: return Boolean(value);
    }
  },

  toNumber: (value: any): number => {
    return Number(value) || 0;
  },

  toString: (value: any): string => {
    return String(value || '');
  }
};
