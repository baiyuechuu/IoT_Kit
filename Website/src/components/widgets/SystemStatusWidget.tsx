import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu } from 'lucide-react';

export interface System {
    name: string;
    status: 'online' | 'offline';
}

export interface SystemStatusWidgetProps {
    systems: System[];
}

export const SystemStatusWidget: React.FC<SystemStatusWidgetProps> = ({ systems }) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                System Status
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                {systems.map((system: System, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${system.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm">{system.name}</span>
                        </div>
                        <Badge variant={system.status === 'online' ? 'default' : 'destructive'}>
                            {system.status}
                        </Badge>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
); 