import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Control from "../control/Control";
import { useFirebaseSensors } from "@/hooks/useFirebaseSensors";
import type { WidgetProps } from "../core/types";
import { TbDroplet } from "react-icons/tb";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FaSquare } from "react-icons/fa6";

// Define chart data point interface
interface ChartDataPoint {
	time: string;
	[sensorId: string]: string | number;
}

// Color palette for three sensors
const LINE_COLORS = [
	'#3B82F6', // Blue
	'#EF4444', // Red
	'#10B981', // Green
];

export function HumidityChartWidget({
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

	// State for time-based chart data
	const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
	const [maxDataPoints, setMaxDataPoints] = useState(widgetProps?.maxDataPoints || 11);
	const lastUpdateRef = useRef<{ [sensorId: string]: number }>({});

	// Get chart settings from props
	const chartHeight = widgetProps?.chartHeight || 200;
	const showDots = widgetProps?.showDots !== false; // Default to true
	const showLegend = widgetProps?.showLegend !== false; // Default to true
	const selectedSensors = widgetProps?.selectedSensors || ['sensor1', 'sensor2', 'sensor3']; // Support three sensors

	// Firebase integration for three sensors
	const {
		data: sensorData,
		sensorIds,
		loading: firebaseLoading,
		error: firebaseError,
		connected: firebaseConnected,
		getSensorValue,
		getSensorValuesArray,
	} = useFirebaseSensors({
		sensorType: 'humidity',
		autoConnect: !editMode,
	});

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

	// Update chart data when sensor values change
	useEffect(() => {
		if (!firebaseConnected || !sensorIds.length) return;

		const now = new Date();
		const timeString = now.toLocaleTimeString('en-US', { 
			hour12: false, 
			hour: '2-digit', 
			minute: '2-digit', 
			second: '2-digit' 
		});

		// Check if any sensor data has changed
		let hasChanges = false;
		const newDataPoint: ChartDataPoint = { time: timeString };

		selectedSensors.forEach((sensorId: string, index: number) => {
			const currentValue = getSensorValue(sensorId);
			const lastValue = lastUpdateRef.current[sensorId];
			
			if (currentValue !== null && currentValue !== lastValue) {
				hasChanges = true;
				lastUpdateRef.current[sensorId] = currentValue;
			}
			
			if (currentValue !== null) {
				// Store raw value, let tooltip handle conversion
				newDataPoint[sensorId] = currentValue;
			}
		});

		// Only update chart if there are changes
		if (hasChanges) {
			setChartData(prevData => {
				const newData = [...prevData, newDataPoint];
				// Keep only the last maxDataPoints
				if (newData.length > maxDataPoints) {
					return newData.slice(-maxDataPoints);
				}
				return newData;
			});
		}
	}, [sensorData, selectedSensors, firebaseConnected, sensorIds, getSensorValue, maxDataPoints]);

	// Convert chart data to display unit
	const convertedChartData = React.useMemo(() => {
		return chartData.map(item => {
			const convertedItem: ChartDataPoint = { time: item.time };
			selectedSensors.forEach((sensorId: string) => {
				if (item[sensorId] !== undefined) {
					// Store the raw value, let tooltip handle conversion
					convertedItem[sensorId] = item[sensorId];
				}
			});
			return convertedItem;
		});
	}, [chartData, selectedSensors]);

	// Simple theme-based background
	const backgroundClass = "bg-background";

	// Custom tooltip for the chart
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			// Format the time for better display
			const timeDisplay = label || "Unknown time";
			
			return (
				<div className="bg-background border border-border rounded shadow-lg p-2">
					<p className="text-sm font-medium text-foreground">{`Time: ${timeDisplay}`}</p>
					{payload.map((entry: any, index: number) => {
						// Convert the value based on current display unit
						const rawValue = entry.payload[entry.dataKey];
						const convertedValue = convertHumidity(rawValue, displayUnit);
						
						return (
							<div key={index} className="flex items-center gap-2 text-sm" style={{ color: entry.color }}>
								<FaSquare className="w-4 h-4" />
								<span className="text-foreground">
									{convertedValue !== null ? `${convertedValue}${displayUnit === "percentage" ? "%" : ""}` : "N/A"}
								</span>
							</div>
						);
					})}
				</div>
			);
		}
		return null;
	};

	// Get current values for display
	const currentValues = React.useMemo(() => {
		const values: { [sensorId: string]: number | null } = {};
		selectedSensors.forEach((sensorId: string) => {
			const value = getSensorValue(sensorId);
			values[sensorId] = value !== null ? convertHumidity(value, displayUnit) : null;
		});
		return values;
	}, [getSensorValue, selectedSensors, displayUnit]);

	return (
		<Card
			className={`p-3 h-full flex flex-col relative group ${backgroundClass} ${className}`}
		>
			{editMode && <Control onSettings={onSettings} onDuplicate={onDuplicate} onDelete={onDelete} />}

			<div className="flex flex-col h-full">
				{/* Header */}
				<div className="flex items-center justify-between mb-2">
					{/* Title */}
					{config.title && (
						<h3 className="text-sm font-medium text-foreground">
							{config.title}
						</h3>
					)}

					{/* Unit Toggle Button */}
					<Button
						variant="outline"
						size="sm"
						onClick={toggleUnit}
						className="text-xs px-2 py-1 h-6"
					>
						{displayUnit === "percentage" ? "%" : "0-1"}
					</Button>
				</div>

				{/* Chart */}
				<div className="flex-1 min-h-0" style={{ height: chartHeight }}>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={convertedChartData}>
							<XAxis 
								dataKey="time" 
								tickLine={false}
								axisLine={false}
								tick={{ fontSize: 14 }}
							/>
							<Tooltip content={<CustomTooltip />} />
							{showLegend && <Legend />}
							{selectedSensors.map((sensorId: string, index: number) => (
								<Line 
									key={sensorId}
									type="monotone" 
									dataKey={sensorId} 
									stroke={LINE_COLORS[index % LINE_COLORS.length]} 
									strokeWidth={2}
									dot={showDots ? { fill: LINE_COLORS[index % LINE_COLORS.length], strokeWidth: 2, r: 4 } : undefined}
									activeDot={showDots ? { r: 6, stroke: LINE_COLORS[index % LINE_COLORS.length], strokeWidth: 2, fill: LINE_COLORS[index % LINE_COLORS.length] } : undefined}
									name={sensorId}
								/>
							))}
						</LineChart>
					</ResponsiveContainer>
				</div>

				{/* Status Indicator */}
				{!firebaseConnected && !firebaseLoading && (
					<div className="text-xs text-gray-500 text-center mt-2">
						No Firebase connection
					</div>
				)}

				{firebaseError && (
					<div className="text-xs text-red-500 text-center mt-2">
						Connection error: {firebaseError}
					</div>
				)}

				{firebaseLoading && (
					<div className="text-xs text-yellow-600 text-center mt-2">
						Connecting to sensors...
					</div>
				)}

				{firebaseConnected && chartData.length === 0 && (
					<div className="text-xs text-gray-500 text-center mt-2">
						No humidity sensors found
					</div>
				)}
			</div>
		</Card>
	);
}

export default HumidityChartWidget; 
