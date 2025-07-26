import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export interface Action {
    label: string;
    icon: React.ReactNode;
}

export interface QuickActionsWidgetProps {
    actions: Action[];
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({ actions }) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Actions
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-2">
                {actions.map((action, index) => (
                    <Button key={index} variant="outline" size="sm" className="h-12">
                        {action.icon}
                        <span className="ml-2">{action.label}</span>
                    </Button>
                ))}
            </div>
        </CardContent>
    </Card>
); 