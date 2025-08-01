import { useState, useCallback } from "react";
import GridLayout, { type Layout } from "react-grid-layout";
import { WIDGET_CONSTRAINTS, TemperatureWidget } from "./widgets";
import type { WidgetConfig } from "./widgets";
import "react-grid-layout/css/styles.css";
import { Button } from "@/components/ui/button";
import { Settings, Plus } from "lucide-react";

interface MainDashboardProps {
	editMode: boolean;
	widgets: WidgetConfig[];
	onLayoutChange: (widgets: WidgetConfig[]) => void;
	onWidgetSettings?: (widgetId: string) => void;
	onWidgetDuplicate?: (widget: WidgetConfig) => void;
	onWidgetDelete?: (widgetId: string) => void;
	onShowAddDialog?: () => void;
	width?: number;
	cols?: number;
	rowHeight?: number; margin?: [number, number]; }

export function MainDashboard({
	editMode,
	widgets,
	onLayoutChange,
	onWidgetSettings,
	onWidgetDuplicate,
	onWidgetDelete,
	onShowAddDialog,
	width = 1200,
	cols = 12,
	rowHeight = 60,
	margin = [10, 10],
}: MainDashboardProps) {
	
	// Drag/resize preview state
	const [dragPreview, setDragPreview] = useState<{
		visible: boolean;
		x: number;
		y: number;
		w: number;
		h: number;
	}>({ visible: false, x: 0, y: 0, w: 0, h: 0 });
	const [isDragging, setIsDragging] = useState(false);

	// Generate grid layout from widgets
	const layout: Layout[] = widgets.map((widget) => {
		const constraints = WIDGET_CONSTRAINTS[widget.type];
		if (!constraints) {
			console.warn(`Widget type "${widget.type}" not found in constraints registry`);
			// Use default constraints for unknown widget types
			return {
				i: widget.i,
				x: widget.x,
				y: widget.y,
				w: widget.w,
				h: widget.h,
				minW: 1,
				maxW: 6,
				minH: 1,
				maxH: 4,
				isDraggable: editMode,
				isResizable: editMode,
			};
		}
		
		return {
			i: widget.i,
			x: widget.x,
			y: widget.y,
			w: widget.w,
			h: widget.h,
			minW: constraints.minW,
			maxW: constraints.maxW,
			minH: constraints.minH,
			maxH: constraints.maxH,
			isDraggable: editMode,
			isResizable: editMode,
		};
	});

	// Layout change handler
	const handleLayoutChange = useCallback(
		(newLayout: Layout[]) => {
			const updatedWidgets = newLayout
				.map((layoutItem) => {
					const widget = widgets.find((w) => w.i === layoutItem.i);
					if (!widget) return null;

					return {
						...widget,
						x: layoutItem.x,
						y: layoutItem.y,
						w: layoutItem.w,
						h: layoutItem.h,
					};
				})
				.filter(Boolean) as WidgetConfig[];

			onLayoutChange(updatedWidgets);
		},
		[widgets, onLayoutChange],
	);

	// Drag preview handlers
	const dragHandlers = useDragPreview({
		setDragPreview,
		setIsDragging,
		isDragging,
	});

	// Widget renderer
	const renderWidget = (widget: WidgetConfig) => {
		const commonProps = {
			config: widget,
			editMode,
			onSettings: () => onWidgetSettings?.(widget.i),
			onDuplicate: () => onWidgetDuplicate?.(widget),
			onDelete: () => onWidgetDelete?.(widget.i),
			onError: (error: string) => console.error(`Widget ${widget.i} error:`, error),
		};

		switch (widget.type) {
			case "temperature":
				return <TemperatureWidget {...commonProps} config={widget as any} />;
			default:
				return null;
		}
	};

	// Preview style calculation
	const previewStyle = getPreviewStyle({
		dragPreview,
		editMode,
		width,
		cols,
		rowHeight,
		margin,
	});

	return (
		<div className="w-full relative">
			<div style={previewStyle} />

			{widgets.length === 0 ? (
				<EmptyDashboard onShowAddDialog={onShowAddDialog} />
			) : (
				<GridLayout
					className="layout"
					layout={layout}
					cols={cols}
					rowHeight={rowHeight}
					width={width}
					margin={margin}
					isDraggable={editMode}
					isResizable={editMode}
					onLayoutChange={handleLayoutChange}
					{...dragHandlers}
					preventCollision={false}
					verticalCompact={true}
					resizeHandles={["se", "sw", "ne", "nw"]}
				>
					{widgets.map((widget) => (
						<div key={widget.i} className="widget-container">
							{renderWidget(widget)}
						</div>
					))}
				</GridLayout>
			)}

			<DashboardStyles editMode={editMode} />
		</div>
	);
}

