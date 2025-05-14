import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import RemindersManager from '@/components/RemindersManager';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';

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
            <div className="border rounded-lg p-4 space-y-4">
              <h2 className="text-xl font-semibold mb-4">{t('notification_settings')}</h2>
              
              {isLoading ? (
                <div className="py-4">{t('loading_notifications')}</div>
              ) : preferences ? (
                <>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="achievement-notifications" className="font-medium">{t('achievement_notifications')}</Label>
                      <p className="text-sm text-muted-foreground">{t('achievement_notifications_description')}</p>
                    </div>
                    <Switch 
                      id="achievement-notifications" 
                      checked={preferences.achievementNotifications}
                      onCheckedChange={(checked) => handleToggle('achievementNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="streak-notifications" className="font-medium">{t('streak_notifications')}</Label>
                      <p className="text-sm text-muted-foreground">{t('streak_notifications_description')}</p>
                    </div>
                    <Switch 
                      id="streak-notifications" 
                      checked={preferences.streakNotifications}
                      onCheckedChange={(checked) => handleToggle('streakNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="reminder-notifications" className="font-medium">{t('reminder_notifications')}</Label>
                      <p className="text-sm text-muted-foreground">{t('reminder_notifications_description')}</p>
                    </div>
                    <Switch 
                      id="reminder-notifications" 
                      checked={preferences.reminderNotifications}
                      onCheckedChange={(checked) => handleToggle('reminderNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="push-notifications" className="font-medium">{t('push_notifications')}</Label>
                      <p className="text-sm text-muted-foreground">{t('push_notifications_description')}</p>
                    </div>
                    <Switch 
                      id="push-notifications" 
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) => handleToggle('pushNotifications', checked)}
                    />
                  </div>
                </>
              ) : (
                <div>{t('error_loading_preferences')}</div>
              )}
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