import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, BookOpen, Clock, MapPin, ChevronLeft, ChevronRight, Edit3, Calendar as CalendarIcon, GripVertical, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface Event {
  id: string;
  title: string;
  date: Date;
  subject: string;
  description?: string;
  location?: string;
  type: 'exam' | 'assignment' | 'class' | 'event' | 'festival' | 'note';
  color?: string;
}

interface Note {
  id: string;
  date: Date;
  content: string;
  title?: string;
}

// Mock events data with festivals and current month events
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Physics Midterm',
    date: new Date(2025, 6, 20), // July 2025
    subject: 'Physics',
    description: 'Chapters 1-5',
    location: 'Room 101',
    type: 'exam',
    color: '#ef4444'
  },
  {
    id: '2',
    title: 'Math Assignment Due',
    date: new Date(2025, 6, 22),
    subject: 'Mathematics',
    description: 'Calculus Problems',
    type: 'assignment',
    color: '#3b82f6'
  },
  {
    id: '3',
    title: 'Chemistry Lab',
    date: new Date(2025, 6, 25),
    subject: 'Chemistry',
    location: 'Lab 203',
    type: 'class',
    color: '#10b981'
  },
  {
    id: '4',
    title: 'Muharram',
    date: new Date(2025, 6, 6), // July 6
    subject: 'Islamic Calendar',
    description: 'Islamic New Year',
    type: 'festival',
    color: '#8b5cf6'
  },
  {
    id: '5',
    title: 'Summer Festival',
    date: new Date(2025, 6, 18), // July 18
    subject: 'Campus Event',
    description: 'Annual summer celebration',
    type: 'event',
    color: '#f59e0b'
  },
  {
    id: '6',
    title: 'Project Presentation',
    date: new Date(2025, 6, 11), // July 11
    subject: 'Computer Science',
    description: 'Final project showcase',
    type: 'exam',
    color: '#ef4444'
  }
];

