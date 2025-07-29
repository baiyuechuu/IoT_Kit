import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import type { WidgetConfig } from "./widgets";
import { useConfirmation } from "@/hooks/useConfirmation";

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
  onDuplicate 
}: WidgetSettingsDialogProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { confirm } = useConfirmation();

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
        variant: "destructive"
      });
      
      if (confirmed) {
        onDelete(widget.i);
        onClose();
      }
    }
  };

  const renderFormFields = () => {
    switch (widget.type) {
      case "button":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Button Text</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter button text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variant">Variant</Label>
              <select
                id="variant"
                value={formData.variant || "default"}
                onChange={(e) => setFormData(prev => ({ ...prev, variant: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="default">Default</option>
                <option value="outline">Outline</option>
                <option value="secondary">Secondary</option>
                <option value="destructive">Destructive</option>
              </select>
            </div>
          </>
        );


      case "switch":
        return (
          <div className="space-y-2">
            <Label htmlFor="title">Switch Title</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter switch title"
            />
          </div>
        );

      case "device-table":
        return (
          <div className="space-y-2">
            <Label htmlFor="title">Table Title</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter table title"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Configure {widget.type.charAt(0).toUpperCase() + widget.type.slice(1).replace("-", " ")}</CardTitle>
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
