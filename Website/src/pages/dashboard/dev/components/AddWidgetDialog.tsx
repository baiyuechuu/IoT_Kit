import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ToggleLeft, Table } from "lucide-react";
import { WIDGET_CONSTRAINTS } from "./widgets";
import type { WidgetType } from "./widgets";

interface AddWidgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: WidgetType, props: Record<string, any>) => void;
}

const WIDGET_TYPES = [
  {
    type: "button" as WidgetType,
    name: "Button",
    description: "Interactive button for actions",
    icon: Plus,
    color: "bg-blue-500",
  },
  {
    type: "switch" as WidgetType,
    name: "Switch",
    description: "Toggle on/off control",
    icon: ToggleLeft,
    color: "bg-purple-500",
  },
  {
    type: "device-table" as WidgetType,
    name: "Device Table",
    description: "List of connected devices",
    icon: Table,
    color: "bg-orange-500",
  },
];

export function AddWidgetDialog({ isOpen, onClose, onAddWidget }: AddWidgetDialogProps) {
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

    const widgetInfo = WIDGET_TYPES.find(w => w.type === selectedType);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${widgetInfo?.color}`}>
            {widgetInfo && <widgetInfo.icon className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{widgetInfo?.name}</h3>
            <p className="text-sm text-muted-foreground">{widgetInfo?.description}</p>
          </div>
        </div>

        {selectedType === "button" && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Text *</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter button text"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Variant</label>
              <select
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
        )}

        {selectedType === "switch" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Switch Title *</label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter switch title"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        )}

        {selectedType === "device-table" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Table Title *</label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter table title"
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
          <CardTitle>{selectedType ? "Configure Widget" : "Add Widget"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {selectedType ? renderConfigForm() : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WIDGET_TYPES.map((widget) => {
                  const Icon = widget.icon;
                  const constraints = WIDGET_CONSTRAINTS[widget.type];
                  
                  return (
                    <Card
                      key={widget.type}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary"
                      onClick={() => handleWidgetSelect(widget.type)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${widget.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{widget.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {widget.description}
                          </p>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {constraints.minW}×{constraints.minH} - {constraints.maxW}×{constraints.maxH}
                            </Badge>
                          </div>
                        </div>
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