export const CalendarWidget: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    subject: '',
    description: '',
    location: '',
    type: 'event' as Event['type']
  });
  const [newNote, setNewNote] = useState({
    title: '',
    content: ''
  });


  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const getNotesForDate = (date: Date) => {
    return notes.filter(note => 
      note.date.getDate() === date.getDate() &&
      note.date.getMonth() === date.getMonth() &&
      note.date.getFullYear() === date.getFullYear()
    );
  };

  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'exam':
        return '📝';
      case 'assignment':
        return '📚';
      case 'class':
        return '🎓';
      case 'event':
        return '📅';
      case 'festival':
        return '🎉';
      case 'note':
        return '📝';
      default:
        return '📌';
    }
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'exam':
        return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'assignment':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'class':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'event':
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'festival':
        return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'note':
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const addEvent = () => {
    if (newEvent.title) {
      const event: Event = {
        id: Date.now().toString(),
        title: newEvent.title,
        subject: newEvent.subject,
        description: newEvent.description,
        location: newEvent.location,
        type: newEvent.type,
        date: selectedDate,
        color: getEventColor(newEvent.type)
      };
      setEvents([...events, event]);
      setNewEvent({
        title: '',
        subject: '',
        description: '',
        location: '',
        type: 'event'
      });
      setIsAddingEvent(false);
    }
  };

  const addNote = () => {
    if (newNote.content) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        date: selectedDate
      };
      setNotes([...notes, note]);
      setNewNote({
        title: '',
        content: ''
      });
      setIsAddingNote(false);
    }
  };

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'exam': return '#ef4444';
      case 'assignment': return '#3b82f6';
      case 'class': return '#10b981';
      case 'event': return '#f59e0b';
      case 'festival': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const selectedDateEvents = getEventsForDate(selectedDate);
  const selectedDateNotes = getNotesForDate(selectedDate);

  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isQuickCaptureMinimized, setIsQuickCaptureMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const containerWidth = window.innerWidth - 48; // Account for padding
      const newWidth = containerWidth - e.clientX + 24; // Reverse calculation for right sidebar
      const minWidth = isQuickCaptureMinimized ? 60 : 250;
      const maxWidth = containerWidth * 0.6;
      
      setSidebarWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with navigation */}
      <Card className="shadow-royal">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-3xl font-bold">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
              >
                Today
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Resizable Layout */}
      <div className="relative flex gap-2 min-h-[600px]">
        {/* Calendar Section */}
        <motion.div 
          className="flex-1 min-w-0"
          style={{ 
            width: `calc(100% - ${sidebarWidth}px - 8px)`,
            transition: isDragging ? 'none' : 'width 0.2s ease'
          }}
        >
          <Card className="shadow-royal h-full">
            <CardContent className="p-6 h-full">
              <div className="space-y-4 h-full">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Body */}
                <div className="grid grid-cols-7 gap-1 flex-1">
                  {eachDayOfInterval({
                    start: startOfMonth(currentMonth),
                    end: endOfMonth(currentMonth)
                  }).map((date) => {
                    const dayEvents = getEventsForDate(date);
                    const dayNotes = getNotesForDate(date);
                    const isSelected = isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());
                    
                    return (
                      <motion.div
                        key={date.toISOString()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          relative min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all
                          ${isSelected ? 'bg-primary/20 border-primary' : 'hover:bg-muted/50'}
                          ${isToday ? 'ring-2 ring-primary' : ''}
                        `}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className={`
                          text-sm font-medium mb-1
                          ${isToday ? 'text-primary font-bold' : ''}
                          ${isSelected ? 'text-primary' : ''}
                        `}>
                          {format(date, 'd')}
                        </div>
                        
                        {/* Event indicators */}
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event, index) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="text-xs px-2 py-1 rounded-full truncate"
                              style={{ 
                                backgroundColor: event.color ? `${event.color}20` : '#3b82f620',
                                color: event.color || '#3b82f6',
                                border: `1px solid ${event.color ? `${event.color}40` : '#3b82f640'}`
                              }}
                              title={event.title}
                            >
                              {event.title}
                            </motion.div>
                          ))}
                          
                          {/* More events indicator */}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                          
                          {/* Note indicator */}
                          {dayNotes.length > 0 && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                          )}
                          
                          {/* Red circle for important events */}
                          {dayEvents.some(e => e.type === 'exam' || e.type === 'festival') && (
                            <div className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resize Handle */}
        <div 
          className={`
            w-2 bg-border hover:bg-primary/30 cursor-col-resize group relative transition-colors
            ${isDragging ? 'bg-primary/50' : ''}
          `}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-muted-foreground/20 group-hover:bg-primary/50 transition-colors">
            <GripVertical className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted-foreground/50 group-hover:text-primary" />
          </div>
        </div>

        {/* Sidebar Section */}
        <motion.div 
          style={{ 
            width: `${sidebarWidth}px`,
            transition: isDragging ? 'none' : 'width 0.2s ease'
          }}
          className="min-w-0"
        >
          <div className="space-y-4">
            {/* Quick Capture and Controls */}
            <Card className="shadow-royal">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Quick Capture</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsQuickCaptureMinimized(!isQuickCaptureMinimized)}
                    className="h-6 w-6 p-0"
                  >
                    {isQuickCaptureMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                  </Button>
                </div>
              </CardHeader>
              {!isQuickCaptureMinimized && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <Input placeholder="Add a quick note..." className="text-sm" />
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        <Edit3 className="h-3 w-3 mr-1" />
                        Note
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        Event
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Selected Date Details */}
            <Card className="shadow-royal">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {format(selectedDate, 'MMMM d, yyyy')}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Event</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={newEvent.title}
                              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                              placeholder="Event title"
                            />
                          </div>
                          <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                              id="subject"
                              value={newEvent.subject}
                              onChange={(e) => setNewEvent({...newEvent, subject: e.target.value})}
                              placeholder="Subject"
                            />
                          </div>
                          <div>
                            <Label htmlFor="type">Type</Label>
                            <Select value={newEvent.type} onValueChange={(value: Event['type']) => setNewEvent({...newEvent, type: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="exam">Exam</SelectItem>
                                <SelectItem value="assignment">Assignment</SelectItem>
                                <SelectItem value="class">Class</SelectItem>
                                <SelectItem value="event">Event</SelectItem>
                                <SelectItem value="festival">Festival</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={newEvent.location}
                              onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                              placeholder="Location (optional)"
                            />
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={newEvent.description}
                              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                              placeholder="Description (optional)"
                            />
                          </div>
                          <Button onClick={addEvent} className="w-full">
                            Add Event
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Note</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="note-title">Title (optional)</Label>
                            <Input
                              id="note-title"
                              value={newNote.title}
                              onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                              placeholder="Note title"
                            />
                          </div>
                          <div>
                            <Label htmlFor="note-content">Content</Label>
                            <Textarea
                              id="note-content"
                              value={newNote.content}
                              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                              placeholder="Write your note..."
                              rows={5}
                            />
                          </div>
                          <Button onClick={addNote} className="w-full">
                            Add Note
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <AnimatePresence mode="wait">
                  {selectedDateEvents.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-2"
                    >
                      <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Events</h4>
                      {selectedDateEvents.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div 
                            className="p-2 rounded-lg border border-l-4 bg-card/50 hover:bg-card transition-colors" 
                            style={{ borderLeftColor: event.color }}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-sm">{getEventTypeIcon(event.type)}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 mb-1">
                                  <h4 className="font-medium text-xs truncate">{event.title}</h4>
                                  <Badge variant="outline" className="text-xs h-4 px-1">
                                    {event.type}
                                  </Badge>
                                </div>
                                
                                {event.subject && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                    <BookOpen className="h-2.5 w-2.5" />
                                    <span className="truncate">{event.subject}</span>
                                  </div>
                                )}
                                
                                {event.location && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <MapPin className="h-2.5 w-2.5" />
                                    <span className="truncate">{event.location}</span>
                                  </div>
                                )}
                                
                                {event.description && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {event.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {selectedDateNotes.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-2"
                    >
                      <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Notes</h4>
                      {selectedDateNotes.map((note, index) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="p-2 rounded-lg border border-l-4 border-l-yellow-500 bg-card/50">
                            {note.title && (
                              <h4 className="font-medium text-xs mb-1">{note.title}</h4>
                            )}
                            <p className="text-xs text-muted-foreground line-clamp-3">
                              {note.content}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {selectedDateEvents.length === 0 && selectedDateNotes.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 text-muted-foreground"
                  >
                    <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No events or notes</p>
                    <p className="text-xs mt-1 opacity-70">Click + to add</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
      
      {/* Quick Stats */}
      <Card className="shadow-royal">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {events.filter(e => e.type === 'exam').length}
              </div>
              <div className="text-sm text-muted-foreground">Exams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {events.filter(e => e.type === 'assignment').length}
              </div>
              <div className="text-sm text-muted-foreground">Assignments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.type === 'class').length}
              </div>
              <div className="text-sm text-muted-foreground">Classes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {events.filter(e => e.type === 'festival').length}
              </div>
              <div className="text-sm text-muted-foreground">Festivals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {notes.length}
              </div>
              <div className="text-sm text-muted-foreground">Notes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};