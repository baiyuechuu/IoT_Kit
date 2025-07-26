import { useState, useCallback, useMemo } from "react";
import GridLayout, { type Layout } from "react-grid-layout";
import {
  ButtonWidget,
  LabelWidget,
  SwitchWidget,
  DeviceTableWidget,
  WIDGET_CONSTRAINTS,
} from "./widgets";
import type { WidgetConfig, WidgetType } from "./widgets";
import "react-grid-layout/css/styles.css";

interface DashboardGridProps {
  editMode: boolean;
  widgets: WidgetConfig[];
  onLayoutChange: (widgets: WidgetConfig[]) => void;
  onWidgetSettings?: (widgetId: string) => void;
  onWidgetDuplicate?: (widget: WidgetConfig) => void;
  onWidgetDelete?: (widgetId: string) => void;
  width?: number;
  cols?: number;
  rowHeight?: number;
  margin?: [number, number];
}

export function DashboardGrid({
  editMode,
  widgets,
  onLayoutChange,
  onWidgetSettings,
  onWidgetDuplicate,
  onWidgetDelete,
  width = 1200,
  cols = 12,
  rowHeight = 60,
  margin = [10, 10],
}: DashboardGridProps) {
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});

  // Convert widgets to react-grid-layout format
  const layout: Layout[] = useMemo(() => {
    return widgets.map((widget) => ({
      i: widget.i,
      x: widget.x,
      y: widget.y,
      w: widget.w,
      h: widget.h,
      minW: widget.minW || WIDGET_CONSTRAINTS[widget.type].minW,
      maxW: widget.maxW || WIDGET_CONSTRAINTS[widget.type].maxW,
      minH: widget.minH || WIDGET_CONSTRAINTS[widget.type].minH,
      maxH: widget.maxH || WIDGET_CONSTRAINTS[widget.type].maxH,
      static: widget.static || false,
      isDraggable: editMode,
      isResizable: editMode,
    }));
  }, [widgets, editMode]);

  // Handle layout changes with collision detection
  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      const updatedWidgets = newLayout.map((layoutItem) => {
        const widget = widgets.find((w) => w.i === layoutItem.i);
        if (!widget) return null;

        // Apply widget constraints
        const constraints = WIDGET_CONSTRAINTS[widget.type];
        const constrainedWidth = Math.max(
          constraints.minW,
          Math.min(constraints.maxW, layoutItem.w)
        );
        const constrainedHeight = Math.max(
          constraints.minH,
          Math.min(constraints.maxH, layoutItem.h)
        );

        return {
          ...widget,
          x: layoutItem.x,
          y: layoutItem.y,
          w: constrainedWidth,
          h: constrainedHeight,
        };
      }).filter(Boolean) as WidgetConfig[];

      onLayoutChange(updatedWidgets);
    },
    [widgets, onLayoutChange]
  );

  // Handle switch state changes
  const handleSwitchChange = useCallback((widgetId: string, checked: boolean) => {
    setSwitchStates((prev) => ({
      ...prev,
      [widgetId]: checked,
    }));
  }, []);

  // Render widget based on type
  const renderWidget = useCallback(
    (widget: WidgetConfig) => {
      const commonProps = {
        id: widget.i,
        editMode,
        onSettings: () => onWidgetSettings?.(widget.i),
        onDuplicate: () => onWidgetDuplicate?.(widget),
        onDelete: () => onWidgetDelete?.(widget.i),
        ...widget.props,
      };

      switch (widget.type) {
        case "button":
          return (
            <ButtonWidget
              {...commonProps}
              onClick={() => console.log(`Button ${widget.i} clicked`)}
            />
          );
        case "label":
          return <LabelWidget {...commonProps} />;
        case "switch":
          return (
            <SwitchWidget
              {...commonProps}
              checked={switchStates[widget.i] || false}
              onCheckedChange={(checked) => handleSwitchChange(widget.i, checked)}
            />
          );
        case "device-table":
          return (
            <DeviceTableWidget
              {...commonProps}
              onRefresh={() => console.log(`Refresh ${widget.i}`)}
              onAddDevice={() => console.log(`Add device ${widget.i}`)}
            />
          );
        default:
          return <div>Unknown widget type</div>;
      }
    },
    [editMode, onWidgetSettings, onWidgetDuplicate, onWidgetDelete, switchStates, handleSwitchChange]
  );

  const gridHeight = Math.max(...widgets.map(w => w.y + w.h), 8) * (rowHeight + margin[1]) - margin[1];

  return (
    <div className="w-full relative">
      {/* Grid overlay for edit mode */}
      {editMode && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Grid lines */}
          <div 
            className="absolute inset-0"
            style={{
              width: width,
              height: gridHeight,
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)
              `,
              backgroundSize: `${(width - margin[0] * (cols - 1)) / cols + margin[0]}px ${rowHeight + margin[1]}px`,
              backgroundPosition: `0 0`,
            }}
          />
          
          {/* Column numbers */}
          <div className="absolute top-0 left-0 flex pointer-events-none">
            {Array.from({ length: cols }, (_, i) => (
              <div
                key={`col-${i}`}
                className="text-xs text-muted-foreground/60 font-mono flex items-center justify-center -mt-5"
                style={{
                  width: (width - margin[0] * (cols - 1)) / cols,
                  marginRight: i < cols - 1 ? margin[0] : 0,
                }}
              >
                {i}
              </div>
            ))}
          </div>
          
          {/* Row numbers */}
          <div className="absolute top-0 left-0 flex flex-col pointer-events-none">
            {Array.from({ length: Math.ceil(gridHeight / (rowHeight + margin[1])) }, (_, i) => (
              <div
                key={`row-${i}`}
                className="text-xs text-muted-foreground/60 font-mono flex items-center justify-center -ml-6"
                style={{
                  height: rowHeight,
                  marginBottom: margin[1],
                  width: 20,
                }}
              >
                {i}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <GridLayout
        className="layout relative z-10"
        layout={layout}
        cols={cols}
        rowHeight={rowHeight}
        width={width}
        margin={margin}
        containerPadding={[0, 0]}
        isDraggable={editMode}
        isResizable={editMode}
        onLayoutChange={handleLayoutChange}
        // Prevent collisions - widgets will push each other
        preventCollision={false}
        // Enable vertical compacting
        verticalCompact={true}
        // Allow overlapping when resizing
        allowOverlap={false}
        // Resize handles
        resizeHandles={["se", "sw", "ne", "nw"]}
        // Custom drag handle (entire widget is draggable in edit mode)
        draggableHandle={editMode ? undefined : ".drag-handle"}
      >
        {widgets.map((widget) => (
          <div key={widget.i} className="widget-container">
            {renderWidget(widget)}
          </div>
        ))}
      </GridLayout>
      <style>{`
        .react-grid-layout {
          position: relative;
          min-height: ${gridHeight}px;
        }
        .react-grid-item {
          transition: all 200ms ease;
          transition-property: left, top;
        }
        .react-grid-item.cssTransforms {
          transition-property: transform;
        }
        .react-grid-item > .react-resizable-handle {
          position: absolute;
          width: 20px;
          height: 20px;
          bottom: 0;
          right: 0;
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZG90cyBmaWxsPSIjOTk5IiBkPSJNIDYgNiA2IDYgNiA2IiAvPgo8L3N2Zz4K');
          background-position: bottom right;
          padding: 0 3px 3px 0;
          background-repeat: no-repeat;
          background-origin: content-box;
          box-sizing: border-box;
          cursor: se-resize;
          z-index: 10;
        }
        .react-grid-item > .react-resizable-handle::after {
          content: "";
          position: absolute;
          right: 3px;
          bottom: 3px;
          width: 5px;
          height: 5px;
          border-right: 2px solid rgba(0, 0, 0, 0.4);
          border-bottom: 2px solid rgba(0, 0, 0, 0.4);
        }
        .widget-container {
          height: 100%;
          width: 100%;
          position: relative;
          z-index: 10;
        }
        ${editMode
          ? `
          .react-grid-item {
            border: 2px dashed hsl(var(--border));
            border-radius: 8px;
            background: hsl(var(--background) / 0.8);
            backdrop-filter: blur(4px);
          }
          .react-grid-item:hover {
            border-color: hsl(var(--primary));
            box-shadow: 0 4px 12px hsl(var(--primary) / 0.2);
          }
          .react-grid-item.react-grid-placeholder {
            background: hsl(var(--primary) / 0.15);
            border: 2px dashed hsl(var(--primary));
            border-radius: 8px;
            z-index: 1;
          }
          .react-grid-item.react-draggable-dragging {
            border-color: hsl(var(--primary));
            box-shadow: 0 8px 24px hsl(var(--primary) / 0.3);
            transform: scale(1.02);
          }
          .react-grid-item.react-resizable-resizing {
            border-color: hsl(var(--primary));
            box-shadow: 0 4px 12px hsl(var(--primary) / 0.2);
          }
          `
          : `
          .react-grid-item {
            border: none;
            background: transparent;
          }
          .react-grid-item:hover {
            box-shadow: none;
          }
          `
        }
      `}</style>
    </div>
  );
} 