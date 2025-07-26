import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

export interface WidgetFormData {
    title: string;
    content: string;
    color: string;
}

interface AddWidgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: WidgetFormData) => void;
    initialData?: WidgetFormData;
}

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    initialData 
}) => {
    const [formData, setFormData] = useState<WidgetFormData>(
        initialData || { title: '', content: '', color: 'blue' }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ title: '', content: '', color: 'blue' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Add Custom Widget</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Widget Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter widget title"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Enter widget content"
                            rows={4}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="color">Color Theme</Label>
                        <select
                            id="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="purple">Purple</option>
                            <option value="orange">Orange</option>
                            <option value="red">Red</option>
                            <option value="pink">Pink</option>
                        </select>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {initialData ? 'Update Widget' : 'Add Widget'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 