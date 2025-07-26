import React, { useState, useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
    Plus,
    Trash2,
    RefreshCw,
    Edit3,
    Users, 
    Cpu, 
    Database, 
    Settings, 
    Bell
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Import widgets from separate files
import {
    StatsCard,
    ChartWidget,
    ActivityWidget,
    SystemStatusWidget,
    QuickActionsWidget,
    WidgetSelector,
    type StatsCardProps,
    type ChartWidgetProps,
    type ActivityWidgetProps,
    type SystemStatusWidgetProps,
    type QuickActionsWidgetProps,
    type WidgetType,
    type Activity,
    type System,
    type Action
} from '@/components/widgets';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Custom CSS to hide resize handles but keep functionality
const gridStyles = `
  .react-resizable-handle {
    opacity: 0 !important;
    background: transparent !important;
  }
  .react-resizable-handle::after {
    display: none !important;
  }
  .react-resizable-handle-se {
    opacity: 0 !important;
    background: transparent !important;
  }
  .react-resizable-handle-se::after {
    display: none !important;
  }
  .react-resizable-handle-sw {
    opacity: 0 !important;
    background: transparent !important;
  }
  .react-resizable-handle-sw::after {
    display: none !important;
  }
  .react-resizable-handle-nw {
    opacity: 0 !important;
    background: transparent !important;
  }
  .react-resizable-handle-nw::after {
    display: none !important;
  }
  .react-resizable-handle-ne {
    opacity: 0 !important;
    background: transparent !important;
  }
  .react-resizable-handle-ne::after {
    display: none !important;
  }
  .react-resizable-handle-w {
    opacity: 0 !important;
    background: transparent !important;
  }
  .react-resizable-handle-w::after {
    display: none !important;
  }
  .react-resizable-handle-e {
    opacity: 0 !important;
    background: transparent !important;
  }
  .react-resizable-handle-e::after {
    display: none !important;
  }
  .react-resizable-handle-n {
    opacity: 0 !important;
    background: transparent !important;
  }
  .react-resizable-handle-n::after {
    display: none !important;
  }
  .react-resizable-handle-s {
    opacity: 0 !important;
    background: transparent !important;
  }
  .react-resizable-handle-s::after {
    display: none !important;
  }
`;

// TypeScript interfaces - now imported from widgets

// Widget Components - now imported from separate files

export default function DevPage() {
    const [editMode, setEditMode] = useState(false);
    const [showWidgetSelector, setShowWidgetSelector] = useState(false);
    const [nextWidgetId, setNextWidgetId] = useState(1);
    
    const [layouts, setLayouts] = useState({
        lg: [] as Array<{ i: string; x: number; y: number; w: number; h: number }>
    });

    const [widgets, setWidgets] = useState({});



    const onLayoutChange = (currentLayout: any, allLayouts: any) => {
        setLayouts(allLayouts);
    };

    const addWidgetToLayout = (widgetId: string, widgetType: string) => {
        // Add to layout with equal block size (3x2)
        const currentLayout = layouts.lg;
        const lastWidget = currentLayout.length > 0 ? currentLayout[currentLayout.length - 1] : null;
        const newY = lastWidget ? lastWidget.y + lastWidget.h : 0;
        
        setLayouts(prev => ({
            ...prev,
            lg: [...prev.lg, { i: widgetId, x: 0, y: newY, w: 3, h: 2 }]
        }));
    };

    const handleWidgetSelection = (widgetType: WidgetType) => {
        setShowWidgetSelector(false);
        
        // Add predefined widget
        const widgetId = `${widgetType.id}-${nextWidgetId}`;
        
        // Create widget data based on type
        switch (widgetType.id) {
            case 'stats':
                setWidgets(prev => ({
                    ...prev,
                    [widgetId]: { 
                        title: 'New Stats', 
                        value: '0', 
                        change: 0, 
                        icon: Users, 
                        color: 'blue' 
                    }
                }));
                break;
            case 'chart':
                setWidgets(prev => ({
                    ...prev,
                    [widgetId]: { 
                        title: 'New Chart', 
                        data: [10, 20, 30, 40, 50, 60, 70] 
                    }
                }));
                break;
            case 'activity':
                setWidgets(prev => ({
                    ...prev,
                    [widgetId]: {
                        title: 'Recent Activity',
                        activities: [
                            { title: 'New activity added', time: 'Just now', type: 'Info' }
                        ]
                    }
                }));
                break;
            case 'system-status':
                setWidgets(prev => ({
                    ...prev,
                    [widgetId]: {
                        title: 'System Status',
                        systems: [
                            { name: 'New System', status: 'online' }
                        ]
                    }
                }));
                break;
            case 'quick-actions':
                setWidgets(prev => ({
                    ...prev,
                    [widgetId]: {
                        title: 'Quick Actions',
                        actions: [
                            { label: 'Action 1', icon: <Settings className="w-4 h-4" /> },
                            { label: 'Action 2', icon: <Settings className="w-4 h-4" /> }
                        ]
                    }
                }));
                break;
        }
        
        addWidgetToLayout(widgetId, widgetType.id);
        setNextWidgetId(prev => prev + 1);
    };



    const deleteWidget = (widgetId: string) => {
        // Remove from widgets if it exists
        if (widgets[widgetId as keyof typeof widgets]) {
            setWidgets(prev => {
                const newWidgets = { ...prev };
                delete newWidgets[widgetId as keyof typeof widgets];
                return newWidgets;
            });
        }

        // Remove from layout
        setLayouts(prev => ({
            ...prev,
            lg: prev.lg.filter(item => item.i !== widgetId)
        }));
    };

    const renderWidget = (widgetId: string) => {
        const widget = widgets[widgetId as keyof typeof widgets];
        
        // Render widgets with delete functionality
        const widgetComponent = (() => {
            switch (widgetId.split('-')[0]) {
                case 'stats':
                    return <StatsCard {...(widget as StatsCardProps)} />;
                case 'chart':
                    return <ChartWidget {...(widget as ChartWidgetProps)} />;
                case 'activity':
                    return <ActivityWidget {...(widget as ActivityWidgetProps)} />;
                case 'system':
                    return <SystemStatusWidget {...(widget as SystemStatusWidgetProps)} />;
                case 'quick':
                    return <QuickActionsWidget {...(widget as QuickActionsWidgetProps)} />;
                default:
                    return <div>Unknown Widget</div>;
            }
        })();

        return (
            <div className="relative group">
                {widgetComponent}
                {editMode && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteWidget(widgetId)}
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                )}
            </div>
        );
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
            <style>{gridStyles}</style>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8 mt-16">
                    <div>
                        <h1 className="text-4xl font-bold text-primary">Development Dashboard</h1>
                        <p className="text-muted-foreground mt-2">Monitor your IoT system in real-time</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Switch id="edit-mode" checked={editMode} onCheckedChange={setEditMode} />
                            <label htmlFor="edit-mode" className="text-sm font-medium">
                                {editMode ? 'Edit Mode' : 'View Mode'}
                            </label>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowWidgetSelector(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Widget
                        </Button>
                        <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                        <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </Button>
                    </div>
                </div>

                <ResponsiveGridLayout
                    className="layout"
                    layouts={layouts}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={100}
                    onLayoutChange={onLayoutChange}
                    isDraggable={editMode}
                    isResizable={editMode}
                    margin={[16, 16]}
                    containerPadding={[0, 0]}
                >
                    {Object.keys(widgets).map((widgetId) => (
                        <div key={widgetId} className="widget">
                            {renderWidget(widgetId)}
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>

            <WidgetSelector
                isOpen={showWidgetSelector}
                onClose={() => setShowWidgetSelector(false)}
                onSelectWidget={handleWidgetSelection}
            />
        </div>
    );
}