import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Control from "../controls/Control";

interface SwitchWidgetProps {
	id: string;
	title?: string;
	checked?: boolean;
	editMode?: boolean;
	onSettings?: () => void;
	onDuplicate?: () => void;
	onDelete?: () => void;
	onCheckedChange?: (checked: boolean) => void;
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
}: SwitchWidgetProps) {
	return (
		<Card className="p-3 h-full flex flex-col relative group">
			{editMode && (
				<Control
					onSettings={onSettings}
					onDuplicate={onDuplicate}
					onDelete={onDelete}
				/>
			)}
			<div className="flex-1 flex flex-col items-center justify-center gap-2">
				<h3 className="text-sm font-medium text-muted-foreground text-center leading-tight">
					{title}
				</h3>
				<div className="flex flex-col items-center gap-2">
					<Switch
						checked={checked}
						onCheckedChange={editMode ? undefined : onCheckedChange}
						disabled={editMode}
						className="transform scale-125"
					/>
					<span className="text-xs font-medium text-muted-foreground">
						{checked ? "ON" : "OFF"}
					</span>
				</div>
			</div>
		</Card>
	);
}
