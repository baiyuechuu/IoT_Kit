import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

export interface Activity {
    title: string;
    time: string;
    type: string;
}

export interface ActivityWidgetProps {
    activities: Activity[];
}

export const ActivityWidget: React.FC<ActivityWidgetProps> = ({ activities }) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {activities.map((activity: Activity, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            {activity.type}
                        </Badge>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
); 