export { SwitchWidget } from "./SwitchWidget";

export type WidgetType = "switch";

export interface WidgetConfig {
	i: string;
	type: WidgetType;
	x: number;
	y: number;
	w: number;
	h: number;
	minW?: number;
	maxW?: number;
	minH?: number;
	maxH?: number;
	static?: boolean;
	props?: Record<string, any>;
}

// Widget constraints similar to Blynk - minimum sizes ensure content fits properly
export const WIDGET_CONSTRAINTS: Record<
	WidgetType,
	{ minW: number; maxW: number; minH: number; maxH: number }
> = {
	switch: { minW: 2, maxW: 3, minH: 2, maxH: 3 }, // 2x2 minimum for title + switch + status
};
