import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export interface ChartWidgetProps {
    title: string;
    data: number[];
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ title, data }) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-48 flex items-end justify-between gap-1">
                {data.map((value: number, index: number) => (
                    <div
                        key={index}
                        className="flex-1 bg-primary/20 rounded-t"
                        style={{ height: `${(value / Math.max(...data)) * 100}%` }}
                    />
                ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
            </div>
        </CardContent>
    </Card>
); 