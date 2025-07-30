import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { BaseWidget, useWidgetFirebase, DataTypeConverters } from "./BaseWidget";

interface SwitchWidgetProps {
	id: string;
	title?: string;
	checked?: boolean;
	editMode?: boolean;
	onSettings?: () => void;
	onDuplicate?: () => void;
	onDelete?: () => void;
	onCheckedChange?: (checked: boolean) => void;
	// Firebase configuration
	firebasePath?: string;
	dataType?: 'boolean' | 'number' | 'string' | 'object';
	updateInterval?: number;
}

export function SwitchWidget({
	id: _id,
	title = "Switch",
	checked = false,
	editMode = false,
	onSettings,
	onDuplicate,
	onDelete,
	onCheckedChange,
	firebasePath,
	dataType = 'boolean',
	updateInterval = 1000,
}: SwitchWidgetProps) {
	const [localChecked, setLocalChecked] = useState(checked);
	
	// Use the common Firebase functionality from BaseWidget
	const {
		firebaseValue,
		connectionStatus,
		firebaseError,
		connectFirebase,
		disconnectFirebase,
		shouldConnect,
	} = useWidgetFirebase({ firebasePath, dataType, editMode });

	// Connect/disconnect Firebase based on configuration
	useEffect(() => {
		if (shouldConnect) {
			connectFirebase();
		} else {
			disconnectFirebase();
		}
		
		return () => {
			disconnectFirebase();
		};
	}, [shouldConnect, connectFirebase, disconnectFirebase]);

	// Update local state when Firebase value changes
	useEffect(() => {
		if (firebaseValue !== null && firebaseValue !== undefined && connectionStatus === 'connected') {
			const booleanValue = DataTypeConverters.toBoolean(firebaseValue, dataType);
			setLocalChecked(booleanValue);
		} else {
			// Fallback to prop value when Firebase is not connected
			setLocalChecked(checked);
		}
	}, [firebaseValue, checked, dataType, connectionStatus]);

	// Handle switch toggle
	const handleCheckedChange = (newChecked: boolean) => {
		if (editMode) return;
		
		// Update local state immediately for responsive UI
		setLocalChecked(newChecked);
		
		// Call the original callback
		onCheckedChange?.(newChecked);
	};

	return (
		<BaseWidget
			editMode={editMode}
			onSettings={onSettings}
			onDuplicate={onDuplicate}
			onDelete={onDelete}
			firebasePath={firebasePath}
			connectionStatus={connectionStatus}
			firebaseError={firebaseError}
		>
			<div className="flex-1 flex flex-col justify-center items-center space-y-3">
				<h3 className="text-sm font-medium text-center">{title}</h3>
				
				<div className="flex items-center space-x-3">
					<Switch
						checked={localChecked}
						onCheckedChange={handleCheckedChange}
						disabled={editMode}
						className="scale-125"
					/>
					<span className={`text-sm font-semibold ${localChecked ? 'text-green-600' : 'text-muted-foreground'}`}>
						{localChecked ? "ON" : "OFF"}
					</span>
				</div>
			</div>
		</BaseWidget>
	);
}
