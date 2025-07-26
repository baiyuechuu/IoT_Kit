import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Settings, Trash2, Monitor } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { DashboardGrid } from "./components/DashboardGrid";
import { AddWidgetDialog } from "./components/AddWidgetDialog";
import { WidgetSettingsDialog } from "./components/WidgetSettingsDialog";
import { WIDGET_CONSTRAINTS } from "./components/widgets";
import type { WidgetConfig, WidgetType } from "./components/widgets";

// Default widgets - clean slate for demo
const DEFAULT_WIDGETS: WidgetConfig[] = [];

export default function DevPage() {
  const [editMode, setEditMode] = useState(false);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(DEFAULT_WIDGETS);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<WidgetConfig | null>(null);
  const [gridWidth, setGridWidth] = useState(1200);
  const [isDesktop, setIsDesktop] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update grid width and check for desktop
  useEffect(() => {
    const updateSizing = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Account for padding in edit mode and general margins
        const paddingOffset = editMode ? 64 : 40; // Extra padding for grid numbers in edit mode
        setGridWidth(Math.max(containerWidth - paddingOffset, 800)); // Min width of 800px
        
        // Check if we're on desktop (width > 768px)
        setIsDesktop(window.innerWidth > 1080);
      }
    };

    updateSizing();
    window.addEventListener("resize", updateSizing);
    return () => window.removeEventListener("resize", updateSizing);
  }, [editMode]); // Re-calculate when edit mode changes

  // Handle layout changes
  const handleLayoutChange = useCallback((updatedWidgets: WidgetConfig[]) => {
    setWidgets(updatedWidgets);
  }, []);

  // Add new widget with configuration
  const handleAddWidget = useCallback((type: WidgetType, props: Record<string, any>) => {
    const constraints = WIDGET_CONSTRAINTS[type];
    const newWidget: WidgetConfig = {
      i: `${type}-${Date.now()}`,
      type,
      x: 0,
      y: 0,
      w: constraints.minW,
      h: constraints.minH,
      props,
    };

    // Find empty space for the new widget
    const existingPositions = widgets.map(w => ({
      x: w.x,
      y: w.y,
      w: w.w,
      h: w.h,
    }));

    let bestX = 0;
    let bestY = 0;
    let found = false;

    // Try to find an empty spot
    for (let y = 0; y < 20 && !found; y++) {
      for (let x = 0; x <= 12 - newWidget.w && !found; x++) {
        const hasCollision = existingPositions.some(pos => {
          return !(x >= pos.x + pos.w || x + newWidget.w <= pos.x ||
                   y >= pos.y + pos.h || y + newWidget.h <= pos.y);
        });

        if (!hasCollision) {
          bestX = x;
          bestY = y;
          found = true;
        }
      }
    }

    newWidget.x = bestX;
    newWidget.y = bestY;

    setWidgets(prev => [...prev, newWidget]);
  }, [widgets]);

  // Handle widget settings
  const handleWidgetSettings = useCallback((widgetId: string) => {
    const widget = widgets.find(w => w.i === widgetId);
    if (widget) {
      setSelectedWidget(widget);
      setShowSettingsDialog(true);
    }
  }, [widgets]);

  // Handle widget save
  const handleWidgetSave = useCallback((updatedWidget: WidgetConfig) => {
    setWidgets(prev => prev.map(w => w.i === updatedWidget.i ? updatedWidget : w));
  }, []);

  // Handle widget duplicate
  const handleWidgetDuplicate = useCallback((widget: WidgetConfig) => {
    const newWidget: WidgetConfig = {
      ...widget,
      i: `${widget.type}-${Date.now()}`,
      x: Math.min(widget.x + 1, 12 - widget.w),
      y: widget.y + 1,
    };
    setWidgets(prev => [...prev, newWidget]);
  }, []);

  // Handle widget delete
  const handleWidgetDelete = useCallback((widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.i !== widgetId));
  }, []);

  // Clear all widgets
  const handleClearAll = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all widgets?")) {
      setWidgets([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 pt-20">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
              Development Dashboard
            </h1>
            {editMode && !isDesktop && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <span className="text-sm text-orange-700">Edit mode features are only available on desktop</span>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Switch
                id="edit-mode"
                checked={editMode}
                onCheckedChange={setEditMode}
              />
              <label htmlFor="edit-mode" className="text-sm font-medium">
                {editMode ? "Edit Mode" : "View Mode"}
              </label>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddDialog(true)}
                disabled={!editMode || !isDesktop}
                className="text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add Widget</span>
                <span className="sm:hidden">Add</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearAll}
                disabled={!editMode || !isDesktop || widgets.length === 0}
                className="text-xs sm:text-sm"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Clear All</span>
                <span className="sm:hidden">Clear</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs sm:text-sm"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Settings</span>
              </Button>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="w-full">
          <div className={`${editMode ? 'pl-8 pt-8' : ''} transition-all duration-200`}>
            <DashboardGrid
              editMode={editMode && isDesktop}
              widgets={widgets}
              onLayoutChange={handleLayoutChange}
              onWidgetSettings={handleWidgetSettings}
              onWidgetDuplicate={handleWidgetDuplicate}
              onWidgetDelete={handleWidgetDelete}
              width={gridWidth}
              cols={12}
              rowHeight={60}
              margin={[10, 10]}
            />
          </div>
        </div>
      </div>

      <AddWidgetDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddWidget={handleAddWidget}
      />

      <WidgetSettingsDialog
        isOpen={showSettingsDialog}
        widget={selectedWidget}
        onClose={() => {
          setShowSettingsDialog(false);
          setSelectedWidget(null);
        }}
        onSave={handleWidgetSave}
        onDelete={handleWidgetDelete}
        onDuplicate={handleWidgetDuplicate}
      />
    </div>
  );
}
