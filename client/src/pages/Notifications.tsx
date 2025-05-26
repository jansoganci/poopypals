import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import RemindersManager from '@/components/RemindersManager';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import NotificationPreferences from '@/components/NotificationPreferences';
import PushNotificationDemo from '@/components/PushNotificationDemo';

interface NotificationPreferences {
  id: number;
  userId: number;
  achievementNotifications: boolean;
  streakNotifications: boolean;
  reminderNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  doNotDisturbStart?: string;
  doNotDisturbEnd?: string;
  updatedAt: string;
}

export default function NotificationsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  // Fetch notification preferences
  const { data: preferences, isLoading } = useQuery<NotificationPreferences>({
    queryKey: ['/api/notification-preferences'],
  });
  
  // Update notification preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: async (newPreferences: Partial<NotificationPreferences>) => {
      return apiRequest('/api/notification-preferences', 'POST', newPreferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notification-preferences'] });
      toast({
        title: t('saved'),
        description: t('notification_preferences_saved'),
      });
    },
  });
  
  // Handle toggle changes
  const handleToggle = (field: keyof NotificationPreferences, checked: boolean) => {
    if (!preferences) return;
    
    updatePreferencesMutation.mutate({
      [field]: checked,
    });
  };
  
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t('notifications_center')}</h1>
      
      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="preferences">{t('preferences')}</TabsTrigger>
          <TabsTrigger value="reminders">{t('reminders')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences" className="mt-6">
          <div className="space-y-6">
            {/* Enhanced notification preferences component */}
            <NotificationPreferences />
            
            {/* Push notification demo */}
            <div className="mt-8">
              <PushNotificationDemo />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reminders" className="mt-6">
          <RemindersManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}