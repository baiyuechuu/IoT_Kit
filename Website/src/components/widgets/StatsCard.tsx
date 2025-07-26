import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface StatsCardProps {
    title: string;
    value: string;
    change: number;
    icon: LucideIcon;
    color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = "blue" 
}) => (
    <Card className="h-full">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                    <div className="flex items-center mt-2">
                        <TrendingUp className={`w-4 h-4 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={`text-sm ml-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {change >= 0 ? '+' : ''}{change}%
                        </span>
                    </div>
                </div>
                <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/20`}>
                    <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
                </div>
            </div>
        </CardContent>
    </Card>
); 