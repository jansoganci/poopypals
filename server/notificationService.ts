import { storage } from './storage';
import { InsertNotification, InsertNotificationTemplate, NotificationTemplate } from '@shared/schema';
import { format, addDays, isAfter, subHours } from 'date-fns';

// Default notification templates
const DEFAULT_TEMPLATES: InsertNotificationTemplate[] = [
  {
    templateId: 'reminder_general',
    title: 'Throne Awaits! 👑',
    body: 'Time for your royal sitting. Don\'t forget to log your visit!',
    type: 'reminder',
    emoji: '👑',
  },
  {
    templateId: 'streak_alert',
    title: '🚨 Streak Alert! 🚨',
    body: 'You\'re on day {days} - don\'t flush away your progress!',
    type: 'streak',
    emoji: '🔥',
  },
  {
    templateId: 'missed_logs',
    title: 'Missing you! 💔',
    body: 'Your poop diary is feeling neglected.',
    type: 'reminder',
    emoji: '💔',
  },
  {
    templateId: 'achievement_unlock',
    title: 'Achievement unlocked: \'{achievement}\'! 🏆',
    body: 'Open the app to claim your reward!',
    type: 'achievement',
    emoji: '🏆',
  },
  {
    templateId: 'hydration_tip',
    title: 'Hydration Reminder 💧',
    body: 'Staying hydrated keeps things flowing smoothly. Drink up!',
    type: 'tip',
    emoji: '💧',
  },
  {
    templateId: 'fiber_tip',
    title: 'Fiber Friendly Reminder 🥦',
    body: 'A diet rich in fiber keeps your digestive system happy!',
    type: 'tip',
    emoji: '🥦',
  },
  {
    templateId: 'regular_schedule_tip',
    title: 'Routine Reminder ⏰',
    body: 'Regular bathroom times help train your body. Try going at the same time each day!',
    type: 'tip',
    emoji: '⏰',
  },
];

// Initialize notification templates
export async function initializeNotificationTemplates(): Promise<void> {
  try {
    // Check if templates already exist
    const existingTemplates = await storage.getAllNotificationTemplates();
    
    if (existingTemplates.length === 0) {
      // No templates found, initialize them
      for (const template of DEFAULT_TEMPLATES) {
        await storage.createNotificationTemplate(template);
      }
      console.log(`Created ${DEFAULT_TEMPLATES.length} notification templates`);
    } else {
      console.log(`${existingTemplates.length} notification templates already exist, skipping initialization`);
    }
  } catch (error) {
    console.error('Error initializing notification templates:', error);
  }
}

