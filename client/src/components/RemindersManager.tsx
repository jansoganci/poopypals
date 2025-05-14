import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarClock, Clock, Plus, Trash2, AlertCircle, BellRing, Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

// Define reminder schema
const reminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  frequency: z.enum(["daily", "weekly", "custom"]),
  time: z.string().min(1, "Time is required"),
  daysOfWeek: z.string().optional(),
  isActive: z.boolean().default(true)
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

interface Reminder {
  id: number;
  userId: number;
  title: string;
  message: string;
  frequency: 'daily' | 'weekly' | 'custom';
  time: string;
  daysOfWeek?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function RemindersManager() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch reminders
  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ['/api/reminders'],
  });
  
  // Create reminder mutation
  const createReminderMutation = useMutation({
    mutationFn: async (data: ReminderFormValues) => {
      return apiRequest('/api/reminders', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      setOpen(false);
      toast({
        title: t('reminder_created'),
        description: t('reminder_created_description'),
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('error_creating_reminder'),
      });
    }
  });
  
  // Toggle reminder active state
  const toggleReminderMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number, isActive: boolean }) => {
      return apiRequest(`/api/reminders/${id}/toggle`, 'PATCH', { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
    },
  });
  
  // Delete reminder
  const deleteReminderMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/reminders/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      toast({
        title: t('reminder_deleted'),
        description: t('reminder_deleted_description'),
      });
    },
  });
  
  // Form for creating reminders
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: '',
      message: '',
      frequency: 'daily',
      time: '08:00',
      isActive: true
    }
  });
  
  // Format time for display
  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return time;
    }
  };
  
  // Format frequency for display
  const formatFrequency = (frequency: string, daysOfWeek?: string) => {
    switch (frequency) {
      case 'daily':
        return t('daily');
      case 'weekly':
        return t('weekly');
      case 'custom':
        if (daysOfWeek) {
          const days = daysOfWeek.split(',').map(Number);
          const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
          return days.map(day => t(dayNames[day - 1])).join(', ');
        }
        return t('custom');
      default:
        return frequency;
    }
  };
  
  // Handle form submission
  const onSubmit = (data: ReminderFormValues) => {
    createReminderMutation.mutate(data);
  };
  
  // Show/hide days of week field based on frequency
  const watchFrequency = form.watch('frequency');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('reminders')}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('add_reminder')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('create_reminder')}</DialogTitle>
              <DialogDescription>
                {t('create_reminder_description')}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('title')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('time_to_log')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('message')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t('reminder_message_placeholder')} 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('frequency')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_frequency')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">{t('daily')}</SelectItem>
                            <SelectItem value="weekly">{t('weekly')}</SelectItem>
                            <SelectItem value="custom">{t('custom')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('time')}</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {watchFrequency === 'custom' && (
                  <FormField
                    control={form.control}
                    name="daysOfWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('days_of_week')}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('days_of_week_placeholder')} 
                            {...field} 
                          />
                        </FormControl>
                        <div className="text-xs text-muted-foreground mt-1">
                          {t('days_of_week_help')}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t('active')}</FormLabel>
                        <div className="text-xs text-muted-foreground">
                          {t('active_description')}
                        </div>
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
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    {t('cancel')}
                  </Button>
                  <Button type="submit" disabled={createReminderMutation.isPending}>
                    {createReminderMutation.isPending ? (
                      <>
                        <CalendarClock className="mr-2 h-4 w-4 animate-spin" />
                        {t('creating')}
                      </>
                    ) : (
                      t('create')
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <CalendarClock className="mr-2 h-6 w-6 animate-spin" />
          <span>{t('loading')}</span>
        </div>
      ) : reminders.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <BellRing className="h-10 w-10 mb-4 text-muted-foreground/60" />
            <h3 className="text-lg font-medium">{t('no_reminders')}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {t('no_reminders_description')}
            </p>
            <Button className="mt-6" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('add_first_reminder')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reminders.map((reminder: Reminder) => (
            <Card key={reminder.id} className={reminder.isActive ? "border-amber-200" : "border-muted opacity-70"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{reminder.title}</CardTitle>
                  <Switch
                    checked={reminder.isActive}
                    onCheckedChange={(checked) => 
                      toggleReminderMutation.mutate({ id: reminder.id, isActive: checked })
                    }
                  />
                </div>
                <CardDescription className="flex items-center text-xs mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(reminder.time)} • {formatFrequency(reminder.frequency, reminder.daysOfWeek)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{reminder.message}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button variant="link" size="sm" className="px-0 text-muted-foreground">
                  {t('edit')}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive/90"
                  onClick={() => {
                    if (window.confirm(t('confirm_delete_reminder'))) {
                      deleteReminderMutation.mutate(reminder.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t('delete')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}