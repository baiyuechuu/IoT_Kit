import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, RefreshCw, Plus, Trash2, Copy } from "lucide-react";

interface Device {
  id: string;
  name: string;
  status: "online" | "offline" | "warning";
}

interface DeviceTableWidgetProps {
  id: string;
  title?: string;
  devices?: Device[];
  editMode?: boolean;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
  onAddDevice?: () => void;
  onDeleteDevice?: (deviceId: string) => void;
}

const defaultDevices: Device[] = [];

export function DeviceTableWidget({
  id,
  title = "Device Table",
  devices = defaultDevices,
  editMode = false,
  onSettings,
  onDuplicate,
  onDelete,
  onRefresh,
  onAddDevice,
  onDeleteDevice,
}: DeviceTableWidgetProps) {
  const getStatusColor = (status: Device["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="h-full flex flex-col relative group">
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
      <CardHeader className="pb-2 px-3 pt-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium truncate flex-1">{title}</CardTitle>
          <div className="flex gap-1 ml-2">
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRefresh} disabled={editMode}>
              <RefreshCw className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onAddDevice} disabled={editMode}>
              <Plus className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" disabled={editMode}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden px-3 pb-3">
        <div className="space-y-1 overflow-y-auto" style={{ height: 'calc(100% - 2rem)' }}>
          {devices.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <div className="text-sm">No devices connected</div>
                <div className="text-xs mt-1">Add devices to see them here</div>
              </div>
            </div>
          ) : (
            devices.slice(0, 6).map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-1.5 rounded border bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(device.status)}`} />
                  <span className="text-xs truncate">{device.name}</span>
                </div>
              </div>
            ))
          )}
        </div>
        {devices.length > 0 && (
          <div className="flex items-center justify-center mt-2">
            <div className="flex gap-0.5">
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={page === 1 ? "default" : "ghost"}
                  size="icon"
                  className="h-5 w-5 text-xs"
                  disabled={editMode}
                >
                  {page}
                </Button>
              ))}
              <span className="text-xs text-muted-foreground self-center mx-1">...</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 text-xs" disabled={editMode}>
                4
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 