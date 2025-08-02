import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, AlertCircle } from "lucide-react";
import type { WidgetConfig } from "./widgets";
import { useConfirmation } from "@/hooks/useConfirmation";
import { 
	WidgetSettingsForm, 
	getWidgetSettingsSchema, 
	validateFields, 
	getDefaultValues 
} from "./widgets/settings";

// Utility functions for handling nested object paths
function flattenObject(obj: any, prefix = ''): Record<string, any> {
	const flattened: Record<string, any> = {};
	
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const newKey = prefix ? `${prefix}.${key}` : key;
			
			if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
				Object.assign(flattened, flattenObject(obj[key], newKey));
			} else {
				flattened[newKey] = obj[key];
			}
		}
	}
	
	return flattened;
}

function unflattenObject(obj: Record<string, any>): any {
	const result: any = {};
	
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const keys = key.split('.');
			let current = result;
			
			for (let i = 0; i < keys.length - 1; i++) {
				const k = keys[i];
				if (!(k in current)) {
					current[k] = {};
				}
				current = current[k];
			}
			
			current[keys[keys.length - 1]] = obj[key];
		}
	}
	
	return result;
}

interface WidgetSettingsDialogProps {
	isOpen: boolean;
	widget: WidgetConfig | null;
	onClose: () => void;
	onSave: (widget: WidgetConfig) => void;
	onDelete?: (widgetId: string) => void;
	onDuplicate?: (widget: WidgetConfig) => void;
	isAddMode?: boolean; // Controls button layout for add widget mode
}

export function WidgetSettingsDialog({
	isOpen,
	widget,
	onClose,
	onSave,
	onDelete,
	onDuplicate,
	isAddMode = false,
}: WidgetSettingsDialogProps) {
	const [formData, setFormData] = useState<Record<string, any>>({});
	const [validationErrors, setValidationErrors] = useState<string[]>([]);
	const { confirm } = useConfirmation();

	// Get settings schema for the widget type
	const settingsSchema = widget ? getWidgetSettingsSchema(widget.type) : null;

	useEffect(() => {
		if (widget && settingsSchema) {
			// Get default values from schema
			const defaultValues = getDefaultValues(settingsSchema);
			
			// Create a complete widget object with all properties
			const completeWidget = {
				...defaultValues,
				...widget,
				// Ensure props are properly merged
				props: {
					...defaultValues.props,
					...widget.props,
				},
			};
			
			// Flatten nested objects for the form
			const currentValues = flattenObject(completeWidget);
			setFormData(currentValues);
			setValidationErrors([]);
		}
	}, [widget, settingsSchema]);

	if (!isOpen || !widget || !settingsSchema) return null;

	const handleFieldChange = (key: string, value: any) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
		
		// Clear validation errors when user starts typing
		if (validationErrors.length > 0) {
			setValidationErrors([]);
		}
	};

	const handleSave = () => {
		// Validate form data
		const errors = validateFields(settingsSchema, formData);
		if (errors.length > 0) {
			setValidationErrors(errors);
			return;
		}

		// Unflatten the form data back to nested objects
		const unflattened = unflattenObject(formData);
		const updatedWidget = {
			...widget,
			...unflattened,
		};
		onSave(updatedWidget);
		onClose();
	};

	const handleDuplicate = () => {
		if (onDuplicate) {
			// Validate form data before duplicating
			const errors = validateFields(settingsSchema, formData);
			if (errors.length > 0) {
				setValidationErrors(errors);
				return;
			}

			// Unflatten the form data back to nested objects
			const unflattened = unflattenObject(formData);
			const duplicatedWidget = {
				...widget,
				...unflattened,
				i: `${widget.type}-${Date.now()}`,
				x: widget.x + 1,
				y: widget.y + 1,
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

	const handleReset = () => {
		if (settingsSchema && widget) {
			// Get default values from schema
			const defaultValues = getDefaultValues(settingsSchema);
			
			// Create a complete widget object with all properties
			const completeWidget = {
				...defaultValues,
				...widget,
				// Ensure props are properly merged
				props: {
					...defaultValues.props,
					...widget.props,
				},
			};
			
			// Flatten nested objects for the form
			const currentValues = flattenObject(completeWidget);
			setFormData(currentValues);
			setValidationErrors([]);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<Card className="w-full max-w-md mx-4 bg-background max-h-[90vh] overflow-hidden flex flex-col">
				<CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
					<CardTitle>
						Configure{" "}
						{widget.type.charAt(0).toUpperCase() +
							widget.type.slice(1).replace("-", " ")}
					</CardTitle>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<X className="w-4 h-4" />
					</Button>
				</CardHeader>
				
				<CardContent className="flex-1 overflow-y-auto">
					<div className="space-y-4">
						{/* Validation Errors */}
						{validationErrors.length > 0 && (
							<div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
								<div className="flex items-center gap-2 mb-2">
									<AlertCircle className="w-4 h-4 text-destructive" />
									<span className="text-sm font-medium text-destructive">
										Please fix the following errors:
									</span>
								</div>
								<ul className="text-sm text-destructive space-y-1">
									{validationErrors.map((error, index) => (
										<li key={index} className="ml-4">• {error}</li>
									))}
								</ul>
							</div>
						)}

						{/* Settings Form */}
						<WidgetSettingsForm
							schema={settingsSchema}
							values={formData}
							onChange={handleFieldChange}
						/>
					</div>
				</CardContent>

				{/* Action Buttons */}
				<div className="flex-shrink-0 p-6 pt-0">
					<div className="flex gap-2">
						{isAddMode ? (
							<>
								<Button onClick={handleSave} className="flex-1">
									OK
								</Button>
								<Button variant="outline" onClick={onClose} className="flex-1">
									Cancel
								</Button>
							</>
						) : (
							<>
								<Button onClick={handleSave} className="flex-1">
									Save Changes
								</Button>
								<Button variant="outline" onClick={handleReset} size="sm">
									Reset
								</Button>
								<Button variant="outline" onClick={handleDuplicate} size="sm">
									Duplicate
								</Button>
								<Button variant="destructive" onClick={handleDelete} size="sm">
									Delete
								</Button>
							</>
						)}
					</div>
				</div>
			</Card>
		</div>
	);
}