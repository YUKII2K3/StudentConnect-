import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext'; // To get the current user's name
import { toast as sonnerToast } from '@/components/ui/sonner';
import { BACKEND_URL, WS_BACKEND_URL } from '@/config';

// ###############################################
// # Data Structures and Mock Data               #
// # Using static data for the MVP.              #
// ###############################################

interface Group {
  id: string;
  name: string;
  description: string;
}

interface Message {
  user: string;
  text: string;
  timestamp: string;
}

const mockGroups: Group[] = [
  { id: 'cs101', name: 'Computer Science 101', description: 'Discussing algorithms and data structures.' },
  { id: 'math202', name: 'Advanced Calculus', description: 'Covering series, sequences, and theorems.' },
  { id: 'physics301', name: 'Quantum Mechanics', description: 'For all things quantum.' },
];

// ###############################################
// # Groups Page Component                       #
// # Main component for group collaboration.     #
// ###############################################

export const Groups: React.FC = () => {
  const { user } = useAuth(); // Get the logged-in user
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(mockGroups[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected' | 'error' | 'connecting'>('disconnected');
  const [wsError, setWsError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // # Effect to connect to WebSocket when a group is selected
  useEffect(() => {
    if (selectedGroup) {
      // Fetch persisted messages from backend
      fetch(`${BACKEND_URL}/groups/${selectedGroup.id}/messages`)
        .then(res => res.json())
        .then(data => setMessages(data));

      // Clean up previous connection if it exists
      ws.current?.close();
      setWsStatus('connecting');
      setWsError(null);

      // Use direct backend WebSocket URL
      let wsUrl = `${WS_BACKEND_URL}/ws/chat/${selectedGroup.id}`;
      let newWs = new WebSocket(wsUrl);

      function logWsEvent(event: string, extra?: any) {
        // eslint-disable-next-line no-console
        console.log(`[WebSocket] ${event}`, extra || '');
      }

      function attachWsHandlers(socket: WebSocket) {
        socket.onopen = () => {
          setWsStatus('connected');
          setWsError(null);
          logWsEvent('onopen');
        };
        socket.onmessage = (event) => {
          try {
            const receivedMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            logWsEvent('onmessage', receivedMessage);
          } catch (error) {
            logWsEvent('onmessage parse error', event.data);
          }
        };
        socket.onclose = (e) => {
          setWsStatus('disconnected');
          logWsEvent('onclose', e);
          if (typeof sonnerToast === 'function') {
            sonnerToast('WebSocket disconnected', { description: 'Chat connection lost.' });
          }
        };
        socket.onerror = (e) => {
          setWsStatus('error');
          setWsError('WebSocket connection error');
          logWsEvent('onerror', e);
          if (typeof sonnerToast === 'function') {
            sonnerToast('WebSocket connection error', { description: 'Could not connect to chat server.' });
          }
        };
      }
      attachWsHandlers(newWs);
      ws.current = newWs;
    }

    // # Cleanup on component unmount
    return () => {
      ws.current?.close();
    };
  }, [selectedGroup]);

  // # Effect to scroll to the bottom of the chat on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // # Function to handle sending a message
  const handleSendMessage = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      if (typeof sonnerToast === 'function') {
        sonnerToast('Cannot send message', { description: 'WebSocket is not connected.' });
      }
      return;
    }
    if (inputValue.trim()) {
      const messageToSend = {
        user: user?.name || 'Anonymous',
        text: inputValue,
        timestamp: new Date().toLocaleTimeString(),
      };
      ws.current.send(JSON.stringify(messageToSend));
      setInputValue('');
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-theme(spacing.16))]">
      {/* WebSocket Connection Status Banner */}
      <div className={`mb-4 p-2 rounded text-sm font-medium flex items-center gap-2 ${wsStatus === 'connected' ? 'bg-green-100 text-green-800' : wsStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' : wsStatus === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
        style={{ minHeight: 36 }}>
        <span className={`h-3 w-3 rounded-full ${wsStatus === 'connected' ? 'bg-green-500' : wsStatus === 'error' ? 'bg-red-500' : wsStatus === 'connecting' ? 'bg-yellow-400' : 'bg-gray-400'}`}></span>
        {wsStatus === 'connected' && 'WebSocket Connected'}
        {wsStatus === 'connecting' && 'Connecting to chat...'}
        {wsStatus === 'error' && `WebSocket Error${wsError ? ': ' + wsError : ''}`}
        {wsStatus === 'disconnected' && 'WebSocket Disconnected'}
      </div>
      <div className="flex h-full gap-6">
        {/* # Left Column: Group List # */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-1/3"
        >
          <Card className="h-full shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users /> Study Groups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedGroup?.id === group.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <h3 className="font-medium">{group.name}</h3>
                  <p className="text-sm opacity-80">{group.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* # Right Column: Chat Interface # */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-2/3 flex flex-col"
        >
          {selectedGroup ? (
            <Card className="h-full flex flex-col shadow-card">
              <CardHeader>
                <CardTitle>{selectedGroup.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                {/* # Chat Messages # */}
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.user === user?.name ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        msg.user === user?.name
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border'
                      }`}
                    >
                      <p className="text-xs font-bold mb-1">{msg.user}</p>
                      <p>{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>
              {/* # Message Input # */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={wsStatus !== 'connected'}
                  />
                  <Button onClick={handleSendMessage} disabled={wsStatus !== 'connected'}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Select a group to start collaborating.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};