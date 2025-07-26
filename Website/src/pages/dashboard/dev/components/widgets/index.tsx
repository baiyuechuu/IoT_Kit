export { ButtonWidget } from "./ButtonWidget";
export { LabelWidget } from "./LabelWidget";
export { SwitchWidget } from "./SwitchWidget";
export { DeviceTableWidget } from "./DeviceTableWidget";

export type WidgetType = "button" | "label" | "switch" | "device-table";

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
export const WIDGET_CONSTRAINTS: Record<WidgetType, { minW: number; maxW: number; minH: number; maxH: number }> = {
  button: { minW: 2, maxW: 4, minH: 1, maxH: 2 },        // 2x1 minimum for proper button size
  label: { minW: 2, maxW: 4, minH: 2, maxH: 3 },         // 2x2 minimum for title + value + unit
  switch: { minW: 2, maxW: 3, minH: 2, maxH: 3 },        // 2x2 minimum for title + switch + status
  "device-table": { minW: 4, maxW: 8, minH: 4, maxH: 8 }, // 4x4 minimum for header + devices + pagination
}; 