import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, TrendingUp, Clock, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface StudySession {
  id: string;
  subject: string;
  duration: number; // in minutes
  date: Date;
  completed: boolean;
}

export const StudySessionWidget: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const [currentSubject, setCurrentSubject] = useState('Mathematics');
  const [todaysSessions] = useState<StudySession[]>([
    { id: '1', subject: 'Physics', duration: 45, date: new Date(), completed: true },
    { id: '2', subject: 'History', duration: 30, date: new Date(), completed: true },
    { id: '3', subject: 'Chemistry', duration: 25, date: new Date(), completed: false },
  ]);

  const [weeklyGoal] = useState(300); // minutes per week
  const [weeklyProgress] = useState(185); // current weekly minutes

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTodayTotal = () => {
    return todaysSessions.reduce((total, session) => 
      session.completed ? total + session.duration : total, 0
    );
  };

  const getWeeklyProgressPercent = () => {
    return Math.min((weeklyProgress / weeklyGoal) * 100, 100);
  };

  const startSession = () => {
    setIsActive(true);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const stopSession = () => {
    setIsActive(false);
    setTimeElapsed(0);
  };

  return (
    <Card className="group hover:shadow-royal transition-all duration-300 border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Study Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Timer */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-3xl font-mono font-bold text-primary">
              {formatTime(timeElapsed)}
            </div>
            <Badge variant="outline" className="mt-2">
              {currentSubject}
            </Badge>
          </div>

          <div className="flex justify-center gap-2">
            {!isActive ? (
              <Button onClick={startSession} className="gap-2">
                <Play className="h-4 w-4" />
                Start
              </Button>
            ) : (
              <Button onClick={pauseSession} variant="secondary" className="gap-2">
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            )}
            <Button onClick={stopSession} variant="outline" className="gap-2">
              <Square className="h-4 w-4" />
              Stop
            </Button>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Today</span>
            </div>
            <span className="font-medium">{getTodayTotal()} minutes</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {todaysSessions.map((session) => (
              <div
                key={session.id}
                className={`p-2 rounded text-center text-xs ${
                  session.completed 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'bg-muted/50 text-muted-foreground'
                }`}
              >
                <div className="font-medium">{session.subject}</div>
                <div>{session.duration}m</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Weekly Goal</span>
            </div>
            <span className="font-medium">{weeklyProgress}/{weeklyGoal} min</span>
          </div>
          <Progress value={getWeeklyProgressPercent()} className="h-2" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
              Streak
            </div>
            <div className="text-lg font-semibold text-primary">7 days</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Avg/Day</div>
            <div className="text-lg font-semibold text-primary">2.1h</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};