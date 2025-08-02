import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import type { WidgetType, WidgetConfig } from "./widgets";
import { WidgetSettingsDialog } from "./WidgetSettingsDialog";

interface AddWidgetDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onAddWidget: (type: WidgetType, props: Record<string, any>) => void;
}

const WIDGET_TYPES = [
	{
		type: "temperature" as WidgetType,
		name: "Temperature",
		description: "Display temperature data with unit conversion and color ranges",
	},
];

export function AddWidgetDialog({
	isOpen,
	onClose,
	onAddWidget,
}: AddWidgetDialogProps) {
	const [selectedType, setSelectedType] = useState<WidgetType | null>(null);
	const [showSettings, setShowSettings] = useState(false);

	if (!isOpen) return null;

	const handleWidgetSelect = (type: WidgetType) => {
		setSelectedType(type);
		setShowSettings(true);
	};

	const handleSaveWidget = (widgetConfig: WidgetConfig) => {
		// Extract all the configuration data as props
		const widgetProps = {
			...widgetConfig.props,
			title: widgetConfig.title,
			firebasePath: widgetConfig.firebasePath,
		};
		
		onAddWidget(widgetConfig.type, widgetProps);
		setSelectedType(null);
		setShowSettings(false);
		onClose();
	};

	const handleCloseSettings = () => {
		setShowSettings(false);
		setSelectedType(null);
	};

	// Create a temporary widget config for settings dialog
	const getTempWidgetConfig = (): WidgetConfig | null => {
		if (!selectedType) return null;
		
		return {
			i: `temp-${selectedType}-${Date.now()}`,
			x: 0,
			y: 0,
			w: 6,
			h: 4,
			type: selectedType,
			title: WIDGET_TYPES.find(w => w.type === selectedType)?.name || selectedType,
		};
	};

	return (
		<>
			<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
				<Card className="w-full max-w-2xl mx-4 bg-background">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>
							{selectedType 
								? `Configure ${WIDGET_TYPES.find(w => w.type === selectedType)?.name || 'Widget'}`
								: "Add Widget"
							}
						</CardTitle>
						<Button variant="ghost" size="icon" onClick={onClose}>
							<X className="w-4 h-4" />
						</Button>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{WIDGET_TYPES.map((widget) => {
								return (
									<Card
										key={widget.type}
										className="px-3 py-2 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-border"
										onClick={() => handleWidgetSelect(widget.type)}
									>
										<div className="flex items-start flex-col">
											<h3 className="font-semibold text-lg">{widget.name}</h3>
											<p className="text-sm text-muted-foreground">
												{widget.description}
											</p>
										</div>
									</Card>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Widget Settings Dialog */}
			<WidgetSettingsDialog
				isOpen={showSettings}
				widget={getTempWidgetConfig()}
				onClose={handleCloseSettings}
				onSave={handleSaveWidget}
				isAddMode={true}
			/>
		</>
	);
}
