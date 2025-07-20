import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Target,
  Award,
  Clock,
  Brain,
  CheckSquare2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const gpaData = [
  { semester: 'Fall 2023', gpa: 3.2 },
  { semester: 'Spring 2024', gpa: 3.5 },
  { semester: 'Fall 2024', gpa: 3.8 },
  { semester: 'Current', gpa: 3.9 }
];

const taskCompletionData = [
  { week: 'Week 1', completed: 12, assigned: 15 },
  { week: 'Week 2', completed: 18, assigned: 20 },
  { week: 'Week 3', completed: 22, assigned: 25 },
  { week: 'Week 4', completed: 28, assigned: 30 },
  { week: 'Week 5', completed: 25, assigned: 28 },
  { week: 'Week 6', completed: 30, assigned: 32 }
];

const studyHoursData = [
  { day: 'Mon', hours: 4 },
  { day: 'Tue', hours: 6 },
  { day: 'Wed', hours: 3 },
  { day: 'Thu', hours: 5 },
  { day: 'Fri', hours: 2 },
  { day: 'Sat', hours: 8 },
  { day: 'Sun', hours: 6 }
];

const subjectDistribution = [
  { name: 'Computer Science', value: 35, color: 'hsl(252 95% 63%)' },
  { name: 'Mathematics', value: 25, color: 'hsl(32 95% 50%)' },
  { name: 'Physics', value: 20, color: 'hsl(215 16% 47%)' },
  { name: 'English', value: 20, color: 'hsl(142 76% 36%)' }
];

const activityHeatmapData = [
  { day: 'Mon', week1: 3, week2: 5, week3: 2, week4: 7 },
  { day: 'Tue', week1: 6, week2: 4, week3: 8, week4: 5 },
  { day: 'Wed', week1: 4, week2: 7, week3: 3, week4: 6 },
  { day: 'Thu', week1: 8, week2: 6, week3: 9, week4: 4 },
  { day: 'Fri', week1: 2, week2: 3, week3: 5, week4: 8 },
  { day: 'Sat', week1: 9, week2: 8, week3: 7, week4: 9 },
  { day: 'Sun', week1: 7, week2: 5, week3: 6, week4: 7 }
];

export const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const StatCard = ({ title, value, change, icon: Icon, trend }: {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    trend: 'up' | 'down' | 'neutral';
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-card border-border hover:shadow-elegant transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{value}</h3>
              <p className={`text-sm mt-1 ${
                trend === 'up' ? 'text-success' : 
                trend === 'down' ? 'text-destructive' : 
                'text-muted-foreground'
              }`}>
                {change}
              </p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BarChart className="h-8 w-8 text-primary" />
              Academic Analytics
            </h1>
            <p className="text-muted-foreground mt-2">Track your academic progress and performance</p>
          </div>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="semester">This Semester</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Current GPA"
            value="3.89"
            change="+0.12 from last semester"
            icon={Award}
            trend="up"
          />
          <StatCard
            title="Tasks Completed"
            value="147"
            change="+23% this month"
            icon={CheckSquare2}
            trend="up"
          />
          <StatCard
            title="Study Hours"
            value="34h"
            change="This week"
            icon={Clock}
            trend="neutral"
          />
          <StatCard
            title="Active Subjects"
            value="6"
            change="2 new this semester"
            icon={BookOpen}
            trend="up"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* GPA Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  GPA Trend
                </CardTitle>
                <CardDescription>Your academic progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={gpaData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="semester" className="text-xs" />
                    <YAxis domain={[3.0, 4.0]} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="gpa" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Task Completion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Task Completion Rate
                </CardTitle>
                <CardDescription>Weekly task completion vs assignment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={taskCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="assigned" fill="hsl(var(--muted))" radius={4} />
                    <Bar dataKey="completed" fill="hsl(var(--primary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Study Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Weekly Study Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={studyHoursData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="hours" fill="hsl(var(--secondary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subject Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Subject Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={subjectDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {subjectDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Semester Progress</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Assignment Completion</span>
                    <span>89%</span>
                  </div>
                  <Progress value={89} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Study Goal</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Grade Target</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Activity Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Study Activity Heatmap
              </CardTitle>
              <CardDescription>Daily study intensity over the past month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 p-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground mb-2">
                    {day}
                  </div>
                ))}
                {activityHeatmapData.map((dayData) => 
                  Object.entries(dayData).slice(1).map(([week, intensity]) => (
                    <motion.div
                      key={`${dayData.day}-${week}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: Math.random() * 0.5 }}
                      className={`h-8 w-8 rounded border border-border ${
                        Number(intensity) === 0 ? 'bg-muted' :
                        Number(intensity) <= 3 ? 'bg-primary/20' :
                        Number(intensity) <= 6 ? 'bg-primary/50' :
                        'bg-primary'
                      }`}
                      title={`${dayData.day} ${week}: ${intensity} hours`}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};