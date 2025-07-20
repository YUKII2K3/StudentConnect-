import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowBanner(true);
        setWasOffline(false);
        // Auto-hide reconnection banner after 3 seconds
        setTimeout(() => setShowBanner(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show banner if already offline
    if (!navigator.onLine) {
      setShowBanner(true);
      setWasOffline(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  const handleDismiss = () => {
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <div className={`
            ${isOnline 
              ? 'bg-success text-success-foreground border-success/20' 
              : 'bg-warning text-warning-foreground border-warning/20'
            } 
            border-b shadow-lg
          `}>
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={isOnline ? {} : { rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {isOnline ? (
                      <Wifi className="h-5 w-5" />
                    ) : (
                      <WifiOff className="h-5 w-5" />
                    )}
                  </motion.div>
                  
                  <div>
                    <p className="font-medium text-sm">
                      {isOnline ? 'You\'re back online!' : 'You\'re currently offline'}
                    </p>
                    <p className="text-xs opacity-90">
                      {isOnline 
                        ? 'All features are now available and your data will sync.'
                        : 'Working in offline mode. Some features may be limited.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isOnline && (
                    <div className="flex items-center gap-1 text-xs opacity-80">
                      <AlertCircle className="h-3 w-3" />
                      <span>Limited functionality</span>
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="h-6 w-6 p-0 text-current hover:bg-current/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};