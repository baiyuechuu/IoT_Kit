import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Copy, Trash2 } from "lucide-react";

interface LabelWidgetProps {
  id: string;
  title?: string;
  value?: string | number;
  unit?: string;
  color?: "default" | "secondary" | "destructive" | "outline";
  editMode?: boolean;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function LabelWidget({
  id,
  title = "Label",
  value = "--",
  unit = "",
  color = "default",
  editMode = false,
  onSettings,
  onDuplicate,
  onDelete,
}: LabelWidgetProps) {
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
      <div className="flex-1 flex flex-col items-center justify-center gap-1">
        <h3 className="text-sm font-medium text-muted-foreground text-center leading-tight">
          {title}
        </h3>
        <div className="flex items-baseline gap-1 flex-wrap justify-center">
          <span className="text-xl lg:text-2xl font-bold leading-none">{value}</span>
          {unit && (
            <Badge variant={color === "default" ? "secondary" : color} className="text-xs">
              {unit}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
} 