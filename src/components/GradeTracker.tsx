import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Award, BookOpen, Plus } from 'lucide-react';

interface Grade {
  id: string;
  subject: string;
  assignment: string;
  score: number;
  maxScore: number;
  date: Date;
  type: 'exam' | 'assignment' | 'quiz' | 'project';
}

interface SubjectGPA {
  subject: string;
  gpa: number;
  credits: number;
  grades: Grade[];
  color: string;
}

// Mock data
const mockGrades: Grade[] = [
  {
    id: '1',
    subject: 'Mathematics',
    assignment: 'Calculus Midterm',
    score: 88,
    maxScore: 100,
    date: new Date(2024, 10, 15),
    type: 'exam'
  },
  {
    id: '2',
    subject: 'Physics',
    assignment: 'Lab Report 3',
    score: 92,
    maxScore: 100,
    date: new Date(2024, 10, 20),
    type: 'assignment'
  },
  {
    id: '3',
    subject: 'Chemistry',
    assignment: 'Organic Chemistry Quiz',
    score: 76,
    maxScore: 100,
    date: new Date(2024, 10, 22),
    type: 'quiz'
  },
  {
    id: '4',
    subject: 'Mathematics',
    assignment: 'Problem Set 5',
    score: 94,
    maxScore: 100,
    date: new Date(2024, 10, 25),
    type: 'assignment'
  }
];

export const GradeTracker: React.FC = () => {
  const [grades] = useState<Grade[]>(mockGrades);

  // Calculate subject GPAs
  const subjectGPAs: SubjectGPA[] = [
    {
      subject: 'Mathematics',
      gpa: 3.8,
      credits: 4,
      grades: grades.filter(g => g.subject === 'Mathematics'),
      color: 'from-primary to-primary/80'
    },
    {
      subject: 'Physics',
      gpa: 3.9,
      credits: 4,
      grades: grades.filter(g => g.subject === 'Physics'),
      color: 'from-secondary to-secondary/80'
    },
    {
      subject: 'Chemistry',
      gpa: 3.2,
      credits: 3,
      grades: grades.filter(g => g.subject === 'Chemistry'),
      color: 'from-accent to-accent/80'
    }
  ];

  const overallGPA = 3.63;
  const targetGPA = 3.8;
  const gpaProgress = (overallGPA / 4.0) * 100;

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    return 'F';
  };

  const getTypeIcon = (type: Grade['type']) => {
    switch (type) {
      case 'exam':
        return '📝';
      case 'assignment':
        return '📚';
      case 'quiz':
        return '❓';
      case 'project':
        return '🎯';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall GPA Card */}
      <Card className="shadow-royal hover-lift transition-royal">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-royal bg-clip-text text-transparent">
              Grade Overview
            </CardTitle>
            <Button size="sm" className="btn-royal">
              <Plus className="h-4 w-4 mr-2" />
              Add Grade
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current GPA */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-royal mb-4">
                <span className="text-2xl font-bold text-white">{overallGPA}</span>
              </div>
              <h3 className="font-semibold text-lg">Current GPA</h3>
              <p className="text-sm text-muted-foreground">Out of 4.0</p>
            </div>

            {/* Target Progress */}
            <div className="text-center">
              <div className="mb-4">
                <Award className="h-12 w-12 mx-auto text-secondary mb-2" />
                <div className="space-y-2">
                  <Progress value={gpaProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {gpaProgress.toFixed(1)}% towards 4.0
                  </p>
                </div>
              </div>
              <h3 className="font-semibold text-lg">Progress</h3>
              <p className="text-sm text-muted-foreground">Target: {targetGPA}</p>
            </div>

            {/* Trend */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="font-semibold text-lg text-green-600">Improving</h3>
              <p className="text-sm text-muted-foreground">+0.2 from last semester</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject GPAs */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectGPAs.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{subject.subject}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{subject.credits} credits</Badge>
                    <span className="font-bold">{subject.gpa}</span>
                  </div>
                </div>
                <Progress value={(subject.gpa / 4.0) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {grades.slice(0, 4).map((grade) => {
                const percentage = (grade.score / grade.maxScore) * 100;
                const letter = getGradeLetter(percentage);
                
                return (
                  <div key={grade.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getTypeIcon(grade.type)}</span>
                      <div>
                        <h4 className="font-medium">{grade.assignment}</h4>
                        <p className="text-sm text-muted-foreground">{grade.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-lg ${getGradeColor(percentage)}`}>
                        {letter}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {grade.score}/{grade.maxScore}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};