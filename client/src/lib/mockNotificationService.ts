// Mock notification service for development and testing
import { faker } from '@faker-js/faker';

// Types
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'achievement' | 'streak' | 'reminder' | 'system' | 'tip';
  isRead: boolean;
  createdAt: string;
  iconPath?: string;
  actionPath?: string;
  expiresAt?: string;
}

// Mock notification templates
const NOTIFICATION_TEMPLATES = [
  {
    id: 'reminder_general',
    title: '👑 Throne Awaits!',
    body: 'Time for your royal sitting. Don\'t forget to log your visit!',
    type: 'reminder',
  },
  {
    id: 'streak_alert',
    title: '🔥 Streak Alert!',
    body: 'You\'re on day {days} - don\'t flush away your progress!',
    type: 'streak',
  },
  {
    id: 'missed_logs',
    title: '💔 Missing you!',
    body: 'Your poop diary is feeling neglected.',
    type: 'reminder',
  },
  {
    id: 'achievement_unlock',
    title: '🏆 Achievement unlocked: \'{achievement}\'!',
    body: 'Open the app to claim your reward!',
    type: 'achievement',
  },
  {
    id: 'hydration_tip',
    title: '💧 Hydration Reminder',
    body: 'Staying hydrated keeps things flowing smoothly. Drink up!',
    type: 'tip',
  },
  {
    id: 'fiber_tip',
    title: '🥦 Fiber Friendly Reminder',
    body: 'A diet rich in fiber keeps your digestive system happy!',
    type: 'tip',
  },
  {
    id: 'regular_schedule_tip',
    title: '⏰ Routine Reminder',
    body: 'Regular bathroom times help train your body. Try going at the same time each day!',
    type: 'tip',
  },
  {
    id: 'consistency_tip',
    title: '📝 Consistency Matters',
    body: 'Logging your bathroom visits helps identify patterns and potential health issues.',
    type: 'tip',
  },
  {
    id: 'humor_tip',
    title: '😂 Laugh It Out',
    body: 'Did you know laughter can stimulate digestion? Find something funny to watch!',
    type: 'tip',
  },
];

// Mock achievements for notifications
const ACHIEVEMENTS = [
  'Regular Routine',
  'Perfect Pooper',
  'Consistency King',
  'Fiber Fanatic',
  'Hydration Hero',
  'Bowel Buddy',
  'Streak Superstar',
];

// Generate a random notification based on templates
export function generateRandomNotification(id: number): Notification {
  const template = NOTIFICATION_TEMPLATES[Math.floor(Math.random() * NOTIFICATION_TEMPLATES.length)];
  let title = template.title;
  let message = template.body;
  
  // Replace placeholders if needed
  if (template.id === 'streak_alert') {
    const days = Math.floor(Math.random() * 30) + 3; // Random streak between 3-33
    message = message.replace('{days}', days.toString());
  } else if (template.id === 'achievement_unlock') {
    const achievement = ACHIEVEMENTS[Math.floor(Math.random() * ACHIEVEMENTS.length)];
    title = title.replace('{achievement}', achievement);
  }
  
  // Generate a random creation date (within the last 7 days)
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 7));
  
  return {
    id,
    title,
    message,
    type: template.type as any,
    isRead: Math.random() > 0.7, // 30% chance of being unread
    createdAt: createdAt.toISOString(),
  };
}

// Generate a list of mock notifications
export function generateMockNotifications(count: number = 5): Notification[] {
  return Array.from({ length: count }, (_, index) => generateRandomNotification(index + 1));
}

// Mock API functions that mimic the server API but use mock data
let mockNotifications: Notification[] = generateMockNotifications(10);

export async function fetchNotifications(): Promise<Notification[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockNotifications].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function markAsRead(id: number): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Find and update the notification
  const index = mockNotifications.findIndex(n => n.id === id);
  if (index !== -1) {
    mockNotifications[index] = {
      ...mockNotifications[index],
      isRead: true
    };
  }
}

export async function markAllAsRead(): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mark all as read
  mockNotifications = mockNotifications.map(n => ({
    ...n,
    isRead: true
  }));
}

export async function generateNewNotification(): Promise<Notification> {
  // Create a new notification with the next available ID
  const maxId = mockNotifications.reduce((max, n) => Math.max(max, n.id), 0);
  const newNotification = generateRandomNotification(maxId + 1);
  
  // Add it to the mock database
  mockNotifications.push(newNotification);
  
  // Return the new notification
  return newNotification;
}

// For development: generate a new notification every 30 seconds
export function startAutomaticNotifications(callback?: (notification: Notification) => void): () => void {
  const intervalId = setInterval(async () => {
    if (Math.random() > 0.7) { // 30% chance of generating a notification
      const notification = await generateNewNotification();
      if (callback) callback(notification);
    }
  }, 30000); // Every 30 seconds
  
  // Return a function to stop the automatic notifications
  return () => clearInterval(intervalId);
}