import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Control from "../control/Control";
import { useFirebaseVariable } from "@/hooks/useFirebase";
import type { WidgetProps } from "../core/types";
import { CiTempHigh } from "react-icons/ci";
import { TbTemperatureCelsius } from "react-icons/tb";
import { TbTemperatureFahrenheit } from "react-icons/tb";

export function TemperatureWidget({
	config,
	editMode,
	onSettings,
	onDuplicate,
	onDelete,
	className = "",
}: WidgetProps) {
	const { firebasePath, props: widgetProps } = config;

	// State for temperature unit toggle
	const [displayUnit, setDisplayUnit] = useState<"celsius" | "fahrenheit">(
		widgetProps?.unit || "celsius",
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

	// Convert Firebase value to temperature
	const temperature = React.useMemo(() => {
		if (firebaseValue === null || firebaseValue === undefined) {
			return null;
		}
		const converted = Number(firebaseValue);
		return isNaN(converted) ? null : converted;
	}, [firebaseValue]);

	// Temperature conversion
	const convertTemperature = (
		temp: number | null,
		unit: "celsius" | "fahrenheit",
	) => {
		if (temp === null) {
			return null;
		}
		if (unit === "fahrenheit") {
			const fahrenheit = (temp * 9) / 5 + 32;
			return fahrenheit;
		}
		return temp;
	};

	// Toggle temperature unit
	const toggleUnit = () => {
		setDisplayUnit((prev) => (prev === "celsius" ? "fahrenheit" : "celsius"));
	};

	// Get background gradient based on temperature ranges
	const getBackgroundGradient = (temp: number | null) => {
		if (temp === null) {
			return "bg-gradient-to-br from-gray-50 to-gray-100";
		}
		return getFallbackBackgroundGradient(temp);
	};

	// Get inline style for background gradient
	const getBackgroundStyle = (temp: number | null) => {
		if (temp === null) {
			return {};
		}
		return {};
	};

	// Fallback background gradient system
	const getFallbackBackgroundGradient = (temp: number) => {
		if (temp < 0) {
			return "bg-gradient-to-r from-sky-400 to-blue-500";
		} else if (temp < 15) {
			return "bg-gradient-to-r from-sky-400 to-cyan-300";
		} else if (temp < 25) {
			return "bg-gradient-to-r from-blue-400 to-emerald-400";
		} else if (temp < 35) {
			return "bg-gradient-to-r from-orange-300 to-rose-300";
		} else {
			return "bg-gradient-to-r from-orange-400 to-rose-400";
		}
	};

	const displayTemperature = convertTemperature(temperature, displayUnit);
	const originalTemperature = temperature; // Keep original Celsius for color calculation
	const precision = widgetProps?.precision || 1;

	const formatTemperature = (temp: number | null) => {
		if (temp === null) {
			return "--";
		}
		const formatted = temp.toFixed(precision);
		return formatted;
	};



	const backgroundGradient = getBackgroundGradient(originalTemperature);
	const backgroundStyle = getBackgroundStyle(originalTemperature);
	const formattedTemperature = formatTemperature(displayTemperature);

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
					<CiTempHigh className={`w-10 h-10 text-black`} />
				</div>

				{/* Temperature Display */}
				<div className="flex items-start space-x-2 absolute bottom-1 left-4">
					<span className={`text-6xl font-bold text-black`}>
						{formattedTemperature}
					</span>
					<span className="font-medium text-gray-600 -ml-2">
						{displayUnit === "celsius" ? (
							<TbTemperatureCelsius size={50} />
						) : (
							<TbTemperatureFahrenheit size={50}/>
						)}
					</span>
				</div>

				{/* Unit Toggle Button */}
				<Button
					variant="outline"
					size="sm"
					onClick={toggleUnit}
					className="absolute top-2 right-2 text-xs px-2 py-1 h-6 bg-white/10 backdrop-blur-sm text-gray-700 border-gray-100/30"
				>
					{displayUnit === "celsius" ? "°F" : "°C"}
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

export default TemperatureWidget;

