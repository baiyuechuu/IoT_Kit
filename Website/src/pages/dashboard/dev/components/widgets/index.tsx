export { TemperatureWidget } from "./widget/TemperatureWidget";
export { HumidityWidget } from "./widget/HumidityWidget";
export { TemperatureChartWidget } from "./widget/TemperatureChartWidget";
export { HumidityChartWidget } from "./widget/HumidityChartWidget";

// Re-export standardized types
export * from './core/types';
import type { WidgetType } from './core/types';

// Legacy interface for backward compatibility (deprecated)
/** @deprecated Use the specific widget config types from './types' instead */
export interface LegacyWidgetConfig {
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

// Re-export from registry
export { 
	getWidgetDefinition,
	getWidgetComponent,
	getAllWidgetTypes,
	getAllWidgetDefinitions,
	registerWidget,
	getWidgetConstraints
} from './core/registry';
