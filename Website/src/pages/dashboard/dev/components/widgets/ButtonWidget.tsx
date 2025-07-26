import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, Copy, Trash2 } from "lucide-react";

interface ButtonWidgetProps {
  id: string;
  title?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  size?: "sm" | "default" | "lg";
  editMode?: boolean;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export function ButtonWidget({
  id,
  title = "Button",
  variant = "default",
  size = "default",
  editMode = false,
  onSettings,
  onDuplicate,
  onDelete,
  onClick,
}: ButtonWidgetProps) {
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
      <div className="flex-1 flex items-center justify-center p-1">
        <Button
          variant={variant}
          size={size}
          onClick={editMode ? undefined : onClick}
          className="w-full h-full min-h-[2.5rem] text-sm font-medium"
          disabled={editMode}
        >
          {title}
        </Button>
      </div>
    </Card>
  );
} 