import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, Coffee, Brain, Clock, Target } from 'lucide-react';

interface StudySession {
  id: string;
  subject: string;
  duration: number; // in minutes
  type: 'study' | 'break';
  completed: boolean;
  date: Date;
}

export const StudyTimer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(25 * 60); // 25 minutes in seconds
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<'study' | 'break'>('study');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0); // in minutes

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
  
  const presets = {
    pomodoro: { study: 25, break: 5 },
    extended: { study: 45, break: 15 },
    sprint: { study: 15, break: 5 },
    deep: { study: 90, break: 30 }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(time => time - 1);
      }, 1000);
    } else if (currentTime === 0 && isRunning) {
      // Session completed
      handleSessionComplete();
    }
    
    return () => clearInterval(interval);
  }, [isRunning, currentTime]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (currentSession === 'study') {
      setSessionsCompleted(prev => prev + 1);
      setTotalStudyTime(prev => prev + initialTime / 60);
      // Switch to break
      setCurrentSession('break');
      const breakTime = presets.pomodoro.break * 60;
      setCurrentTime(breakTime);
      setInitialTime(breakTime);
    } else {
      // Switch back to study
      setCurrentSession('study');
      const studyTime = presets.pomodoro.study * 60;
      setCurrentTime(studyTime);
      setInitialTime(studyTime);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const time = presets.pomodoro[currentSession] * 60;
    setCurrentTime(time);
    setInitialTime(time);
  };

  const setPreset = (preset: keyof typeof presets) => {
    const time = presets[preset][currentSession] * 60;
    setCurrentTime(time);
    setInitialTime(time);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - currentTime) / initialTime) * 100;
  const isStudySession = currentSession === 'study';

  return (
    <div className="space-y-6">
      <Card className="shadow-royal hover-lift transition-royal">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-royal bg-clip-text text-transparent">
            Study Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className={`relative inline-flex items-center justify-center w-48 h-48 rounded-full ${
              isStudySession ? 'bg-gradient-royal' : 'bg-gradient-to-br from-secondary to-secondary/80'
            } mb-6 shadow-glow`}>
              <div className="text-6xl font-bold text-white">
                {formatTime(currentTime)}
              </div>
            </div>
            
            <div className="space-y-2">
              <Badge variant={isStudySession ? "default" : "secondary"} className="text-lg px-4 py-2">
                {isStudySession ? (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Study Session
                  </>
                ) : (
                  <>
                    <Coffee className="h-4 w-4 mr-2" />
                    Break Time
                  </>
                )}
              </Badge>
              
              {isStudySession && (
                <p className="text-lg font-medium text-muted-foreground">
                  {selectedSubject}
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={isRunning ? pauseTimer : startTimer}
              size="lg"
              className={isStudySession ? "btn-royal" : "btn-gold"}
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </>
              )}
            </Button>
            
            <Button onClick={resetTimer} variant="outline" size="lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Preset</label>
              <Select onValueChange={(value) => setPreset(value as keyof typeof presets)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pomodoro">Pomodoro (25/5)</SelectItem>
                  <SelectItem value="extended">Extended (45/15)</SelectItem>
                  <SelectItem value="sprint">Sprint (15/5)</SelectItem>
                  <SelectItem value="deep">Deep Work (90/30)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{sessionsCompleted}</div>
            <div className="text-sm text-muted-foreground">Sessions Completed</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold text-secondary">{Math.round(totalStudyTime)}</div>
            <div className="text-sm text-muted-foreground">Minutes Studied</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <Brain className="h-8 w-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold text-accent">
              {totalStudyTime > 0 ? Math.round((totalStudyTime / 60) * 10) / 10 : 0}
            </div>
            <div className="text-sm text-muted-foreground">Hours This Week</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};