import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, Calendar, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  progress: number;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Physics Lab Report',
    subject: 'Physics',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    progress: 35,
    priority: 'high',
    completed: false
  },
  {
    id: '2',
    title: 'History Essay',
    subject: 'History',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    progress: 60,
    priority: 'medium',
    completed: false
  },
  {
    id: '3',
    title: 'Math Problem Set',
    subject: 'Mathematics',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
    progress: 80,
    priority: 'high',
    completed: false
  }
];

export const AssignmentCountdown: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getTimeRemaining = (dueDate: Date) => {
    const now = currentTime.getTime();
    const due = dueDate.getTime();
    const diff = due - now;

    if (diff <= 0) return { expired: true, text: 'Overdue!' };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return { expired: false, text: `${days}d ${hours}h`, urgent: days <= 1 };
    } else if (hours > 0) {
      return { expired: false, text: `${hours}h ${minutes}m`, urgent: true };
    } else {
      return { expired: false, text: `${minutes}m`, urgent: true };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const markCompleted = (id: string) => {
    setAssignments(assignments.map(assignment =>
      assignment.id === id ? { ...assignment, completed: true, progress: 100 } : assignment
    ));
  };

  const sortedAssignments = assignments
    .filter(a => !a.completed)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return (
    <Card className="group hover:shadow-royal transition-all duration-300 border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Assignment Countdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedAssignments.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-muted-foreground">All assignments completed!</p>
          </div>
        ) : (
          sortedAssignments.map((assignment) => {
            const timeRemaining = getTimeRemaining(assignment.dueDate);
            
            return (
              <div
                key={assignment.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  timeRemaining.urgent ? 'border-destructive/20 bg-destructive/5' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">{assignment.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(assignment.priority)} className="text-xs">
                      {assignment.priority}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markCompleted(assignment.id)}
                      className="h-6 px-2"
                    >
                      ✓
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{assignment.progress}%</span>
                  </div>
                  <Progress value={assignment.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {assignment.dueDate.toLocaleDateString()}
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    timeRemaining.expired 
                      ? 'text-destructive' 
                      : timeRemaining.urgent 
                        ? 'text-orange-600' 
                        : 'text-green-600'
                  }`}>
                    {timeRemaining.urgent && <AlertTriangle className="h-3 w-3" />}
                    {timeRemaining.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};