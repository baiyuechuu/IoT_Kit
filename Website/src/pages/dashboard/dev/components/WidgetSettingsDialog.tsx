import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Database } from "lucide-react";
import type { WidgetConfig } from "./widgets";
import { useConfirmation } from "@/hooks/useConfirmation";
import { useFirebaseConnection } from "@/hooks/useFirebase";

interface WidgetSettingsDialogProps {
	isOpen: boolean;
	widget: WidgetConfig | null;
	onClose: () => void;
	onSave: (widget: WidgetConfig) => void;
	onDelete?: (widgetId: string) => void;
	onDuplicate?: (widget: WidgetConfig) => void;
}

export function WidgetSettingsDialog({
	isOpen,
	widget,
	onClose,
	onSave,
	onDelete,
	onDuplicate,
}: WidgetSettingsDialogProps) {
	const [formData, setFormData] = useState<Record<string, any>>({});
	const { confirm } = useConfirmation();
	const { connected: firebaseConnected, configured: firebaseConfigured } = useFirebaseConnection();

	useEffect(() => {
		if (widget) {
			setFormData(widget.props || {});
		}
	}, [widget]);

	if (!isOpen || !widget) return null;

	const handleSave = () => {
		const updatedWidget = {
			...widget,
			props: formData,
		};
		onSave(updatedWidget);
		onClose();
	};

	const handleDuplicate = () => {
		if (onDuplicate) {
			const duplicatedWidget = {
				...widget,
				i: `${widget.type}-${Date.now()}`,
				x: widget.x + 1,
				y: widget.y + 1,
				props: formData,
			};
			onDuplicate(duplicatedWidget);
			onClose();
		}
	};

	const handleDelete = async () => {
		if (onDelete) {
			const confirmed = await confirm({
				title: "Delete Widget",
				message: "Are you sure you want to delete this widget?",
				confirmText: "Delete",
				cancelText: "Cancel",
				variant: "destructive",
			});

			if (confirmed) {
				onDelete(widget.i);
				onClose();
			}
		}
	};

	const renderFormFields = () => {
		switch (widget.type) {
			case "switch":
				return (
					<>
						<div className="space-y-2">
							<Label htmlFor="title">Switch Title</Label>
							<Input
								id="title"
								value={formData.title || ""}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, title: e.target.value }))
								}
								placeholder="Enter switch title"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="variant">Variant</Label>
							<select
								id="variant"
								value={formData.variant || "default"}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, variant: e.target.value }))
								}
								className="w-full p-2 border rounded-md"
							>
								<option value="default">Default</option>
								<option value="outline">Outline</option>
								<option value="secondary">Secondary</option>
								<option value="destructive">Destructive</option>
							</select>
						</div>
						
						{/* Firebase Configuration Section */}
						<div className="space-y-3 border-t pt-4">
							<div className="flex items-center gap-2 mb-2">
								<Database className={`w-4 h-4 ${
									firebaseConnected ? 'text-green-500' : 
									firebaseConfigured ? 'text-orange-500' : 
									'text-muted-foreground'
								}`} />
								<Label className="text-sm font-medium">Firebase Data Source</Label>
								{!firebaseConfigured && (
									<span className="text-xs text-muted-foreground">(Configure Firebase first)</span>
								)}
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="firebasePath">Variable Path</Label>
								<Input
									id="firebasePath"
									value={formData.firebasePath || ""}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, firebasePath: e.target.value }))
									}
									placeholder="e.g., devices/switch1/state"
									disabled={!firebaseConfigured}
								/>
								<p className="text-xs text-muted-foreground">
									Path to the Firebase variable (e.g., sensors/temperature, devices/light1/status)
								</p>
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="dataType">Data Type</Label>
								<select
									id="dataType"
									value={formData.dataType || "boolean"}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, dataType: e.target.value }))
									}
									className="w-full p-2 border rounded-md"
									disabled={!firebaseConfigured}
								>
									<option value="boolean">Boolean (true/false)</option>
									<option value="number">Number</option>
									<option value="string">String</option>
									<option value="object">Object</option>
								</select>
								<p className="text-xs text-muted-foreground">
									Expected data type for the Firebase variable
								</p>
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="updateInterval">Update Interval (ms)</Label>
								<Input
									id="updateInterval"
									type="number"
									value={formData.updateInterval || 1000}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, updateInterval: parseInt(e.target.value) || 1000 }))
									}
									placeholder="1000"
									min="100"
									max="60000"
									disabled={!firebaseConfigured}
								/>
								<p className="text-xs text-muted-foreground">
									How often to check for updates (100ms - 60s)
								</p>
							</div>
						</div>
					</>
				);
			default:
				return null;
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<Card className="w-full max-w-md mx-4 bg-background">
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>
						Configure{" "}
						{widget.type.charAt(0).toUpperCase() +
							widget.type.slice(1).replace("-", " ")}
					</CardTitle>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<X className="w-4 h-4" />
					</Button>
				</CardHeader>
				<CardContent className="space-y-4">
					{renderFormFields()}

					<div className="flex gap-2 pt-4">
						<Button onClick={handleSave} className="flex-1">
							Save Changes
						</Button>
						<Button variant="outline" onClick={handleDuplicate}>
							Duplicate
						</Button>
						<Button variant="destructive" onClick={handleDelete}>
							Delete
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
