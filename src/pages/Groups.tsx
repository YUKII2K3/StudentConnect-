import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  MessageSquare, 
  CheckSquare, 
  Calendar,
  Bell,
  Share2,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: string[];
  tasks: Array<{
    id: string;
    title: string;
    assignee: string;
    completed: boolean;
    dueDate: string;
  }>;
  messages: Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: string;
  }>;
}

export const Groups = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'Computer Science Study Group',
      description: 'Preparing for Algorithm Design exam',
      members: ['Alice', 'Bob', 'Charlie', 'You'],
      tasks: [
        { id: '1', title: 'Review sorting algorithms', assignee: 'Alice', completed: true, dueDate: '2024-01-15' },
        { id: '2', title: 'Practice graph problems', assignee: 'Bob', completed: false, dueDate: '2024-01-18' },
        { id: '3', title: 'Create study notes', assignee: 'You', completed: false, dueDate: '2024-01-20' }
      ],
      messages: [
        { id: '1', sender: 'Alice', message: 'Hey everyone! I finished the sorting algorithms review. Check out my notes!', timestamp: '2024-01-14 10:30' },
        { id: '2', sender: 'Bob', message: 'Thanks Alice! Working on the graph problems now.', timestamp: '2024-01-14 14:20' }
      ]
    },
    {
      id: '2',
      name: 'Mathematics Study Circle',
      description: 'Calculus II preparation group',
      members: ['Diana', 'Eve', 'Frank', 'You'],
      tasks: [
        { id: '4', title: 'Integration by parts practice', assignee: 'Diana', completed: true, dueDate: '2024-01-16' },
        { id: '5', title: 'Series convergence tests', assignee: 'You', completed: false, dueDate: '2024-01-19' }
      ],
      messages: [
        { id: '3', sender: 'Diana', message: 'I found some great practice problems for integration!', timestamp: '2024-01-13 16:45' }
      ]
    }
  ]);

  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(groups[0]);
  const [newMessage, setNewMessage] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;
    
    const updatedGroups = groups.map(group => 
      group.id === selectedGroup.id 
        ? {
            ...group,
            messages: [...group.messages, {
              id: Date.now().toString(),
              sender: 'You',
              message: newMessage,
              timestamp: new Date().toLocaleString()
            }]
          }
        : group
    );
    
    setGroups(updatedGroups);
    setSelectedGroup(updatedGroups.find(g => g.id === selectedGroup.id) || null);
    setNewMessage('');
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    
    const newGroup: StudyGroup = {
      id: Date.now().toString(),
      name: newGroupName,
      description: newGroupDescription,
      members: ['You'],
      tasks: [],
      messages: []
    };
    
    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setNewGroupDescription('');
  };

  const toggleTaskCompletion = (taskId: string) => {
    if (!selectedGroup) return;
    
    const updatedGroups = groups.map(group =>
      group.id === selectedGroup.id
        ? {
            ...group,
            tasks: group.tasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          }
        : group
    );
    
    setGroups(updatedGroups);
    setSelectedGroup(updatedGroups.find(g => g.id === selectedGroup.id) || null);
  };

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
              <Users className="h-8 w-8 text-primary" />
              Study Groups
            </h1>
            <p className="text-muted-foreground mt-2">Collaborate and learn together</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Study Group</DialogTitle>
                <DialogDescription>
                  Set up a new study group to collaborate with your peers
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
                <Textarea
                  placeholder="Group description"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                />
                <Button onClick={handleCreateGroup} className="w-full">
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Groups List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Your Groups</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {groups.map((group) => (
                  <motion.div
                    key={group.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedGroup(group)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedGroup?.id === group.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <h3 className="font-medium text-sm truncate">{group.name}</h3>
                    <p className="text-xs opacity-70 truncate">{group.description}</p>
                    <div className="flex items-center mt-2 gap-1">
                      <Users className="h-3 w-3" />
                      <span className="text-xs">{group.members.length}</span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {selectedGroup ? (
              <Card className="shadow-card border-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{selectedGroup.name}</CardTitle>
                      <CardDescription>{selectedGroup.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {selectedGroup.members.length} members
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Members */}
                  <div className="flex items-center gap-2 mt-4">
                    {selectedGroup.members.map((member, index) => (
                      <Avatar key={index} className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {member.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="chat" className="w-full">
                    <TabsList className="grid grid-cols-2 w-full max-w-md">
                      <TabsTrigger value="chat" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Chat
                      </TabsTrigger>
                      <TabsTrigger value="tasks" className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4" />
                        Tasks
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Chat Tab */}
                    <TabsContent value="chat" className="mt-6">
                      <div className="space-y-4">
                        {/* Messages */}
                        <div className="h-64 overflow-y-auto space-y-3 p-4 bg-muted/30 rounded-lg">
                          {selectedGroup.messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex gap-3 ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-xs p-3 rounded-lg ${
                                message.sender === 'You'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-card border shadow-sm'
                              }`}>
                                {message.sender !== 'You' && (
                                  <p className="text-xs font-medium text-primary mb-1">{message.sender}</p>
                                )}
                                <p className="text-sm">{message.message}</p>
                                <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        {/* Message Input */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1"
                          />
                          <Button onClick={handleSendMessage} size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Tasks Tab */}
                    <TabsContent value="tasks" className="mt-6">
                      <div className="space-y-4">
                        {selectedGroup.tasks.map((task) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-4 bg-card border rounded-lg shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTaskCompletion(task.id)}
                                className={`h-6 w-6 p-0 rounded border-2 ${
                                  task.completed
                                    ? 'bg-success border-success text-success-foreground'
                                    : 'border-muted-foreground'
                                }`}
                              >
                                {task.completed && <CheckSquare className="h-3 w-3" />}
                              </Button>
                              <div>
                                <p className={`text-sm font-medium ${task.completed ? 'line-through opacity-60' : ''}`}>
                                  {task.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Assigned to: {task.assignee} • Due: {task.dueDate}
                                </p>
                              </div>
                            </div>
                            <Badge variant={task.completed ? 'default' : 'secondary'}>
                              {task.completed ? 'Completed' : 'Pending'}
                            </Badge>
                          </motion.div>
                        ))}
                        
                        {selectedGroup.tasks.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No tasks yet. Create some tasks to get started!</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-card border-border">
                <CardContent className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium text-foreground">Select a group to continue</h3>
                  <p className="text-muted-foreground">Choose a study group from the sidebar to view its content</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};