import Control from "../control/Control";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function ClockWidget({
	config,
	editMode,
	onSettings,
	onDuplicate,
	onDelete,
	className = "",
}: any) {
	// Get initial format from config, default to 24-hour
	const configFormat = config?.props?.format || "24-hour";
	const [format, setFormat] = useState(configFormat);
	const [currentTime, setCurrentTime] = useState(new Date());

	// Update time every second
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// Update format when config changes
	useEffect(() => {
		setFormat(config?.props?.format || "24-hour");
	}, [config?.props?.format]);

	const timeString =
		format === "12-hour"
			? currentTime
					.toLocaleTimeString("en-US", {
						hour12: true,
						hour: "2-digit",
						minute: "2-digit",
						second: "2-digit",
					})
					.replace(/\s?(AM|PM)$/i, "") // Remove AM/PM
			: currentTime.toLocaleTimeString("en-US", {
					hour12: false,
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				});

	return (
		<Card className={`p-3 h-full flex flex-col relative group ${className}`}>
			{editMode && (
				<Control
					onSettings={onSettings}
					onDuplicate={onDuplicate}
					onDelete={onDelete}
				/>
			)}

			<div className="flex-1 min-h-0 flex flex-col">
				{/* Format toggle switch - only show when not in edit mode */}
				{!editMode && (
					<div className="flex justify-center items-center gap-2 mb-2">
						<span className="text-xs text-muted-foreground">12H</span>
						<Switch
							checked={format === "24-hour"}
							onCheckedChange={(checked) =>
								setFormat(checked ? "24-hour" : "12-hour")
							}
							className="scale-75"
						/>
						<span className="text-xs text-muted-foreground">24H</span>
					</div>
				)}

				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<div className="text-5xl font-bold text-foreground">
							{timeString}
						</div>
					</div>
				</div>

				{/*Show date */}
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<div className="text-sm font-semibold text-muted-foreground tracking-wide">
							{(() => {
								const dateStr = currentTime.toLocaleDateString("en-US", {
									weekday: "short",
									month: "short",
									day: "numeric",
									year: "numeric",
								});
								// Example output: "Fri, Aug 2, 2025"
								// We want to keep the first comma, remove the second
								const parts = dateStr.split(", ");
								if (parts.length === 3) {
									return `${parts[0]}, ${parts[1]} ${parts[2]}`;
								}
								return dateStr;
							})()}
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}

export default ClockWidget;
