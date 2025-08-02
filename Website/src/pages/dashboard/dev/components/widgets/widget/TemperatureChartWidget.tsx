import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Control from "../control/Control";
import { useFirebaseSensors } from "@/hooks/useFirebaseSensors";
import type { WidgetProps } from "../core/types";
import {
	LineChart,
	Line,
	XAxis,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import { FaSquare } from "react-icons/fa6";

// Define chart data point interface
interface ChartDataPoint {
	time: string;
	[sensorId: string]: string | number;
}

// Color palette for three sensors
const LINE_COLORS = [
	"#3B82F6", // Blue
	"#EF4444", // Red
	"#10B981", // Green
];

export function TemperatureChartWidget({
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

	// State for time-based chart data
	const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
	const [maxDataPoints, setMaxDataPoints] = useState(
		widgetProps?.maxDataPoints || 11,
	);
	const lastUpdateRef = useRef<{ [sensorId: string]: number }>({});

	// Get chart settings from props
	const chartHeight = widgetProps?.chartHeight || 200;
	const showDots = widgetProps?.showDots !== false; // Default to true
	const showLegend = widgetProps?.showLegend !== false; // Default to true
	const selectedSensors = widgetProps?.selectedSensors || [
		"sensor1",
		"sensor2",
		"sensor3",
	]; // Support three sensors

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
		sensorType: "temperature",
		autoConnect: !editMode,
	});

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

	// Update chart data when sensor values change
	useEffect(() => {
		if (!firebaseConnected || !sensorIds.length) return;

		const now = new Date();
		const timeString = now.toLocaleTimeString("en-US", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
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
			setChartData((prevData) => {
				const newData = [...prevData, newDataPoint];
				// Keep only the last maxDataPoints
				if (newData.length > maxDataPoints) {
					return newData.slice(-maxDataPoints);
				}
				return newData;
			});
		}
	}, [
		sensorData,
		selectedSensors,
		firebaseConnected,
		sensorIds,
		getSensorValue,
		maxDataPoints,
	]);

	// Convert chart data to display unit
	const convertedChartData = React.useMemo(() => {
		return chartData.map((item) => {
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
						const convertedValue = convertTemperature(rawValue, displayUnit);
						
						return (
							<div
								key={index}
								className="flex items-center gap-2 text-sm"
								style={{ color: entry.color }}
							>
								<FaSquare className="w-4 h-4" />
								<span className="text-foreground">
									{convertedValue !== null ? `${convertedValue}${displayUnit === "celsius" ? "°C" : "°F"}` : "N/A"}
								</span>
							</div>
						);
					})}
				</div>
			);
		}
		return null;
	};

	return (
		<Card
			className={`p-3 h-full flex flex-col relative group ${backgroundClass} ${className}`}
		>
			{editMode && (
				<Control
					onSettings={onSettings}
					onDuplicate={onDuplicate}
					onDelete={onDelete}
				/>
			)}

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
						{displayUnit === "celsius" ? "°F" : "°C"}
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
							{showLegend && (
								<Legend
									wrapperStyle={{ color: "hsl(var(--foreground))" }}
									formatter={(value, entry) => (
										<span style={{ color: "hsl(var(--foreground))" }}>
											{value}
										</span>
									)}
								/>
							)}
							{selectedSensors.map((sensorId: string, index: number) => (
								<Line
									key={sensorId}
									type="monotone"
									dataKey={sensorId}
									stroke={LINE_COLORS[index % LINE_COLORS.length]}
									strokeWidth={2}
									dot={
										showDots
											? {
													fill: LINE_COLORS[index % LINE_COLORS.length],
													strokeWidth: 2,
													r: 4,
												}
											: undefined
									}
									activeDot={
										showDots
											? {
													r: 6,
													stroke: LINE_COLORS[index % LINE_COLORS.length],
													strokeWidth: 2,
													fill: LINE_COLORS[index % LINE_COLORS.length],
												}
											: undefined
									}
									name={sensorId}
								/>
							))}
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</Card>
	);
}

export default TemperatureChartWidget;

