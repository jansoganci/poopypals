import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { Notification } from '@/lib/mockNotificationService';

interface NotificationToastProps {
  notification: Notification;
  onDismiss: () => void;
}

export default function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  // Extract emoji from title if present
  const emojiMatch = notification.title.match(/([^\w\s])\s?/);
  const emoji = emojiMatch ? emojiMatch[1] : null;
  const titleWithoutEmoji = notification.title.replace(/([^\w\s])\s?/, '');
  
  // Auto-dismiss after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [onDismiss]);
  
  const handleAction = () => {
    // Handle notification action (e.g. navigate to a page)
    if (notification.actionPath) {
      window.location.href = notification.actionPath;
    }
    
    // Refresh notifications
    queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    
    // Dismiss the toast
    onDismiss();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-sm bg-background rounded-lg shadow-lg border border-border overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 text-2xl mr-3">
            {emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-sm">
                {titleWithoutEmoji}
              </h4>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={onDismiss}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.message}
            </p>
            
            <div className="mt-3 flex gap-2 justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={onDismiss}
              >
                {t('dismiss')}
              </Button>
              {notification.actionPath && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={handleAction}
                >
                  {t('view')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress bar that decreases over time */}
      <div className="h-1 bg-muted">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 8, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}

// Global toast notification manager that will handle displaying push notifications
export function useNotificationToast() {
  const { toast, dismiss } = useToast();
  
  const showNotification = (notification: Notification) => {
    toast({
      title: notification.title,
      description: notification.message,
      variant: "default",
      duration: 8000,
      className: "p-0",
      // Custom toast component
      action: <NotificationToast notification={notification} onDismiss={() => dismiss()} />,
    });
  };
  
  return { showNotification };
}