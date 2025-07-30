export { SwitchWidget } from "./SwitchWidget";

// Re-export standardized types
export * from './types';
import type { WidgetType } from './types';

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

// Re-export from registry for backward compatibility
export { 
	WIDGET_CONSTRAINTS,
	WIDGET_REGISTRY,
	getWidgetDefinition,
	getWidgetComponent,
	getWidgetConstraints,
	getWidgetMetadata,
	getAllWidgetTypes,
	getWidgetsByCategory,
	getWidgetsByDifficulty,
	getWidgetsByTags
} from './registry';