// Helper hook for drag preview functionality
function useDragPreview({
	setDragPreview,
	setIsDragging,
	isDragging,
}: {
	setDragPreview: (preview: any) => void;
	setIsDragging: (dragging: boolean) => void;
	isDragging: boolean;
}) {
	const handleDragStart = useCallback(
		(_layout: Layout[], _oldItem: Layout, newItem: Layout) => {
			setTimeout(() => {
				if (isDragging) {
					setDragPreview({
						visible: true,
						x: newItem.x,
						y: newItem.y,
						w: newItem.w,
						h: newItem.h,
					});
				}
			}, 100);
			setIsDragging(true);
		},
		[isDragging, setDragPreview, setIsDragging],
	);

	const handleDrag = useCallback(
		(
			_layout: Layout[],
			_oldItem: Layout,
			newItem: Layout,
			placeholder: Layout,
		) => {
			setDragPreview({
				visible: true,
				x: placeholder.x,
				y: placeholder.y,
				w: newItem.w,
				h: newItem.h,
			});
		},
		[setDragPreview],
	);

	const handleDragStop = useCallback(() => {
		setDragPreview({ visible: false, x: 0, y: 0, w: 0, h: 0 });
		setIsDragging(false);
	}, [setDragPreview, setIsDragging]);

	const handleResizeStart = useCallback(
		(_layout: Layout[], _oldItem: Layout, newItem: Layout) => {
			setDragPreview({
				visible: true,
				x: newItem.x,
				y: newItem.y,
				w: newItem.w,
				h: newItem.h,
			});
		},
		[setDragPreview],
	);

	const handleResize = useCallback(
		(_layout: Layout[], _oldItem: Layout, newItem: Layout) => {
			setDragPreview({
				visible: true,
				x: newItem.x,
				y: newItem.y,
				w: newItem.w,
				h: newItem.h,
			});
		},
		[setDragPreview],
	);

	const handleResizeStop = useCallback(() => {
		setDragPreview({ visible: false, x: 0, y: 0, w: 0, h: 0 });
	}, [setDragPreview]);

	return {
		onDragStart: handleDragStart,
		onDrag: handleDrag,
		onDragStop: handleDragStop,
		onResizeStart: handleResizeStart,
		onResize: handleResize,
		onResizeStop: handleResizeStop,
	};
}

// Helper function for preview style calculation
function getPreviewStyle({
	dragPreview,
	editMode,
	width,
	cols,
	rowHeight,
	margin,
}: {
	dragPreview: any;
	editMode: boolean;
	width: number;
	cols: number;
	rowHeight: number;
	margin: [number, number];
}) {
	if (!dragPreview.visible || !editMode) {
		return { display: "none" };
	}

	const cellWidth = (width - margin[0] * (cols - 1)) / cols;
	const cellHeight = rowHeight;
	const x = dragPreview.x * (cellWidth + margin[0]);
	const y = dragPreview.y * (cellHeight + margin[1]);
	const w = dragPreview.w * cellWidth + (dragPreview.w - 1) * margin[0];
	const h = dragPreview.h * cellHeight + (dragPreview.h - 1) * margin[1];

	return {
		position: "absolute" as const,
		left: x,
		top: y,
		width: w,
		height: h,
		backgroundColor: "rgba(255, 0, 0, 0.2)",
		border: "2px solid red",
		borderRadius: "8px",
		zIndex: 888,
		pointerEvents: "none" as const,
		display: "block",
	};
}

// Empty dashboard component
function EmptyDashboard({ onShowAddDialog }: { onShowAddDialog?: () => void }) {
	return (
		<div className="text-center py-12">
			<div className="max-w-md mx-auto">
				<Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
				<h3 className="text-xl font-semibold mb-2">No Widgets Yet</h3>
				<p className="text-muted-foreground mb-6">
					Create your first widget to start monitoring and controlling your IoT devices.
				</p>
				<Button onClick={onShowAddDialog} size="lg" className="gap-2">
					<Plus className="w-4 h-4" />
					Create Your First Widget
				</Button>
			</div>
		</div>
	);
}

// Dashboard styles component
function DashboardStyles({ editMode }: { editMode: boolean }) {
	return (
		<style>{`
			.react-grid-layout {
				position: relative;
			}
			
			.react-grid-item {
				transition: none !important;
			}
			
			.widget-container {
				height: 100%;
				width: 100%;
			}
			
			${
				editMode
					? `
				.react-grid-item {
					border: 2px dashed hsl(var(--border));
					border-radius: 8px;
					background: hsl(var(--background) / 0.95);
				}
				
				.react-grid-item:hover {
					border-color: hsl(var(--primary));
					box-shadow: 0 4px 12px hsl(var(--primary) / 0.15);
				}
				
				.react-grid-item.react-draggable-dragging {
					border-color: hsl(var(--primary));
					box-shadow: 0 8px 24px hsl(var(--primary) / 0.2);
					transform: scale(1.02);
					z-index: 100;
				}
				
				.react-grid-item.react-resizable-resizing {
					border-color: hsl(var(--primary));
					box-shadow: 0 4px 12px hsl(var(--primary) / 0.15);
					z-index: 100;
				}
				
				.react-grid-placeholder {
					background: hsl(var(--muted) / 0.5) !important;
					border: 2px dashed hsl(var(--muted-foreground)) !important;
					border-radius: 8px !important;
					opacity: 0.6 !important;
				}
				
				.react-resizable-handle {
					position: absolute;
					width: 16px;
					height: 16px;
					bottom: -1px;
					right: -1px;
					cursor: se-resize;
					z-index: 10;
					overflow: hidden;
					box-sizing: border-box;
				}
				
				.react-resizable-handle::after {
					content: "";
					position: absolute;
					right: 2px;
					bottom: 2px;
					width: 4px;
					height: 4px;
					border-right: 2px solid hsl(var(--muted-foreground));
					border-bottom: 2px solid hsl(var(--muted-foreground));
				}
			`
					: `
				.react-grid-item {
					border: none;
					background: transparent;
				}
			`
			}
		`}</style>
	);
}
