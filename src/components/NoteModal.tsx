import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Note } from '@/hooks/useNotes';

interface NoteModalProps {
  note?: Note;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({ note, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setBody(note.body);
    } else {
      setTitle('');
      setBody('');
    }
  }, [note, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      body: body.trim(),
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] shadow-elegant animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{note ? 'Edit Note' : 'New Note'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <Textarea
                placeholder="Start writing your note..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                className="resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 btn-primary">
                {note ? 'Update' : 'Save'} Note
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};