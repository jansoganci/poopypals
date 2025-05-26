import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateRandomNotification } from '@/lib/mockNotificationService';
import { useNotificationToast } from './NotificationToast';
import { useQueryClient } from '@tanstack/react-query';

export default function PushNotificationDemo() {
  const { t } = useTranslation();
  const { showNotification } = useNotificationToast();
  const queryClient = useQueryClient();
  
  // Function to trigger a demo notification
  const triggerDemoNotification = () => {
    const notification = generateRandomNotification(Math.floor(Math.random() * 1000) + 100);
    
    // Show the notification toast
    showNotification(notification);
    
    // Refresh the notification list
    queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5" />
          {t('push_notification_demo')}
        </CardTitle>
        <CardDescription>
          {t('push_notification_demo_description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">
            {t('push_notification_demo_explanation')}
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              {t('achievement')}
            </Badge>
            <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
              {t('streak')}
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {t('reminder')}
            </Badge>
            <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
              {t('tip')}
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={triggerDemoNotification} className="w-full">
          {t('send_test_notification')}
        </Button>
      </CardFooter>
    </Card>
  );
}