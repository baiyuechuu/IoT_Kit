import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import type { WidgetType } from "./widgets";

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
	const [formData, setFormData] = useState<Record<string, any>>({});

	if (!isOpen) return null;

	const handleWidgetSelect = (type: WidgetType) => {
		setSelectedType(type);
		setFormData({});
	};

	const handleBack = () => {
		setSelectedType(null);
		setFormData({});
	};

	const handleAddWidget = () => {
		if (selectedType) {
			onAddWidget(selectedType, formData);
			setSelectedType(null);
			setFormData({});
			onClose();
		}
	};

	const renderConfigForm = () => {
		if (!selectedType) return null;

		const widgetInfo = WIDGET_TYPES.find((w) => w.type === selectedType);

		return (
			<div className="space-y-4">
				<div className="flex items-center gap-3 mb-4">
					<h3 className="font-semibold text-lg">{widgetInfo?.name}</h3>
					<p className="text-sm text-muted-foreground">
						{widgetInfo?.description}
					</p>
				</div>

				{(selectedType === "temperature") && (
					<div className="space-y-2">
						<label className="text-sm font-medium">Widget Title *</label>
						<input
							type="text"
							value={formData.title || ""}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, title: e.target.value }))
							}
							placeholder={`Enter ${selectedType} widget title`}
							className="w-full p-2 border rounded-md"
							required
						/>
					</div>
				)}

				<div className="flex gap-2 pt-4">
					<Button variant="outline" onClick={handleBack} className="flex-1">
						Back
					</Button>
					<Button
						onClick={handleAddWidget}
						className="flex-1"
						disabled={!formData.title}
					>
						Add Widget
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<Card className="w-full max-w-2xl mx-4 bg-background">
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>
						{selectedType ? "Configure Widget" : "Add Widget"}
					</CardTitle>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<X className="w-4 h-4" />
					</Button>
				</CardHeader>
				<CardContent>
					{selectedType ? (
						renderConfigForm()
					) : (
						<>
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
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
