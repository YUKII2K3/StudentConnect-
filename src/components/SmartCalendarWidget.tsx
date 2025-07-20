import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  AlertTriangle, 
  Clock, 
  MapPin,
  Users,
  Video,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  type: 'class' | 'assignment' | 'exam' | 'meeting' | 'study';
  location?: string;
  isOnline?: boolean;
  hasConflict?: boolean;
}

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Mathematics Lecture',
    description: 'Calculus II - Derivatives',
    startTime: '09:00',
    endTime: '10:30',
    date: '2024-01-15',
    type: 'class',
    location: 'Room 205',
    hasConflict: false
  },
  {
    id: '2',
    title: 'CS Project Due',
    description: 'Web Application Assignment',
    startTime: '23:59',
    endTime: '23:59',
    date: '2024-01-15',
    type: 'assignment',
    hasConflict: false
  },
  {
    id: '3',
    title: 'Study Group',
    description: 'Physics study session',
    startTime: '14:00',
    endTime: '16:00',
    date: '2024-01-16',
    type: 'study',
    location: 'Library',
    hasConflict: false
  },
  {
    id: '4',
    title: 'Office Hours',
    description: 'Professor meeting',
    startTime: '15:30',
    endTime: '16:30',
    date: '2024-01-16',
    type: 'meeting',
    isOnline: true,
    hasConflict: true
  }
];

export const SmartCalendarWidget: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'class' as CalendarEvent['type'],
    location: '',
    isOnline: false
  });

  const getWeekDates = (weekOffset: number = 0) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(currentWeek);
  
  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class': return 'bg-primary/10 text-primary border-primary/20';
      case 'assignment': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'exam': return 'bg-warning/10 text-warning border-warning/20';
      case 'meeting': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'study': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const detectConflicts = () => {
    const conflicts = [];
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const event1 = events[i];
        const event2 = events[j];
        
        if (event1.date === event2.date) {
          const start1 = new Date(`${event1.date}T${event1.startTime}`);
          const end1 = new Date(`${event1.date}T${event1.endTime}`);
          const start2 = new Date(`${event2.date}T${event2.startTime}`);
          const end2 = new Date(`${event2.date}T${event2.endTime}`);
          
          if ((start1 < end2 && end1 > start2)) {
            conflicts.push(event1.id, event2.id);
          }
        }
      }
    }
    return conflicts;
  };

  const conflicts = detectConflicts();

  const addEvent = () => {
    if (!newEvent.title || !newEvent.startTime) return;
    
    const event: CalendarEvent = {
      id: Date.now().toString(),
      ...newEvent,
      date: selectedDate,
      hasConflict: false
    };
    
    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      type: 'class',
      location: '',
      isOnline: false
    });
  };

  return (
    <Card className="shadow-card border-border hover:shadow-elegant transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Smart Calendar
            </CardTitle>
            <CardDescription>Intelligent scheduling with conflict detection</CardDescription>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-1" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>Schedule a new event to your calendar</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                />
                <Textarea
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="time"
                    placeholder="Start time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                  />
                  <Input
                    type="time"
                    placeholder="End time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                  />
                </div>
                <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value as CalendarEvent['type']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class">Class</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="study">Study Session</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Location (optional)"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                />
                <Button onClick={addEvent} className="w-full">
                  Add Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentWeek(currentWeek - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="font-semibold text-foreground">
            {currentWeek === 0 ? 'This Week' : 
             currentWeek > 0 ? `${currentWeek} Week${currentWeek > 1 ? 's' : ''} Ahead` :
             `${Math.abs(currentWeek)} Week${Math.abs(currentWeek) > 1 ? 's' : ''} Ago`}
          </h3>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentWeek(currentWeek + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
          
          {weekDates.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isToday = date === new Date().toISOString().split('T')[0];
            const hasConflicts = dayEvents.some(event => conflicts.includes(event.id));
            
            return (
              <motion.div
                key={date}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedDate(date)}
                className={`
                  min-h-[80px] p-2 border rounded-lg cursor-pointer transition-all hover:shadow-md
                  ${selectedDate === date ? 'border-primary bg-primary/5' : 'border-border'}
                  ${isToday ? 'bg-secondary/5 border-secondary' : ''}
                  ${hasConflicts ? 'border-destructive/50 bg-destructive/5' : ''}
                `}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-secondary' : 'text-foreground'}`}>
                  {new Date(date).getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-xs p-1 rounded text-center truncate ${getEventTypeColor(event.type)}`}
                      title={`${event.title} - ${event.startTime}`}
                    >
                      {conflicts.includes(event.id) && (
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                      )}
                      {event.title}
                    </motion.div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Date Events */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-4"
            >
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              
              <div className="space-y-2">
                {getEventsForDate(selectedDate).map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <Clock className="h-4 w-4 text-primary mb-1" />
                        <span className="text-xs text-muted-foreground">
                          {event.startTime}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-sm text-foreground">{event.title}</h5>
                          {conflicts.includes(event.id) && (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{event.location}</span>
                            </div>
                          )}
                          {event.isOnline && (
                            <div className="flex items-center gap-1">
                              <Video className="h-3 w-3 text-primary" />
                              <span className="text-xs text-primary">Online</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </motion.div>
                ))}
                
                {getEventsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No events scheduled</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conflict Warnings */}
        {conflicts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 border border-destructive/20 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Schedule Conflicts Detected</span>
            </div>
            <p className="text-xs text-destructive/80">
              You have {conflicts.length} overlapping events. Review your schedule to avoid conflicts.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};