import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { checkChallengeProgress, assignRandomChallenges } from "./challengeUtils";

// Import validation schemas
import { 
  insertPoopLogSchema, 
  insertAvatarComponentSchema, 
  insertUserAvatarSchema,
  insertNotificationSchema,
  insertNotificationPreferencesSchema,
  insertReminderSchema 
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for poop logs
  app.get('/api/logs', async (req, res) => {
    try {
      const logs = await storage.getAllPoopLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get logs' });
    }
  });

  app.post('/api/logs', async (req, res) => {
    try {
      const newLog = await storage.createPoopLog(req.body);
      
      // Default to user ID 1 for demo purposes
      const userId = 1;
      
      // Check and update existing challenge progress
      await checkChallengeProgress(userId);
      
      // Randomly assign new challenges if needed
      await assignRandomChallenges(userId);
      
      res.status(201).json(newLog);
    } catch (error) {
      console.error('Error creating log:', error);
      res.status(500).json({ message: 'Failed to create log' });
    }
  });

  // API routes for achievements
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get achievements' });
    }
  });

  app.post('/api/achievements', async (req, res) => {
    try {
      const newAchievement = await storage.createAchievement(req.body);
      res.status(201).json(newAchievement);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create achievement' });
    }
  });

  // API route for user stats
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get stats' });
    }
  });

  // API routes for challenges
  app.get('/api/challenges', async (req, res) => {
    try {
      const challenges = await storage.getActiveGlobalChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get challenges' });
    }
  });

  app.post('/api/challenges', async (req, res) => {
    try {
      const newChallenge = await storage.createChallenge(req.body);
      res.status(201).json(newChallenge);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create challenge' });
    }
  });

  // API routes for user challenges
  app.get('/api/user-challenges', async (req, res) => {
    try {
      // Default to user ID 1 for demo
      const userId = 1;
      const userChallenges = await storage.getUserActiveChallenges(userId);
      res.json(userChallenges);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user challenges' });
    }
  });

  app.post('/api/user-challenges/assign', async (req, res) => {
    try {
      const { challengeId } = req.body;
      // Default to user ID 1 for demo
      const userId = 1;
      const userChallenge = await storage.assignChallengeToUser(userId, challengeId);
      res.status(201).json(userChallenge);
    } catch (error) {
      res.status(500).json({ message: 'Failed to assign challenge' });
    }
  });

  app.put('/api/user-challenges/:id/progress', async (req, res) => {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      const userChallenge = await storage.updateUserChallengeProgress(Number(id), progress);
      res.json(userChallenge);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update challenge progress' });
    }
  });

  app.put('/api/user-challenges/:id/complete', async (req, res) => {
    try {
      const { id } = req.params;
      const userChallenge = await storage.completeUserChallenge(Number(id));
      res.json(userChallenge);
    } catch (error) {
      res.status(500).json({ message: 'Failed to complete challenge' });
    }
  });

  // Avatar Component Routes
  app.get('/api/avatar/components', async (req, res) => {
    try {
      const components = await storage.getAvatarComponents();
      res.json(components);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get avatar components' });
    }
  });

  app.get('/api/avatar/components/:type', async (req, res) => {
    try {
      const { type } = req.params;
      const components = await storage.getAvatarComponentsByType(type);
      res.json(components);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get avatar components by type' });
    }
  });

  app.post('/api/avatar/components', async (req, res) => {
    try {
      const parseResult = insertAvatarComponentSchema.safeParse(req.body);
      if (!parseResult.success) {
        const errorMessage = fromZodError(parseResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const component = await storage.createAvatarComponent(parseResult.data);
      res.status(201).json(component);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create avatar component' });
    }
  });

  app.get('/api/users/:userId/avatar/components', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const components = await storage.getUserAvatarComponents(userId);
      res.json(components);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user avatar components' });
    }
  });

  app.post('/api/users/:userId/avatar/components/:componentId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const componentId = parseInt(req.params.componentId);
      
      if (isNaN(userId) || isNaN(componentId)) {
        return res.status(400).json({ message: 'Invalid user ID or component ID' });
      }
      
      const userComponent = await storage.unlockAvatarComponentForUser(userId, componentId);
      res.status(201).json(userComponent);
    } catch (error) {
      res.status(500).json({ message: 'Failed to unlock avatar component for user' });
    }
  });

  app.get('/api/users/:userId/avatar', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const avatar = await storage.getUserAvatar(userId);
      if (!avatar) {
        return res.status(404).json({ message: 'Avatar not found' });
      }
      
      res.json(avatar);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user avatar' });
    }
  });

  app.post('/api/users/:userId/avatar', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const parseResult = insertUserAvatarSchema.safeParse({
        ...req.body,
        userId
      });
      
      if (!parseResult.success) {
        const errorMessage = fromZodError(parseResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const avatar = await storage.updateUserAvatar(userId, parseResult.data);
      res.json(avatar);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user avatar' });
    }
  });
  
  // Notification API Routes
  // Get all notifications for a user
  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = 1; // Always use demo user for now
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const notifications = await storage.getUserNotifications(userId, limit);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });
  
  // Create a new notification
  app.post("/api/notifications", async (req, res) => {
    try {
      const userId = 1; // Always use demo user for now
      
      // Validate the request body
      const parseResult = insertNotificationSchema.safeParse({
        ...req.body,
        userId
      });
      
      if (!parseResult.success) {
        const errorMessage = fromZodError(parseResult.error).message;
        return res.status(400).json({ error: errorMessage });
      }
      
      const notification = await storage.createNotification(parseResult.data);
      res.status(201).json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: "Failed to create notification" });
    }
  });
  
  // Mark a notification as read
  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(notificationId);
      res.json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });
  
  // Mark all notifications as read for a user
  app.patch("/api/notifications/read-all", async (req, res) => {
    try {
      const userId = 1; // Always use demo user for now
      await storage.markAllUserNotificationsAsRead(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });
  
  // Delete a notification
  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.deleteNotification(notificationId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });
  
  // Notification Preferences API Routes
  // Get notification preferences for a user
  app.get("/api/notification-preferences", async (req, res) => {
    try {
      const userId = 1; // Always use demo user for now
      const preferences = await storage.getUserNotificationPreferences(userId);
      res.json(preferences || { userId });
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      res.status(500).json({ error: "Failed to fetch notification preferences" });
    }
  });
  
  // Create or update notification preferences
  app.post("/api/notification-preferences", async (req, res) => {
    try {
      const userId = 1; // Always use demo user for now
      
      // Validate the request body
      const parseResult = insertNotificationPreferencesSchema.safeParse({
        ...req.body,
        userId
      });
      
      if (!parseResult.success) {
        const errorMessage = fromZodError(parseResult.error).message;
        return res.status(400).json({ error: errorMessage });
      }
      
      const preferences = await storage.createOrUpdateNotificationPreferences(userId, parseResult.data);
      res.json(preferences);
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      res.status(500).json({ error: "Failed to update notification preferences" });
    }
  });
  
  // Reminder API Routes
  // Get all reminders for a user
  app.get("/api/reminders", async (req, res) => {
    try {
      const userId = 1; // Always use demo user for now
      const reminders = await storage.getUserReminders(userId);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ error: "Failed to fetch reminders" });
    }
  });
  
  // Create a new reminder
  app.post("/api/reminders", async (req, res) => {
    try {
      const userId = 1; // Always use demo user for now
      
      // Validate the request body
      const parseResult = insertReminderSchema.safeParse({
        ...req.body,
        userId
      });
      
      if (!parseResult.success) {
        const errorMessage = fromZodError(parseResult.error).message;
        return res.status(400).json({ error: errorMessage });
      }
      
      const reminder = await storage.createReminder(parseResult.data);
      res.status(201).json(reminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({ error: "Failed to create reminder" });
    }
  });
  
  // Update a reminder
  app.patch("/api/reminders/:id", async (req, res) => {
    try {
      const reminderId = parseInt(req.params.id);
      
      // Ensure reminder exists
      const existingReminder = await storage.getReminderById(reminderId);
      if (!existingReminder) {
        return res.status(404).json({ error: "Reminder not found" });
      }
      
      const updatedReminder = await storage.updateReminder(reminderId, req.body);
      res.json(updatedReminder);
    } catch (error) {
      console.error("Error updating reminder:", error);
      res.status(500).json({ error: "Failed to update reminder" });
    }
  });
  
  // Toggle a reminder active/inactive
  app.patch("/api/reminders/:id/toggle", async (req, res) => {
    try {
      const reminderId = parseInt(req.params.id);
      const isActive = req.body.isActive === true;
      
      const reminder = await storage.toggleReminderActive(reminderId, isActive);
      res.json(reminder);
    } catch (error) {
      console.error("Error toggling reminder:", error);
      res.status(500).json({ error: "Failed to toggle reminder" });
    }
  });
  
  // Delete a reminder
  app.delete("/api/reminders/:id", async (req, res) => {
    try {
      const reminderId = parseInt(req.params.id);
      await storage.deleteReminder(reminderId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting reminder:", error);
      res.status(500).json({ error: "Failed to delete reminder" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
