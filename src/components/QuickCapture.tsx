import React, { useState } from 'react';
import { Plus, FileText, Calendar, CheckSquare, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const captureTypes = [
  { id: 'note', label: 'Quick Note', icon: FileText, color: 'primary' },
  { id: 'task', label: 'Task', icon: CheckSquare, color: 'secondary' },
  { id: 'event', label: 'Event', icon: Calendar, color: 'accent' },
  { id: 'idea', label: 'Study Idea', icon: BookOpen, color: 'highlight' },
];

export const QuickCapture: React.FC = () => {
  const [input, setInput] = useState('');
  const [selectedType, setSelectedType] = useState('note');
  const [recentCaptures, setRecentCaptures] = useState([
    { id: 1, text: 'Review chapter 5 notes', type: 'note', time: '2 min ago' },
    { id: 2, text: 'Submit assignment by Friday', type: 'task', time: '5 min ago' },
    { id: 3, text: 'Group study session ideas', type: 'idea', time: '1 hour ago' },
  ]);

  const handleCapture = () => {
    if (!input.trim()) return;
    
    const newCapture = {
      id: Date.now(),
      text: input,
      type: selectedType,
      time: 'now'
    };
    
    setRecentCaptures([newCapture, ...recentCaptures.slice(0, 4)]);
    setInput('');
  };

  const getTypeConfig = (type: string) => 
    captureTypes.find(t => t.id === type) || captureTypes[0];

  return (
    <Card className="group hover:shadow-royal transition-all duration-300 border-primary/10">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-gradient-primary animate-pulse"></div>
          <h3 className="font-semibold text-foreground">Quick Capture</h3>
        </div>

        <div className="space-y-4">
          {/* Type Selector */}
          <div className="flex gap-2 flex-wrap">
            {captureTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.id)}
                className="text-xs"
              >
                <type.icon className="h-3 w-3 mr-1" />
                {type.label}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder={`Add a ${getTypeConfig(selectedType).label.toLowerCase()}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCapture()}
              className="flex-1"
            />
            <Button onClick={handleCapture} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Recent Captures */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Recent</h4>
            {recentCaptures.map((capture) => {
              const typeConfig = getTypeConfig(capture.type);
              return (
                <div key={capture.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <typeConfig.icon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm flex-1 truncate">{capture.text}</span>
                  <Badge variant="outline" className="text-xs">
                    {capture.time}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};