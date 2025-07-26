import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings, Copy, Trash2 } from "lucide-react";

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
  id,
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
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
          <button
            className="p-1 hover:bg-background/80 rounded"
            onClick={onSettings}
            title="Settings"
          >
            <Settings className="w-3 h-3 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            className="p-1 hover:bg-background/80 rounded"
            onClick={onDuplicate}
            title="Duplicate"
          >
            <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            className="p-1 hover:bg-background/80 rounded"
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 className="w-3 h-3 text-destructive hover:text-destructive/80" />
          </button>
        </div>
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