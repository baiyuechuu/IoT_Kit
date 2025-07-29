import { useState, useCallback } from "react";
import GridLayout, { type Layout } from "react-grid-layout";
import {
	ButtonWidget,
	SwitchWidget,
	DeviceTableWidget,
	WIDGET_CONSTRAINTS,
} from "./widgets";
import type { WidgetConfig } from "./widgets";
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
	const [dragPreview, setDragPreview] = useState<{
		visible: boolean;
		x: number;
		y: number;
		w: number;
		h: number;
	}>({ visible: false, x: 0, y: 0, w: 0, h: 0 });

	// Convert widgets to react-grid-layout format
	const layout: Layout[] = widgets.map((widget) => ({
		i: widget.i,
		x: widget.x,
		y: widget.y,
		w: widget.w,
		h: widget.h,
		minW: WIDGET_CONSTRAINTS[widget.type].minW,
		maxW: WIDGET_CONSTRAINTS[widget.type].maxW,
		minH: WIDGET_CONSTRAINTS[widget.type].minH,
		maxH: WIDGET_CONSTRAINTS[widget.type].maxH,
		isDraggable: editMode,
		isResizable: editMode,
	}));

	// Handle drag start - show preview
	const handleDragStart = useCallback((_layout: Layout[], _oldItem: Layout, newItem: Layout) => {
		console.log('Drag start:', newItem);
		setDragPreview({
			visible: true,
			x: newItem.x,
			y: newItem.y,
			w: newItem.w,
			h: newItem.h,
		});
	}, []);

	// Handle drag - update preview position
	const handleDrag = useCallback((_layout: Layout[], _oldItem: Layout, newItem: Layout, placeholder: Layout) => {
		console.log('Drag:', placeholder);
		setDragPreview({
			visible: true,
			x: placeholder.x,
			y: placeholder.y,
			w: newItem.w,
			h: newItem.h,
		});
	}, []);

	// Handle drag stop - hide preview
	const handleDragStop = useCallback(() => {
		console.log('Drag stop');
		setDragPreview({ visible: false, x: 0, y: 0, w: 0, h: 0 });
	}, []);

	// Handle resize start - show preview
	const handleResizeStart = useCallback((_layout: Layout[], _oldItem: Layout, newItem: Layout) => {
		console.log('Resize start:', newItem);
		setDragPreview({
			visible: true,
			x: newItem.x,
			y: newItem.y,
			w: newItem.w,
			h: newItem.h,
		});
	}, []);

	// Handle resize - update preview size
	const handleResize = useCallback((_layout: Layout[], _oldItem: Layout, newItem: Layout) => {
		console.log('Resize:', newItem);
		setDragPreview({
			visible: true,
			x: newItem.x,
			y: newItem.y,
			w: newItem.w,
			h: newItem.h,
		});
	}, []);

	// Handle resize stop - hide preview
	const handleResizeStop = useCallback(() => {
		console.log('Resize stop');
		setDragPreview({ visible: false, x: 0, y: 0, w: 0, h: 0 });
	}, []);

	// Handle layout changes
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

	// Handle switch state changes
	const handleSwitchChange = useCallback(
		(widgetId: string, checked: boolean) => {
			setSwitchStates((prev) => ({
				...prev,
				[widgetId]: checked,
			}));
		},
		[],
	);

	// Render widget based on type
	const renderWidget = (widget: WidgetConfig) => {
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
	};

	// Calculate preview position and size with red background
	const getPreviewStyle = () => {
		if (!dragPreview.visible || !editMode) {
			return { display: 'none' };
		}
		
		const cellWidth = (width - margin[0] * (cols - 1)) / cols;
		const cellHeight = rowHeight;
		const x = dragPreview.x * (cellWidth + margin[0]);
		const y = dragPreview.y * (cellHeight + margin[1]);
		const w = dragPreview.w * cellWidth + (dragPreview.w - 1) * margin[0];
		const h = dragPreview.h * cellHeight + (dragPreview.h - 1) * margin[1];
		
		return {
			position: 'absolute' as const,
			left: x,
			top: y,
			width: w,
			height: h,
			backgroundColor: 'rgba(255, 0, 0, 0.3)',
			border: '2px solid red',
			borderRadius: '8px',
			zIndex: 1000,
			pointerEvents: 'none' as const,
			display: 'block',
		};
	};

	return (
		<div className="w-full relative">
			{/* Red Preview for Drag/Resize */}
			<div style={getPreviewStyle()} />

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
				onDragStart={handleDragStart}
				onDrag={handleDrag}
				onDragStop={handleDragStop}
				onResizeStart={handleResizeStart}
				onResize={handleResize}
				onResizeStop={handleResizeStop}
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
				
				${editMode ? `
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
				` : `
					.react-grid-item {
						border: none;
						background: transparent;
					}
				`}
			`}</style>
		</div>
	);
}
