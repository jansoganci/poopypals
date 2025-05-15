import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Notification, fetchNotifications, markAsRead, markAllAsRead, startAutomaticNotifications } from '@/lib/mockNotificationService';
import { useNotificationToast } from './NotificationToast';

export default function NotificationCenter() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationToast();
  
  // Fetch notifications from mock service
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 60000, // Refetch every minute
  });
  
  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      // Use mock service instead of real API
      await markAsRead(id);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });
  
  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      // Use mock service instead of real API
      await markAllAsRead();
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      setOpen(false);
    },
  });
  
  // Count unread notifications
  const unreadCount = notifications.filter((note: Notification) => !note.isRead).length;
  
  // Start automatic notification generation (for demo purposes)
  useEffect(() => {
    const stopAutomaticNotifications = startAutomaticNotifications((newNotification) => {
      // Show toast notification for new notifications
      showNotification(newNotification);
      
      // Refresh the notification list
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    });
    
    // Clean up on unmount
    return () => stopAutomaticNotifications();
  }, [queryClient, showNotification]);
  
  // If popover is opened and there are unread notifications, mark them as read
  useEffect(() => {
    if (open && unreadCount > 0) {
      // Optional: Auto-mark as read when opened
      // markAllAsReadMutation.mutate();
    }
  }, [open, unreadCount]);
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) {
      return t('just_now');
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return t('minutes_ago', { count: minutes });
    } else if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600);
      return t('hours_ago', { count: hours });
    } else {
      const days = Math.floor(diffSeconds / 86400);
      return t('days_ago', { count: days });
    }
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string, emoji?: string) => {
    // If the notification has an emoji included in the content, use that
    if (emoji && emoji.length > 0) {
      return emoji;
    }
    
    // Otherwise use default icons based on type
    switch (type) {
      case 'achievement':
        return '🏆';
      case 'streak':
        return '🔥';
      case 'reminder':
        return '⏰';
      case 'tip':
        return '💡';
      case 'system':
      default:
        return '📣';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-amber-500">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">{t('notifications_center')}</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => markAllAsReadMutation.mutate()} 
                disabled={markAllAsReadMutation.isPending}
              >
                <Check className="h-4 w-4 mr-1" />
                {t('mark_all_read')}
              </Button>
            )}
            <Button variant="ghost" size="sm" className="px-2" onClick={() => window.location.href = '/notifications'}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Separator />
        <div className="max-h-96 overflow-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">{t('loading_notifications')}</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>{t('no_notifications')}</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification: Notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors",
                    !notification.isRead && "bg-muted/30"
                  )}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 text-2xl">
                      {(() => {
                        // Extract emoji from title if present (common pattern in our templates)
                        const emojiMatch = notification.title.match(/([^\w\s])\s?/);
                        const emoji = emojiMatch ? emojiMatch[1] : undefined;
                        
                        return notification.iconPath || 
                          getNotificationIcon(notification.type, emoji);
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className={cn("font-medium text-sm", !notification.isRead && "font-semibold")}>
                          {/* Clean title of emoji if present */}
                          {notification.title.replace(/([^\w\s])\s?/, '')}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {notification.message}
                      </p>
                      
                      {/* Show badge for notification type */}
                      <div className="mt-2 flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={cn(
                            "text-xs py-0 h-5",
                            notification.type === 'achievement' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                            notification.type === 'streak' && "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
                            notification.type === 'reminder' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                            notification.type === 'tip' && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                          )}
                        >
                          {t(notification.type)}
                        </Badge>
                      </div>
                      
                      {!notification.isRead && (
                        <div className="flex justify-end mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                            disabled={markAsReadMutation.isPending}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            {t('mark_read')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Separator />
        <div className="p-2 flex justify-center">
          <Button variant="link" size="sm" className="text-xs text-muted-foreground">
            {t('view_all_notifications')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}