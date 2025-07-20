import React, { useState } from 'react';
import { TrendingUp, Target, Zap, BookOpen, Coffee, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Habit {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  streak: number;
  target: number;
  completed: boolean[];
  color: string;
}

const defaultHabits: Habit[] = [
  {
    id: '1',
    name: 'Daily Study',
    icon: BookOpen,
    streak: 12,
    target: 2,
    completed: [true, true, false, true, true, true, false],
    color: 'primary'
  },
  {
    id: '2',
    name: 'Morning Reading',
    icon: Coffee,
    streak: 8,
    target: 1,
    completed: [true, false, true, true, true, false, true],
    color: 'secondary'
  },
  {
    id: '3',
    name: 'Sleep 8hrs',
    icon: Moon,
    streak: 15,
    target: 8,
    completed: [true, true, true, false, true, true, true],
    color: 'accent'
  }
];

export const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);

  const toggleHabit = (habitId: string, dayIndex: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = [...habit.completed];
        newCompleted[dayIndex] = !newCompleted[dayIndex];
        return { ...habit, completed: newCompleted };
      }
      return habit;
    }));
  };

  const getWeekDays = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return days;
  };

  const calculateWeekProgress = (completed: boolean[]) => {
    const completedDays = completed.filter(Boolean).length;
    return (completedDays / completed.length) * 100;
  };

  return (
    <Card className="group hover:shadow-royal transition-all duration-300 border-primary/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Habit Tracker
          </CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            This Week
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Week Header */}
        <div className="grid grid-cols-8 gap-2 mb-4">
          <div className="text-xs font-medium text-muted-foreground"></div>
          {getWeekDays().map((day, index) => (
            <div key={index} className="text-xs font-medium text-center text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Habits */}
        {habits.map((habit) => {
          const IconComponent = habit.icon;
          const weekProgress = calculateWeekProgress(habit.completed);
          
          return (
            <div key={habit.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{habit.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3 text-secondary" />
                  {habit.streak} day streak
                </div>
              </div>
              
              <div className="grid grid-cols-8 gap-2">
                <div className="flex items-center">
                  <Progress value={weekProgress} className="w-12 h-2" />
                </div>
                {habit.completed.map((completed, dayIndex) => (
                  <Button
                    key={dayIndex}
                    variant={completed ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleHabit(habit.id, dayIndex)}
                  >
                    {completed ? '✓' : ''}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Weekly Summary */}
        <div className="mt-4 p-3 rounded-lg bg-gradient-subtle border border-primary/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Weekly Progress</span>
            <span className="font-semibold">
              {Math.round(habits.reduce((acc, habit) => acc + calculateWeekProgress(habit.completed), 0) / habits.length)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};