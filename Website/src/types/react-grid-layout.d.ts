declare module 'react-grid-layout' {
  import { Component } from 'react';
  
  export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
    resizeHandles?: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>;
    isBounded?: boolean;
  }

  export interface ResponsiveProps {
    className?: string;
    style?: React.CSSProperties;
    layouts: { [key: string]: Layout[] };
    breakpoints?: { [key: string]: number };
    cols?: { [key: string]: number };
    rowHeight?: number;
    onLayoutChange?: (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => void;
    onBreakpointChange?: (newBreakpoint: string, newCols: number) => void;
    onWidthChange?: (containerWidth: number, margin: [number, number], cols: number, containerPadding: [number, number]) => void;
    isDraggable?: boolean;
    isResizable?: boolean;
    margin?: [number, number] | { [key: string]: [number, number] };
    containerPadding?: [number, number] | { [key: string]: [number, number] };
    children?: React.ReactNode;
  }

  export class Responsive extends Component<ResponsiveProps> {}
  
  export function WidthProvider<P extends object>(
    Component: React.ComponentType<P>
  ): React.ComponentType<P & ResponsiveProps>;
} 