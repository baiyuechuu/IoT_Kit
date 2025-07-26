import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface CustomWidget {
    id: string;
    title: string;
    content: string;
    type: 'custom';
    color?: string;
}

export const CustomWidget: React.FC<CustomWidget> = ({ title, content, color = "blue" }) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="prose prose-sm max-w-none">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
            </div>
        </CardContent>
    </Card>
); 