import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Bell, CalendarClock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeInput } from '@/components/ui/time-input';
import { toast } from '@/hooks/use-toast';

// Mock user preferences
const initialPreferences = {
  achievementNotifications: true,
  streakNotifications: true,
  reminderNotifications: true,
  pushNotifications: true,
  emailNotifications: false,
  doNotDisturbEnabled: false,
  doNotDisturbStart: '22:00',
  doNotDisturbEnd: '07:00'
};

// Form schema
const preferencesSchema = z.object({
  achievementNotifications: z.boolean().default(true),
  streakNotifications: z.boolean().default(true),
  reminderNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  emailNotifications: z.boolean().default(false),
  doNotDisturbEnabled: z.boolean().default(false),
  doNotDisturbStart: z.string().optional(),
  doNotDisturbEnd: z.string().optional(),
});

type PreferencesValues = z.infer<typeof preferencesSchema>;

// Time input options
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = [0, 15, 30, 45];

export default function NotificationPreferences() {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  
  // Create form
  const form = useForm<PreferencesValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: initialPreferences,
  });
  
  // Form submission handler
  const onSubmit = async (values: PreferencesValues) => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saved preferences:', values);
      
      // Show success toast
      toast({
        title: '✅ ' + t('preferences_saved'),
        description: t('notification_preferences_updated'),
        variant: 'default',
      });
    } catch (error) {
      // Show error toast
      toast({
        title: '❌ ' + t('error_saving'),
        description: t('try_again'),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {t('notification_settings')}
        </CardTitle>
        <CardDescription>
          {t('manage_notification_settings_description')}
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t('notification_types')}</h3>
              
              <FormField
                control={form.control}
                name="achievementNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('achievement_notifications')}
                      </FormLabel>
                      <FormDescription>
                        {t('achievement_notifications_description')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="streakNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('streak_notifications')}
                      </FormLabel>
                      <FormDescription>
                        {t('streak_notifications_description')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reminderNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('reminder_notifications')}
                      </FormLabel>
                      <FormDescription>
                        {t('reminder_notifications_description')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t('notification_channels')}</h3>
              
              <FormField
                control={form.control}
                name="pushNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('push_notifications')}
                      </FormLabel>
                      <FormDescription>
                        {t('push_notifications_description')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('email_notifications')}
                      </FormLabel>
                      <FormDescription>
                        {t('email_notifications_description')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="doNotDisturbEnabled"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <CalendarClock className="h-4 w-4" />
                          {t('do_not_disturb')}
                        </FormLabel>
                        <FormDescription>
                          {t('do_not_disturb_description')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    
                    {field.value && (
                      <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                        <FormField
                          control={form.control}
                          name="doNotDisturbStart"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('start_time')}</FormLabel>
                              <FormControl>
                                <div className="flex space-x-2">
                                  <Select
                                    value={field.value?.split(':')[0] || '22'}
                                    onValueChange={(value) => {
                                      const [_, minutes] = (field.value || '22:00').split(':');
                                      field.onChange(`${value}:${minutes}`);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="HH" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {hours.map((hour) => (
                                        <SelectItem key={hour} value={hour.toString().padStart(2, '0')}>
                                          {hour.toString().padStart(2, '0')}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <span className="flex items-center">:</span>
                                  <Select
                                    value={field.value?.split(':')[1] || '00'}
                                    onValueChange={(value) => {
                                      const [hours, _] = (field.value || '22:00').split(':');
                                      field.onChange(`${hours}:${value}`);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {minutes.map((minute) => (
                                        <SelectItem key={minute} value={minute.toString().padStart(2, '0')}>
                                          {minute.toString().padStart(2, '0')}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="doNotDisturbEnd"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('end_time')}</FormLabel>
                              <FormControl>
                                <div className="flex space-x-2">
                                  <Select
                                    value={field.value?.split(':')[0] || '07'}
                                    onValueChange={(value) => {
                                      const [_, minutes] = (field.value || '07:00').split(':');
                                      field.onChange(`${value}:${minutes}`);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="HH" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {hours.map((hour) => (
                                        <SelectItem key={hour} value={hour.toString().padStart(2, '0')}>
                                          {hour.toString().padStart(2, '0')}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <span className="flex items-center">:</span>
                                  <Select
                                    value={field.value?.split(':')[1] || '00'}
                                    onValueChange={(value) => {
                                      const [hours, _] = (field.value || '07:00').split(':');
                                      field.onChange(`${hours}:${value}`);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {minutes.map((minute) => (
                                        <SelectItem key={minute} value={minute.toString().padStart(2, '0')}>
                                          {minute.toString().padStart(2, '0')}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end border-t p-4">
            <Button disabled={isSaving}>
              {isSaving ? t('saving') : t('save_changes')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}