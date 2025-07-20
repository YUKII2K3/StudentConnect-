import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { showNotification } from '@/components/NotificationSystem';

export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const storageKey = user ? `notes_${user.id}` : 'notes';

  useEffect(() => {
    if (!user) return;
    
    const loadNotes = () => {
      try {
        const storedNotes = localStorage.getItem(storageKey);
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, [user, storageKey]);

  const saveNotes = (newNotes: Note[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newNotes));
      setNotes(newNotes);
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Error",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };

    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);

    showNotification({
      type: 'success',
      title: 'Note Saved',
      message: `"${newNote.title}" has been saved to your notes.`,
    });

    toast({
      title: "Note created successfully! 📝",
      description: `"${newNote.title}" has been added to your notes.`,
    });

    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    const updatedNotes = notes.map(note =>
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    );
    saveNotes(updatedNotes);

    toast({
      title: "Note updated successfully",
      description: "Your changes have been saved.",
    });
  };

  const deleteNote = (id: string) => {
    const noteToDelete = notes.find(note => note.id === id);
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);

    if (noteToDelete) {
      toast({
        title: "Note deleted",
        description: `"${noteToDelete.title}" has been removed.`,
        variant: "destructive",
      });
    }
  };

  const searchNotes = (query: string) => {
    if (!query.trim()) return notes;
    
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(note =>
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.body.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    notes,
    isLoading,
    addNote,
    updateNote,
    deleteNote,
    searchNotes,
  };
};