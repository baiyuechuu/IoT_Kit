import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Control from "../control/Control";
import { useFirebaseVariable } from "@/hooks/useFirebase";
import type { WidgetProps } from "../core/types";
import { TbDroplet } from "react-icons/tb";

export function HumidityWidget({
	config,
	editMode,
	onSettings,
	onDuplicate,
	onDelete,
	className = "",
}: WidgetProps) {
	const { firebasePath, props: widgetProps } = config;

	// State for humidity unit toggle
	const [displayUnit, setDisplayUnit] = useState<"percentage" | "decimal">(
		widgetProps?.unit || "percentage",
	);

	// Firebase integration
	const {
		value: firebaseValue,
		loading: firebaseLoading,
		error: firebaseError,
	} = useFirebaseVariable({
		variablePath: firebasePath,
		variableType: "number",
		autoConnect: !editMode && !!firebasePath,
	});

	// Auto-connect when configured and not in edit mode
	useEffect(() => {
		// Firebase connection is handled automatically by useFirebaseVariable
	}, [editMode, firebasePath]);

	// Convert Firebase value to humidity
	const humidity = React.useMemo(() => {
		if (firebaseValue === null || firebaseValue === undefined) {
			return null;
		}
		const converted = Number(firebaseValue);
		return isNaN(converted) ? null : converted;
	}, [firebaseValue]);

	// Humidity conversion
	const convertHumidity = (
		hum: number | null,
		unit: "percentage" | "decimal",
	) => {
		if (hum === null) {
			return null;
		}
		if (unit === "percentage") {
			// If the value is already in percentage (0-100), return as is
			// If the value is in decimal (0-1), convert to percentage
			return hum <= 1 ? hum * 100 : hum;
		}
		// Convert to decimal (0-1)
		return hum > 1 ? hum / 100 : hum;
	};

	// Toggle humidity unit
	const toggleUnit = () => {
		setDisplayUnit((prev) => (prev === "percentage" ? "decimal" : "percentage"));
	};

	// Get background gradient based on humidity ranges
	const getBackgroundGradient = (hum: number | null) => {
		if (hum === null) {
			return "bg-gradient-to-br from-gray-50 to-gray-100";
		}
		return getFallbackBackgroundGradient(hum);
	};

	// Get inline style for background gradient
	const getBackgroundStyle = (hum: number | null) => {
		if (hum === null) {
			return {};
		}
		return {};
	};

	// Fallback background gradient system
	const getFallbackBackgroundGradient = (hum: number) => {
		if (hum < 30) {
			return "bg-gradient-to-r from-orange-300 to-red-400";
		} else if (hum < 50) {
			return "bg-gradient-to-r from-yellow-300 to-orange-300";
		} else if (hum < 70) {
			return "bg-gradient-to-r from-blue-300 to-cyan-300";
		} else if (hum < 90) {
			return "bg-gradient-to-r from-cyan-300 to-blue-400";
		} else {
			return "bg-gradient-to-r from-blue-400 to-indigo-500";
		}
	};

	const displayHumidity = convertHumidity(humidity, displayUnit);
	const originalHumidity = humidity; // Keep original for color calculation
	const precision = widgetProps?.precision || 1;

	const formatHumidity = (hum: number | null) => {
		if (hum === null) {
			return "--";
		}
		const formatted = hum.toFixed(precision);
		return formatted;
	};

	const backgroundGradient = getBackgroundGradient(originalHumidity);
	const backgroundStyle = getBackgroundStyle(originalHumidity);
	const formattedHumidity = formatHumidity(displayHumidity);

	return (
		<Card
			className={`p-3 h-full flex flex-col relative group ${backgroundGradient || ""} ${className}`}
			style={backgroundGradient === null ? backgroundStyle : {}}
		>
			{editMode && <Control onSettings={onSettings} onDuplicate={onDuplicate} onDelete={onDelete} />}

			<div className="flex flex-col items-center justify-center h-full space-y-2">
				{/* Title */}
				{config.title && (
					<h3 className="text-sm font-medium text-gray-700 text-center absolute top-2 left-4">
						{config.title}
					</h3>
				)}

				<div className="flex items-center justify-center absolute bottom-2 right-1">
					<TbDroplet className={`w-10 h-10 text-black`} />
				</div>

				{/* Humidity Display */}
				<div className="flex items-end space-x-2 absolute bottom-1 left-4">
					<span className={`text-6xl font-bold text-black`}>
						{formattedHumidity}
					</span>
					<span className="text-3xl font-medium mb-1 text-gray-600">
						{displayUnit === "percentage" ? "%" : ""}
					</span>
				</div>

				{/* Unit Toggle Button */}
				<Button
					variant="outline"
					size="sm"
				onClick={toggleUnit}
					className="absolute top-2 right-2 text-xs px-2 py-1 h-6 bg-white/10 backdrop-blur-sm text-gray-700 border-gray-100/30"
				>
					{displayUnit === "percentage" ? "%" : "0-1"}
				</Button>

				{/* Status Indicator */}
				{!firebasePath && (
					<div className="text-xs text-gray-500 text-center">
						No Firebase path configured
					</div>
				)}

				{firebaseError && (
					<div className="text-xs text-red-500 text-center">
						Connection error: {firebaseError}
					</div>
				)}

				{firebaseLoading && (
					<div className="text-xs text-yellow-600 text-center">
						Connecting...
					</div>
				)}
			</div>
		</Card>
	);
}

export default HumidityWidget; 
