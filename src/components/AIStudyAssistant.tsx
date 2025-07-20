import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Lightbulb, 
  Clock, 
  Target, 
  RefreshCw,
  Sparkles,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StudyPlan {
  id: string;
  time: string;
  subject: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  duration: string;
}

interface Tip {
  id: string;
  type: 'focus' | 'break' | 'motivation' | 'technique';
  title: string;
  description: string;
}

const mockStudyPlans: StudyPlan[] = [
  { id: '1', time: '9:00 AM', subject: 'Mathematics', task: 'Review calculus derivatives', priority: 'high', duration: '45 min' },
  { id: '2', time: '10:00 AM', subject: 'Break', task: 'Take a 15-minute walk', priority: 'medium', duration: '15 min' },
  { id: '3', time: '10:15 AM', subject: 'Computer Science', task: 'Practice algorithms', priority: 'high', duration: '60 min' },
  { id: '4', time: '11:30 AM', subject: 'Physics', task: 'Read chapter 5', priority: 'medium', duration: '30 min' }
];

const mockTips: Tip[] = [
  {
    id: '1',
    type: 'focus',
    title: 'Pomodoro Technique',
    description: 'Try 25 minutes of focused study followed by a 5-minute break'
  },
  {
    id: '2',
    type: 'break',
    title: 'Take a Break',
    description: "You've been studying for 2 hours. Consider a 15-minute break to recharge"
  },
  {
    id: '3',
    type: 'motivation',
    title: 'Great Progress!',
    description: "You've completed 8 out of 10 tasks this week. Keep up the excellent work!"
  },
  {
    id: '4',
    type: 'technique',
    title: 'Active Recall',
    description: 'Test yourself on the material instead of just re-reading notes'
  }
];

const motivationalQuotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The expert in anything was once a beginner.",
  "Education is the most powerful weapon you can use to change the world.",
  "Learning never exhausts the mind.",
  "The beautiful thing about learning is nobody can take it away from you."
];

export const AIStudyAssistant: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<StudyPlan[]>(mockStudyPlans);
  const [currentTip, setCurrentTip] = useState<Tip>(mockTips[0]);
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewPlan = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // Simulate AI generation with different mock data
      const newPlans: StudyPlan[] = [
        { id: '5', time: '2:00 PM', subject: 'English', task: 'Essay writing practice', priority: 'high', duration: '50 min' },
        { id: '6', time: '3:00 PM', subject: 'Break', task: 'Meditation session', priority: 'low', duration: '10 min' },
        { id: '7', time: '3:10 PM', subject: 'History', task: 'Chapter review', priority: 'medium', duration: '40 min' },
        { id: '8', time: '4:00 PM', subject: 'Chemistry', task: 'Lab report', priority: 'high', duration: '45 min' }
      ];
      
      setCurrentPlan(newPlans);
      setCurrentTip(mockTips[Math.floor(Math.random() * mockTips.length)]);
      setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
      setIsGenerating(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted';
    }
  };

  const getTipIcon = (type: string) => {
    switch (type) {
      case 'focus': return Target;
      case 'break': return Clock;
      case 'motivation': return TrendingUp;
      case 'technique': return Lightbulb;
      default: return Brain;
    }
  };

  return (
    <Card className="shadow-card border-border hover:shadow-elegant transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <Brain className="h-5 w-5 text-primary" />
          </motion.div>
          AI Study Assistant
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-secondary" />
          </motion.div>
        </CardTitle>
        <CardDescription>Personalized study recommendations powered by AI</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Generate Plan Button */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-foreground">Today's Study Plan</h3>
          <Button
            onClick={generateNewPlan}
            disabled={isGenerating}
            size="sm"
            className="bg-gradient-primary text-primary-foreground hover:shadow-glow"
          >
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
              </motion.div>
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Plan'}
          </Button>
        </div>

        {/* Study Plan */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPlan[0]?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {isGenerating ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="h-16 bg-muted rounded-lg"
                  />
                ))}
              </div>
            ) : (
              currentPlan.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-primary min-w-[60px]">
                      {item.time}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.task}</p>
                      <p className="text-xs text-muted-foreground">{item.subject} • {item.duration}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Smart Tip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="p-4 bg-primary/5 border border-primary/20 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0"
            >
              {React.createElement(getTipIcon(currentTip.type), { 
                className: "h-4 w-4 text-primary" 
              })}
            </motion.div>
            <div>
              <h4 className="font-medium text-sm text-foreground">{currentTip.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{currentTip.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-xs font-medium text-secondary">Daily Motivation</span>
          </div>
          <p className="text-sm text-foreground italic">"{currentQuote}"</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-3 bg-card border rounded-lg"
          >
            <CheckCircle className="h-5 w-5 text-success mx-auto mb-1" />
            <p className="text-sm font-medium text-foreground">8</p>
            <p className="text-xs text-muted-foreground">Tasks Done</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-3 bg-card border rounded-lg"
          >
            <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-sm font-medium text-foreground">4.5h</p>
            <p className="text-xs text-muted-foreground">Study Time</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-3 bg-card border rounded-lg"
          >
            <TrendingUp className="h-5 w-5 text-secondary mx-auto mb-1" />
            <p className="text-sm font-medium text-foreground">92%</p>
            <p className="text-xs text-muted-foreground">Progress</p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};