// Function to schedule push notifications based on user behavior
export async function scheduleNotifications(userId: number): Promise<void> {
  try {
    // Get user notification preferences
    const preferences = await storage.getUserNotificationPreferences(userId);
    
    // Skip if push notifications are disabled
    if (!preferences || !preferences.pushNotifications) {
      return;
    }
    
    // Get user logs to analyze patterns
    const logs = await storage.getRecentPoopLogs(userId, 30); // Last 30 days of logs
    
    // Check if user has logged today
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const hasLoggedToday = logs.some(log => {
      const logDate = new Date(log.dateTime);
      return logDate >= todayStart;
    });
    
    // If no logs in 24+ hours, send a reminder
    if (logs.length > 0 && !hasLoggedToday) {
      const lastLog = logs[0];
      const lastLogDate = new Date(lastLog.dateTime);
      const daysSinceLog = Math.floor((today.getTime() - lastLogDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLog >= 1) {
        // Send a reminder notification
        const template = await storage.getNotificationTemplateById('missed_logs');
        if (template) {
          await createNotification(userId, template);
        }
      }
    }
    
    // Check for streaks
    if (logs.length >= 3) {
      // Determine if user has a streak (logs on consecutive days)
      // This is a simplified version - you could make this more sophisticated
      const sortedLogs = [...logs].sort((a, b) => 
        new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
      );
      
      let streak = 1;
      let prevDate = new Date(sortedLogs[0].dateTime);
      prevDate = new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate());
      
      for (let i = 1; i < sortedLogs.length; i++) {
        const currDate = new Date(sortedLogs[i].dateTime);
        const currDay = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());
        
        const expectedPrevDay = new Date(currDay);
        expectedPrevDay.setDate(expectedPrevDay.getDate() + 1);
        
        if (expectedPrevDay.getTime() === prevDate.getTime()) {
          streak++;
        } else {
          break;
        }
        
        prevDate = currDay;
      }
      
      // If streak is reaching a milestone (multiples of 5), send a notification
      if (streak >= 3 && streak % 5 === 0) {
        const template = await storage.getNotificationTemplateById('streak_alert');
        if (template) {
          // Replace placeholder with actual streak count
          const customBody = template.body.replace('{days}', streak.toString());
          
          await storage.createNotification({
            userId,
            title: template.title,
            message: customBody,
            type: 'streak',
            isRead: false,
            iconPath: null,
            actionPath: null,
            expiresAt: null
          });
        }
      }
    }
    
    // Schedule next reminder based on typical log times
    if (logs.length >= 5) {
      // Analyze patterns to find typical log time
      const logHours = logs.map(log => new Date(log.dateTime).getHours());
      
      // Find most common hour
      const hourCounts: Record<number, number> = {};
      logHours.forEach(hour => {
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });
      
      const mostCommonHour = Object.entries(hourCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
      
      // Schedule a reminder for tomorrow at the typical time if they haven't logged today
      if (!hasLoggedToday) {
        const tomorrow = addDays(today, 1);
        tomorrow.setHours(parseInt(mostCommonHour), 0, 0, 0);
        
        // Check if it's in do not disturb period
        let shouldSchedule = true;
        if (preferences.doNotDisturbStart && preferences.doNotDisturbEnd) {
          const [dndStartHour, dndStartMinute] = preferences.doNotDisturbStart.split(':').map(Number);
          const [dndEndHour, dndEndMinute] = preferences.doNotDisturbEnd.split(':').map(Number);
          
          const dndStart = new Date(tomorrow);
          dndStart.setHours(dndStartHour, dndStartMinute, 0, 0);
          
          const dndEnd = new Date(tomorrow);
          dndEnd.setHours(dndEndHour, dndEndMinute, 0, 0);
          
          // Adjust for overnight DND periods
          if (dndStartHour > dndEndHour) {
            dndEnd.setDate(dndEnd.getDate() + 1);
          }
          
          shouldSchedule = !(tomorrow >= dndStart && tomorrow <= dndEnd);
        }
        
        if (shouldSchedule) {
          const template = await storage.getNotificationTemplateById('reminder_general');
          if (template) {
            await createNotification(userId, template, tomorrow);
          }
        }
      }
    }
    
    // Occasionally send health tips (every ~7 days)
    const lastTip = await storage.getUserLastNotificationByType(userId, 'tip');
    if (!lastTip || isAfter(today, addDays(new Date(lastTip.createdAt), 7))) {
      // Get a random tip template
      const tipTemplates = await storage.getNotificationTemplatesByType('tip');
      if (tipTemplates.length > 0) {
        const randomTip = tipTemplates[Math.floor(Math.random() * tipTemplates.length)];
        await createNotification(userId, randomTip);
      }
    }
    
  } catch (error) {
    console.error(`Error scheduling notifications for user ${userId}:`, error);
  }
}

// Helper function to create a notification from a template
async function createNotification(
  userId: number, 
  template: NotificationTemplate,
  scheduledTime?: Date
): Promise<void> {
  const notification: InsertNotification = {
    userId,
    title: template.title,
    message: template.body,
    type: template.type,
    isRead: false,
    iconPath: null,
    actionPath: null,
    expiresAt: scheduledTime || null
  };
  
  await storage.createNotification(notification);
}

// Function to check and mark notifications as expired
export async function processExpiredNotifications(): Promise<void> {
  try {
    const now = new Date();
    const expiredNotifications = await storage.getExpiredNotifications(now);
    
    for (const notification of expiredNotifications) {
      // Process notification (in a real implementation this would push to device)
      console.log(`Processing expired notification: ${notification.id} - ${notification.title}`);
      
      // Mark as expired/processed
      await storage.markNotificationAsProcessed(notification.id);
    }
  } catch (error) {
    console.error('Error processing expired notifications:', error);
  }
}