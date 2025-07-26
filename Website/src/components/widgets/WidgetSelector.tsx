import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, BarChart3, TrendingUp, Activity, Cpu, Settings, FileText } from 'lucide-react';

export interface WidgetType {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    category: string;
}

interface WidgetSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectWidget: (widgetType: WidgetType) => void;
}

const availableWidgets: WidgetType[] = [
    {
        id: 'stats',
        name: 'Statistics Card',
        description: 'Display key metrics with trends and icons',
        icon: <TrendingUp className="w-6 h-6" />,
        category: 'Analytics'
    },
    {
        id: 'chart',
        name: 'Chart Widget',
        description: 'Visualize data with bar charts and graphs',
        icon: <BarChart3 className="w-6 h-6" />,
        category: 'Analytics'
    },
    {
        id: 'activity',
        name: 'Activity Feed',
        description: 'Show recent activities and events',
        icon: <Activity className="w-6 h-6" />,
        category: 'Monitoring'
    },
    {
        id: 'system-status',
        name: 'System Status',
        description: 'Monitor system health and status',
        icon: <Cpu className="w-6 h-6" />,
        category: 'Monitoring'
    },
    {
        id: 'quick-actions',
        name: 'Quick Actions',
        description: 'Provide quick access to common actions',
        icon: <Settings className="w-6 h-6" />,
        category: 'Actions'
    }
];

export const WidgetSelector: React.FC<WidgetSelectorProps> = ({ 
    isOpen, 
    onClose, 
    onSelectWidget 
}) => {
    if (!isOpen) return null;

    const groupedWidgets = availableWidgets.reduce((acc, widget) => {
        if (!acc[widget.category]) {
            acc[widget.category] = [];
        }
        acc[widget.category].push(widget);
        return acc;
    }, {} as Record<string, WidgetType[]>);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Select Widget Type</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                
                <div className="grid gap-6">
                    {Object.entries(groupedWidgets).map(([category, widgets]) => (
                        <div key={category}>
                            <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
                                {category}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {widgets.map((widget) => (
                                    <Card 
                                        key={widget.id} 
                                        className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
                                        onClick={() => onSelectWidget(widget)}
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    {widget.icon}
                                                </div>
                                                <CardTitle className="text-base">{widget.name}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <p className="text-sm text-muted-foreground">
                                                {widget.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-end mt-6">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}; 