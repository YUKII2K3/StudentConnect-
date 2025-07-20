import React, { useState } from 'react';
import { CalendarDays, Plus, Clock, CheckCircle, Circle, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TimeBlock {
  id: string;
  title: string;
  time: string;
  duration: number; // minutes
  type: 'study' | 'class' | 'break' | 'assignment' | 'personal';
  completed: boolean;
  color: string;
}

const mockTimeBlocks: TimeBlock[] = [
  {
    id: '1',
    title: 'Physics Lecture',
    time: '09:00',
    duration: 90,
    type: 'class',
    completed: true,
    color: 'primary'
  },
  {
    id: '2',
    title: 'Study Break',
    time: '10:30',
    duration: 15,
    type: 'break',
    completed: true,
    color: 'secondary'
  },
  {
    id: '3',
    title: 'Math Problem Set',
    time: '10:45',
    duration: 60,
    type: 'study',
    completed: false,
    color: 'accent'
  },
  {
    id: '4',
    title: 'History Essay Draft',
    time: '12:00',
    duration: 120,
    type: 'assignment',
    completed: false,
    color: 'highlight'
  },
  {
    id: '5',
    title: 'Lunch',
    time: '14:00',
    duration: 60,
    type: 'personal',
    completed: false,
    color: 'muted'
  },
  {
    id: '6',
    title: 'Chemistry Lab Review',
    time: '15:00',
    duration: 90,
    type: 'study',
    completed: false,
    color: 'primary'
  }
];

export const DailyPlannerWidget: React.FC = () => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(mockTimeBlocks);
  const [currentTime] = useState(new Date());

  const toggleCompletion = (id: string) => {
    setTimeBlocks(blocks => 
      blocks.map(block => 
        block.id === id ? { ...block, completed: !block.completed } : block
      )
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class': return '🎓';
      case 'study': return '📚';
      case 'break': return '☕';
      case 'assignment': return '📝';
      case 'personal': return '🍽️';
      default: return '📅';
    }
  };

  const isCurrentBlock = (timeString: string, duration: number) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const blockStart = new Date(currentTime);
    blockStart.setHours(hours, minutes, 0, 0);
    const blockEnd = new Date(blockStart.getTime() + duration * 60000);
    
    return currentTime >= blockStart && currentTime <= blockEnd;
  };

  const isUpcoming = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const blockTime = new Date(currentTime);
    blockTime.setHours(hours, minutes, 0, 0);
    
    return blockTime > currentTime;
  };

  const completedBlocks = timeBlocks.filter(block => block.completed).length;
  const totalBlocks = timeBlocks.length;
  const progressPercent = (completedBlocks / totalBlocks) * 100;

  const getCurrentTimeString = () => {
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="group hover:shadow-royal transition-all duration-300 border-primary/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Daily Planner
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getCurrentTimeString()}
            </Badge>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Today's Progress</span>
            <span className="font-medium">{completedBlocks}/{totalBlocks} completed</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Time Blocks */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {timeBlocks.map((block, index) => {
            const isCurrent = isCurrentBlock(block.time, block.duration);
            const upcoming = isUpcoming(block.time);
            
            return (
              <div
                key={block.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                  isCurrent 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : block.completed 
                      ? 'border-green-200 bg-green-50 opacity-75' 
                      : 'border-border hover:border-primary/20'
                }`}
              >
                {/* Time */}
                <div className="text-sm font-mono text-muted-foreground min-w-12">
                  {block.time}
                </div>

                {/* Completion Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleCompletion(block.id)}
                >
                  {block.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getTypeIcon(block.type)}</span>
                    <h4 className={`font-medium text-sm truncate ${
                      block.completed ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {block.title}
                    </h4>
                    {isCurrent && (
                      <Badge variant="default" className="text-xs animate-pulse">
                        Now
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {block.duration} minutes
                    </span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {block.type}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              {timeBlocks.filter(b => b.type === 'study').length}
            </div>
            <div className="text-xs text-muted-foreground">Study Blocks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-secondary">
              {Math.round(timeBlocks.reduce((acc, b) => acc + b.duration, 0) / 60 * 10) / 10}h
            </div>
            <div className="text-xs text-muted-foreground">Total Time</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-accent">
              {timeBlocks.filter(b => !b.completed && isUpcoming(b.time)).length}
            </div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};