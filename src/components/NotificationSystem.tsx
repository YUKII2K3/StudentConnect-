import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { toast as sonnerToast } from '@/components/ui/sonner';
import { BACKEND_URL, WS_BACKEND_URL } from '@/config';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationSystemProps {
  className?: string;
}

// Global notification state
let notificationListeners: ((notification: Notification) => void)[] = [];

export const showNotification = (notification: Omit<Notification, 'id'>) => {
  const id = Date.now().toString();
  const fullNotification = { ...notification, id };
  notificationListeners.forEach(listener => listener(fullNotification));
};

export const NotificationSystem: React.FC<NotificationSystemProps> = ({ className = '' }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Local notification listener
    const listener = (notification: Notification) => {
      setNotifications(prev => [...prev, notification]);
      const duration = notification.duration || 4000;
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, duration);
    };
    notificationListeners.push(listener);

    // --- WebSocket for real-time notifications ---
    let ws: WebSocket | null = null;
    let wsUrl = `${WS_BACKEND_URL}/ws/notifications`;

    function connectWs(url: string) {
      ws = new WebSocket(url);
      ws.onmessage = (event) => {
        // Assume backend sends a plain string or JSON with a 'message' field
        let msg = event.data;
        let title = 'Notification';
        let message = msg;
        let type: Notification['type'] = 'info';
        try {
          const parsed = JSON.parse(msg);
          if (typeof parsed === 'object' && parsed.message) {
            message = parsed.message;
            if (parsed.title) title = parsed.title;
            if (parsed.type) type = parsed.type;
          }
        } catch {}
        // Prefer Sonner toast if available
        if (typeof sonnerToast === 'function') {
          sonnerToast(message, { description: title });
        } else {
          showNotification({ type, title, message });
        }
      };
      ws.onerror = () => {
        // Optionally handle error
      };
    }
    connectWs(wsUrl);

    return () => {
      notificationListeners = notificationListeners.filter(l => l !== listener);
      ws?.close();
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'info':
        return <Info className="h-5 w-5 text-primary" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 space-y-2 ${className}`}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="notification-enter bg-card border shadow-elegant rounded-lg p-4 min-w-80 max-w-md"
        >
          <div className="flex items-start gap-3">
            {getIcon(notification.type)}
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{notification.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};