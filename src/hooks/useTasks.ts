import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { showNotification } from '@/components/NotificationSystem';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  createdAt: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const storageKey = user ? `tasks_${user.id}` : 'tasks';

  useEffect(() => {
    if (!user) return;
    
    const loadTasks = () => {
      try {
        const storedTasks = localStorage.getItem(storageKey);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [user, storageKey]);

  const saveTasks = (newTasks: Task[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
      toast({
        title: "Error",
        description: "Failed to save tasks. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);

    showNotification({
      type: 'success',
      title: 'Task Created',
      message: `"${newTask.title}" has been added to your tasks.`,
    });

    toast({
      title: "Task created successfully! ✅",
      description: `"${newTask.title}" has been added to your task list.`,
    });

    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    saveTasks(updatedTasks);

    if (updates.completed !== undefined) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        const message = updates.completed
          ? `"${task.title}" marked as completed! 🎉`
          : `"${task.title}" marked as incomplete.`;
        
        toast({
          title: updates.completed ? "Task completed!" : "Task updated",
          description: message,
        });
      }
    } else {
      toast({
        title: "Task updated successfully",
        description: "Your changes have been saved.",
      });
    }
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasks(updatedTasks);

    if (taskToDelete) {
      toast({
        title: "Task deleted",
        description: `"${taskToDelete.title}" has been removed.`,
        variant: "destructive",
      });
    }
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { completed: !task.completed });
    }
  };

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
};