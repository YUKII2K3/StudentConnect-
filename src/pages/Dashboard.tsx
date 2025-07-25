import React, { useState, useEffect } from 'react';
import { CheckSquare, FileText, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarWidget } from '@/components/CalendarWidget';
import { GradeTracker } from '@/components/GradeTracker';
import { StudyTimer } from '@/components/StudyTimer';
import { QuickCapture } from '@/components/QuickCapture';
import { HabitTracker } from '@/components/HabitTracker';
import { AssignmentCountdown } from '@/components/AssignmentCountdown';
import { StudySessionWidget } from '@/components/StudySessionWidget';
import { KnowledgeBaseWidget } from '@/components/KnowledgeBaseWidget';
import { DailyPlannerWidget } from '@/components/DailyPlannerWidget';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayValue(prev => {
          if (prev >= value) {
            clearInterval(interval);
            return value;
          }
          return Math.min(prev + Math.ceil(value / 20), value);
        });
      }, 50);
      
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <Card 
      className="hover-lift shadow-card border-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {displayValue}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <TrendingUp className="h-3 w-3" />
          <span>All time</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalNotes: 0,
  });

  const studyHours = 24; // Mock data for study hours

  useEffect(() => {
    if (!user) return;

    // Load tasks
    const tasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || '[]');
    const notes = JSON.parse(localStorage.getItem(`notes_${user.id}`) || '[]');
    
    setStats({
      totalTasks: tasks.length,
      completedTasks: tasks.filter((task: any) => task.completed).length,
      totalNotes: notes.length,
    });
  }, [user]);

  const formatLastLogin = () => {
    if (!user?.lastLogin) return 'Never';
    const date = new Date(user.lastLogin);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ===============================
  // Motivational Quote Card (External API Integration)
  // ===============================
  const [quote, setQuote] = useState<{ content: string; author: string } | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState('');

  const fetchQuote = async () => {
    setQuoteLoading(true);
    setQuoteError('');
    try {
      const res = await fetch('https://api.quotable.io/random');
      if (!res.ok) throw new Error('Failed to fetch quote');
      const data = await res.json();
      setQuote({ content: data.content, author: data.author });
    } catch (err) {
      setQuoteError('Could not load quote.');
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Card className="bg-accent/10 border-0 shadow-none">
          <CardContent className="flex flex-col items-center py-6">
            {quoteLoading ? (
              <span className="text-muted-foreground">Loading quote...</span>
            ) : quoteError ? (
              <span className="text-destructive">{quoteError}</span>
            ) : quote ? (
              <>
                <div className="text-lg italic text-center mb-2">"{quote.content}"</div>
                <div className="text-sm text-muted-foreground mb-2">— {quote.author}</div>
              </>
            ) : null}
            <button
              className="mt-2 px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
              onClick={fetchQuote}
              disabled={quoteLoading}
            >
              {quoteLoading ? 'Refreshing...' : 'New Quote'}
            </button>
          </CardContent>
        </Card>
      </div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          Ready to continue your learning journey? Last login: {formatLastLogin()}
        </p>
      </div>

      {/* Notion-Style Grid Layout */}
      <div className="space-y-6">
        {/* Top Row - Calendar & Quick Capture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalendarWidget />
          </div>
          <div>
            <QuickCapture />
          </div>
        </div>

        {/* Second Row - Stats & Core Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon={<CheckSquare className="h-5 w-5" />}
            color="primary"
            delay={100}
          />
          <StatCard
            title="Completed"
            value={stats.completedTasks}
            icon={<TrendingUp className="h-5 w-5" />}
            color="secondary"
            delay={200}
          />
          <StatCard
            title="Notes"
            value={stats.totalNotes}
            icon={<FileText className="h-5 w-5" />}
            color="accent"
            delay={300}
          />
          <StatCard
            title="Study Hours"
            value={studyHours}
            icon={<Clock className="h-5 w-5" />}
            color="highlight"
            delay={400}
          />
        </div>

        {/* Third Row - Academic Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AssignmentCountdown />
          <HabitTracker />
          <StudySessionWidget />
        </div>

        {/* Fourth Row - Progress & Knowledge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GradeTracker />
          <KnowledgeBaseWidget />
        </div>

        {/* Fifth Row - Planner & Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DailyPlannerWidget />
          </div>
          <StudyTimer />
        </div>

        {/* Fallback Content for Empty States */}
        {stats.totalTasks === 0 && stats.totalNotes === 0 && (
          <Card className="text-center py-12 border-dashed border-2 border-primary/20">
            <CardContent>
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Ready to get started?</h3>
              <p className="text-muted-foreground mb-4">
                Your academic dashboard is ready! Start by creating your first task or note.
              </p>
              <div className="flex gap-2 justify-center">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Create Task
                </button>
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  Add Note
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};