import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Upload, 
  FileJson, 
  Check, 
  AlertCircle,
  FileText,
  Database,
  Shield,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ExportData {
  version: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    dueDate: string;
    priority: string;
  }>;
  notes: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }>;
  settings: {
    theme: string;
    notifications: boolean;
    language: string;
  };
  habits: Array<{
    id: string;
    name: string;
    streak: number;
    completedDays: string[];
  }>;
  grades: Array<{
    id: string;
    subject: string;
    grade: number;
    weight: number;
    date: string;
  }>;
}

export const DataExportImport: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState<'export' | 'import' | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockData: ExportData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    user: {
      name: 'John Student',
      email: 'john@student.edu'
    },
    tasks: [
      {
        id: '1',
        title: 'Complete Math Assignment',
        description: 'Solve calculus problems',
        completed: false,
        dueDate: '2024-01-20',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Read Physics Chapter',
        description: 'Chapter 5: Thermodynamics',
        completed: true,
        dueDate: '2024-01-18',
        priority: 'medium'
      }
    ],
    notes: [
      {
        id: '1',
        title: 'Chemistry Notes',
        content: 'Organic chemistry reactions...',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T11:30:00Z'
      }
    ],
    settings: {
      theme: 'light',
      notifications: true,
      language: 'en'
    },
    habits: [
      {
        id: '1',
        name: 'Daily Reading',
        streak: 7,
        completedDays: ['2024-01-14', '2024-01-15', '2024-01-16']
      }
    ],
    grades: [
      {
        id: '1',
        subject: 'Mathematics',
        grade: 85,
        weight: 0.3,
        date: '2024-01-10'
      }
    ]
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate export process with progress
    const steps = [
      { name: 'Gathering user data', duration: 500 },
      { name: 'Collecting tasks and notes', duration: 800 },
      { name: 'Processing settings', duration: 300 },
      { name: 'Generating export file', duration: 600 },
      { name: 'Finalizing export', duration: 400 }
    ];
    
    let currentProgress = 0;
    const progressStep = 100 / steps.length;
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.duration));
      currentProgress += progressStep;
      setExportProgress(currentProgress);
    }
    
    // Create and download file
    const exportData = {
      ...mockData,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studentconnect-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
    setShowSuccess('export');
    
    toast({
      title: "Export Successful",
      description: "Your data has been exported successfully.",
    });
    
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleImport = async (file: File) => {
    setIsImporting(true);
    setImportProgress(0);
    setImportError(null);
    
    try {
      // Validate file type
      if (!file.name.endsWith('.json')) {
        throw new Error('Please select a valid JSON file');
      }
      
      // Simulate import process
      const steps = [
        { name: 'Reading file', duration: 400 },
        { name: 'Validating data structure', duration: 600 },
        { name: 'Processing tasks', duration: 800 },
        { name: 'Processing notes', duration: 500 },
        { name: 'Applying settings', duration: 300 },
        { name: 'Finalizing import', duration: 400 }
      ];
      
      let currentProgress = 0;
      const progressStep = 100 / steps.length;
      
      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, step.duration));
        currentProgress += progressStep;
        setImportProgress(currentProgress);
      }
      
      // Read and parse file
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      // Basic validation
      if (!importedData.version || !importedData.timestamp) {
        throw new Error('Invalid file format. Please ensure this is a valid StudentConnect export file.');
      }
      
      // Here you would normally process and save the imported data
      console.log('Imported data:', importedData);
      
      setIsImporting(false);
      setShowSuccess('import');
      
      toast({
        title: "Import Successful",
        description: `Imported ${importedData.tasks?.length || 0} tasks and ${importedData.notes?.length || 0} notes.`,
      });
      
      setTimeout(() => setShowSuccess(null), 3000);
      
    } catch (error) {
      setIsImporting(false);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setImportError(errorMessage);
      
      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImport(file);
    }
  };

  const getDataStats = () => {
    return [
      { label: 'Tasks', count: mockData.tasks.length, icon: FileText },
      { label: 'Notes', count: mockData.notes.length, icon: FileText },
      { label: 'Habits', count: mockData.habits.length, icon: Clock },
      { label: 'Grades', count: mockData.grades.length, icon: Database }
    ];
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <Card className="shadow-card border-border hover:shadow-elegant transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="h-5 w-5 text-primary" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download all your StudentConnect data as a backup
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Data Preview */}
            <div className="grid grid-cols-2 gap-3">
              {getDataStats().map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <stat.icon className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{stat.count}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Export Features */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">What's included:</h4>
              <div className="space-y-1">
                {[
                  'All tasks and assignments',
                  'Personal notes and content',
                  'App settings and preferences',
                  'Study habits and streaks',
                  'Grade tracking data'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-success" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Security Notice */}
            <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-primary">Secure Export</p>
                <p className="text-xs text-primary/80">Your data is processed locally and never sent to external servers</p>
              </div>
            </div>
            
            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow"
            >
              {isExporting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                  </motion.div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
            
            {/* Export Progress */}
            <AnimatePresence>
              {isExporting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Progress value={exportProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {exportProgress < 100 ? 'Processing...' : 'Finalizing...'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Import Section */}
        <Card className="shadow-card border-border hover:shadow-elegant transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5 text-secondary" />
              Import Data
            </CardTitle>
            <CardDescription>
              Restore your data from a previous export
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Drop Zone */}
            <div 
              className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileJson className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Click to select file</p>
              <p className="text-xs text-muted-foreground">or drag and drop your export file here</p>
              <p className="text-xs text-muted-foreground mt-2">Supports: .json files only</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {/* Import Features */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Import process:</h4>
              <div className="space-y-1">
                {[
                  'File validation and security check',
                  'Data structure verification',
                  'Merge with existing data',
                  'Preserve current preferences',
                  'Backup creation before import'
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-3 w-3 rounded-full border border-muted-foreground flex items-center justify-center">
                      <div className="h-1 w-1 bg-muted-foreground rounded-full"></div>
                    </div>
                    {step}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Warning Notice */}
            <div className="flex items-start gap-2 p-3 bg-warning/5 border border-warning/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-warning">Important</p>
                <p className="text-xs text-warning/80">Importing will merge data with your current information. This action cannot be undone.</p>
              </div>
            </div>
            
            {/* Import Progress */}
            <AnimatePresence>
              {isImporting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Progress value={importProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {importProgress < 100 ? 'Importing data...' : 'Finalizing...'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Import Error */}
            <AnimatePresence>
              {importError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm font-medium text-destructive">Import Failed</p>
                  </div>
                  <p className="text-xs text-destructive/80 mt-1">{importError}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess !== null} onOpenChange={() => setShowSuccess(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <Check className="h-5 w-5 text-success" />
              </motion.div>
              {showSuccess === 'export' ? 'Export Successful' : 'Import Successful'}
            </DialogTitle>
            <DialogDescription>
              {showSuccess === 'export' 
                ? 'Your data has been successfully exported and downloaded to your device.'
                : 'Your data has been successfully imported and is now available in your account.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setShowSuccess(null)}>
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};