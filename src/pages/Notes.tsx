import React, { useState } from 'react';
import { Plus, Search, FileText, Edit, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { NoteModal } from '@/components/NoteModal';
import { useNotes, Note } from '@/hooks/useNotes';

export const Notes: React.FC = () => {
  const { notes, isLoading, addNote, updateNote, deleteNote, searchNotes } = useNotes();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddNote = () => {
    setEditingNote(undefined);
    setModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
    } else {
      addNote(noteData);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const filteredNotes = searchQuery ? searchNotes(searchQuery) : notes;

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notes</h1>
          <p className="text-muted-foreground mt-1">
            Capture your thoughts and ideas
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={handleAddNote} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <Card className="shadow-card border-0 animate-fade-in">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {searchQuery 
                ? 'Try adjusting your search terms to find what you\'re looking for.'
                : 'Start capturing your thoughts and ideas by creating your first note.'
              }
            </p>
            {!searchQuery && (
              <Button onClick={handleAddNote} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Note
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, index) => (
            <Card 
              key={note.id}
              className="shadow-card border-0 hover-lift cursor-pointer group animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleEditNote(note)}
            >
              <CardContent className="p-6 h-48 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground text-lg line-clamp-2 flex-1">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditNote(note);
                      }}
                      className="hover:bg-primary/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="hover:bg-destructive/10 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {note.body ? truncateText(note.body) : 'No content'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(note.updatedAt)}</span>
                  </div>
                  <span>{note.body.length} chars</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Floating Action Button (Mobile) */}
      <Button
        onClick={handleAddNote}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow btn-primary lg:hidden"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Note Modal */}
      <NoteModal
        note={editingNote}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveNote}
      />
    </div>
  );
};