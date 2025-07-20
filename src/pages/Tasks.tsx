import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle, Circle, Edit, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TaskModal } from '@/components/TaskModal';
import { useTasks, Task } from '@/hooks/useTasks';

export const Tasks: React.FC = () => {
  const { tasks, isLoading, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleAddTask = () => {
    setEditingTask(undefined);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const formatDeadline = (deadline: string) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', color: 'text-destructive' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-warning' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: 'text-warning' };
    } else {
      return { 
        text: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }), 
        color: 'text-muted-foreground' 
      };
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    // Incomplete tasks first, then by deadline
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tasks and stay organized
          </p>
        </div>
        <Button onClick={handleAddTask} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <Card className="shadow-card border-0 animate-fade-in">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No tasks yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Get started by creating your first task to stay organized and productive.
            </p>
            <Button onClick={handleAddTask} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task, index) => {
            const deadlineInfo = formatDeadline(task.deadline);
            
            return (
              <Card 
                key={task.id}
                className={`shadow-card border-0 hover-lift transition-all duration-300 ${
                  task.completed ? 'opacity-70' : ''
                } animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 hover-scale transition-transform"
                    >
                      {task.completed ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 
                        className={`font-medium text-foreground ${
                          task.completed ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {task.title}
                      </h3>
                      
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}

                      {deadlineInfo && (
                        <div className={`flex items-center gap-1 text-xs mt-2 ${deadlineInfo.color}`}>
                          <Clock className="h-3 w-3" />
                          <span>{deadlineInfo.text}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTask(task)}
                        className="hover:bg-primary/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="hover:bg-destructive/10 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Floating Action Button (Mobile) */}
      <Button
        onClick={handleAddTask}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow btn-primary lg:hidden"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Task Modal */}
      <TaskModal
        task={editingTask}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
};