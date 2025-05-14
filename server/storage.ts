import { 
  users, poopLogs, achievements, challenges, userChallenges,
  avatarComponents, userAvatarComponents, userAvatars,
  notifications, notificationPreferences, reminders,
  type User, type InsertUser, type PoopLog, type Achievement,
  type Challenge, type InsertChallenge, type UserChallenge, type InsertUserChallenge,
  type AvatarComponent, type InsertAvatarComponent, 
  type UserAvatarComponent, type InsertUserAvatarComponent,
  type UserAvatar, type InsertUserAvatar,
  type Notification, type InsertNotification,
  type NotificationPreferences, type InsertNotificationPreferences,
  type Reminder, type InsertReminder
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserFlushFunds(userId: number, amount: number): Promise<User>;
  
  // Poop log methods
  createPoopLog(log: any): Promise<PoopLog>;
  getPoopLogById(id: number): Promise<PoopLog | undefined>;
  getAllPoopLogs(): Promise<PoopLog[]>;
  getRecentPoopLogs(userId: number, days: number): Promise<PoopLog[]>;
  
  // Achievement methods
  createAchievement(achievement: any): Promise<Achievement>;
  getAchievementById(id: number): Promise<Achievement | undefined>;
  getAllAchievements(): Promise<Achievement[]>;
  
  // Challenge methods
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  getChallengeById(id: number): Promise<Challenge | undefined>;
  getActiveGlobalChallenges(): Promise<Challenge[]>;
  
  // User Challenge methods
  assignChallengeToUser(userId: number, challengeId: number): Promise<UserChallenge>;
  getUserActiveChallenges(userId: number): Promise<(UserChallenge & { challenge: Challenge })[]>;
  updateUserChallengeProgress(userChallengeId: number, progress: number): Promise<UserChallenge>;
  completeUserChallenge(userChallengeId: number): Promise<UserChallenge>;
  
  // Stats methods
  getUserStats(): Promise<any>;
  
  // Avatar methods
  createAvatarComponent(component: InsertAvatarComponent): Promise<AvatarComponent>;
  getAvatarComponents(): Promise<AvatarComponent[]>;
  getAvatarComponentsByType(type: string): Promise<AvatarComponent[]>;
  getUserAvatarComponents(userId: number): Promise<(UserAvatarComponent & { component: AvatarComponent })[]>;
  unlockAvatarComponentForUser(userId: number, componentId: number): Promise<UserAvatarComponent>;
  getUserAvatar(userId: number): Promise<UserAvatar | undefined>;
  updateUserAvatar(userId: number, avatarData: Partial<InsertUserAvatar>): Promise<UserAvatar>;
  
  // Notification methods
  createNotification(notificationData: InsertNotification): Promise<Notification>;
  getNotificationById(id: number): Promise<Notification | undefined>;
  getUserNotifications(userId: number, limit?: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<Notification>;
  markAllUserNotificationsAsRead(userId: number): Promise<void>;
  deleteNotification(id: number): Promise<void>;
  
  // Notification preferences methods
  getUserNotificationPreferences(userId: number): Promise<NotificationPreferences | undefined>;
  createOrUpdateNotificationPreferences(userId: number, preferences: Partial<InsertNotificationPreferences>): Promise<NotificationPreferences>;
  
  // Reminder methods
  createReminder(reminderData: InsertReminder): Promise<Reminder>;
  getReminderById(id: number): Promise<Reminder | undefined>;
  getUserReminders(userId: number): Promise<Reminder[]>;
  updateReminder(id: number, reminderData: Partial<InsertReminder>): Promise<Reminder>;
  deleteReminder(id: number): Promise<void>;
  toggleReminderActive(id: number, isActive: boolean): Promise<Reminder>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Set default values for new users
    const userWithDefaults = {
      ...insertUser,
      streakCount: 5,
      totalLogs: 12,
      flushFunds: 235
    };
    
    const [user] = await db
      .insert(users)
      .values(userWithDefaults)
      .returning();
    return user;
  }
  
  async createPoopLog(logData: any): Promise<PoopLog> {
    // Set userId to 1 for demo purposes if not provided
    const logWithDefaults = {
      userId: 1,
      dateTime: logData.dateTime ? new Date(logData.dateTime) : new Date(),
      duration: logData.duration || 5,
      rating: logData.rating || 'excellent',
      consistency: logData.consistency || 4,
      notes: logData.notes || '',
    };
    
    const [log] = await db
      .insert(poopLogs)
      .values(logWithDefaults)
      .returning();
      
    // Update user stats
    const user = await this.getUser(1);
    if (user) {
      await db.update(users)
        .set({ totalLogs: user.totalLogs + 1 })
        .where(eq(users.id, 1));
    }
    
    return log;
  }
  
  async getPoopLogById(id: number): Promise<PoopLog | undefined> {
    const [log] = await db.select().from(poopLogs).where(eq(poopLogs.id, id));
    return log;
  }
  
  async getAllPoopLogs(): Promise<PoopLog[]> {
    return db.select().from(poopLogs).orderBy(desc(poopLogs.dateTime));
  }
  
  async createAchievement(achievementData: any): Promise<Achievement> {
    const achievementWithDefaults = {
      userId: 1, // Default to first user for demo
      type: achievementData.type || 'streak',
      name: achievementData.name || 'Consistent Pooper',
      description: achievementData.description || '5 day streak',
      unlockedAt: new Date()
    };
    
    const [achievement] = await db
      .insert(achievements)
      .values(achievementWithDefaults)
      .returning();
      
    return achievement;
  }
  
  async getAchievementById(id: number): Promise<Achievement | undefined> {
    const [achievement] = await db.select().from(achievements).where(eq(achievements.id, id));
    return achievement;
  }
  
  async getAllAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements).orderBy(desc(achievements.unlockedAt));
  }

  // Challenge methods
  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const [newChallenge] = await db
      .insert(challenges)
      .values(challenge)
      .returning();
    return newChallenge;
  }
  
  async getChallengeById(id: number): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge;
  }
  
  async getActiveGlobalChallenges(): Promise<Challenge[]> {
    return db.select()
      .from(challenges)
      .where(eq(challenges.isActive, true))
      .orderBy(desc(challenges.createdAt));
  }
  
  // User Challenge methods
  async assignChallengeToUser(userId: number, challengeId: number): Promise<UserChallenge> {
    // Check if user already has this challenge
    const existingChallenges = await db.select()
      .from(userChallenges)
      .where(
        and(
          eq(userChallenges.userId, userId),
          eq(userChallenges.challengeId, challengeId),
          eq(userChallenges.isCompleted, false)
        )
      );
    
    if (existingChallenges.length > 0) {
      return existingChallenges[0];
    }
    
    // Otherwise, assign the challenge
    const [userChallenge] = await db
      .insert(userChallenges)
      .values({
        userId,
        challengeId,
        progress: 0,
        isCompleted: false
      })
      .returning();
    
    return userChallenge;
  }
  
  async getUserActiveChallenges(userId: number): Promise<(UserChallenge & { challenge: Challenge })[]> {
    const result = await db.select({
      userChallenge: userChallenges,
      challenge: challenges
    })
    .from(userChallenges)
    .innerJoin(challenges, eq(userChallenges.challengeId, challenges.id))
    .where(
      and(
        eq(userChallenges.userId, userId),
        eq(userChallenges.isCompleted, false)
      )
    )
    .orderBy(desc(userChallenges.assignedAt));
    
    // Flatten the result structure
    return result.map(r => ({
      ...r.userChallenge,
      challenge: r.challenge
    }));
  }
  
  async updateUserChallengeProgress(userChallengeId: number, progress: number): Promise<UserChallenge> {
    const [updatedUserChallenge] = await db
      .update(userChallenges)
      .set({ progress })
      .where(eq(userChallenges.id, userChallengeId))
      .returning();
    
    return updatedUserChallenge;
  }
  
  async completeUserChallenge(userChallengeId: number): Promise<UserChallenge> {
    // Get the user challenge
    const [userChallenge] = await db.select()
      .from(userChallenges)
      .innerJoin(challenges, eq(userChallenges.challengeId, challenges.id))
      .where(eq(userChallenges.id, userChallengeId));
    
    if (!userChallenge) {
      throw new Error('User challenge not found');
    }
    
    // Update the user challenge
    const [updatedUserChallenge] = await db
      .update(userChallenges)
      .set({ 
        isCompleted: true,
        completedAt: new Date()
      })
      .where(eq(userChallenges.id, userChallengeId))
      .returning();
    
    // Update the user's flush funds
    await this.updateUserFlushFunds(
      updatedUserChallenge.userId,
      userChallenge.challenges.rewardAmount
    );
    
    return updatedUserChallenge;
  }

  // Get recent poop logs for challenge validation
  async getRecentPoopLogs(userId: number, days: number): Promise<PoopLog[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return db.select()
      .from(poopLogs)
      .where(
        and(
          eq(poopLogs.userId, userId),
          gte(poopLogs.dateTime, cutoffDate)
        )
      )
      .orderBy(desc(poopLogs.dateTime));
  }
  
  // Update user flush funds
  async updateUserFlushFunds(userId: number, amount: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({ 
        flushFunds: user.flushFunds + amount 
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }
  
  async getUserStats(): Promise<any> {
    const user = await this.getUser(1);
    const logs = await this.getAllPoopLogs();
    const achievementsList = await this.getAllAchievements();
    
    // Calculate average duration
    const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
    const avgDuration = logs.length > 0 ? totalDuration / logs.length : 0;
    
    // Count ratings
    const ratingCounts = logs.reduce((counts: Record<string, number>, log) => {
      counts[log.rating] = (counts[log.rating] || 0) + 1;
      return counts;
    }, {});
    
    return {
      streak: user?.streakCount || 0,
      totalLogs: user?.totalLogs || 0,
      flushFunds: user?.flushFunds || 0,
      avgDuration,
      ratingCounts,
      achievementCount: achievementsList.length
    };
  }
  
  // Avatar methods
  async createAvatarComponent(component: InsertAvatarComponent): Promise<AvatarComponent> {
    const [newComponent] = await db
      .insert(avatarComponents)
      .values(component)
      .returning();
    return newComponent;
  }

  async getAvatarComponents(): Promise<AvatarComponent[]> {
    return db.select().from(avatarComponents);
  }

  async getAvatarComponentsByType(type: string): Promise<AvatarComponent[]> {
    return db.select().from(avatarComponents).where(
      eq(avatarComponents.type, type as "head" | "eyes" | "mouth" | "accessory")
    );
  }

  async getUserAvatarComponents(userId: number): Promise<(UserAvatarComponent & { component: AvatarComponent })[]> {
    const result = await db
      .select({
        userComponent: userAvatarComponents,
        component: avatarComponents
      })
      .from(userAvatarComponents)
      .innerJoin(
        avatarComponents,
        eq(userAvatarComponents.componentId, avatarComponents.id)
      )
      .where(eq(userAvatarComponents.userId, userId));

    return result.map(({ userComponent, component }) => ({
      ...userComponent,
      component
    }));
  }

  async unlockAvatarComponentForUser(userId: number, componentId: number): Promise<UserAvatarComponent> {
    const [userComponent] = await db
      .insert(userAvatarComponents)
      .values({
        userId,
        componentId
      })
      .returning();
    return userComponent;
  }

  async getUserAvatar(userId: number): Promise<UserAvatar | undefined> {
    const [avatar] = await db
      .select()
      .from(userAvatars)
      .where(eq(userAvatars.userId, userId));
    return avatar;
  }

  async updateUserAvatar(userId: number, avatarData: Partial<InsertUserAvatar>): Promise<UserAvatar> {
    const existingAvatar = await this.getUserAvatar(userId);
    
    if (existingAvatar) {
      // Update existing avatar
      const [updatedAvatar] = await db
        .update(userAvatars)
        .set({
          ...avatarData,
          updatedAt: new Date()
        })
        .where(eq(userAvatars.userId, userId))
        .returning();
      return updatedAvatar;
    } else {
      // Create new avatar
      const [newAvatar] = await db
        .insert(userAvatars)
        .values({
          userId,
          ...avatarData
        })
        .returning();
      return newAvatar;
    }
  }
  
  // Notification methods
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async getNotificationById(id: number): Promise<Notification | undefined> {
    const [notification] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id));
    return notification;
  }

  async getUserNotifications(userId: number, limit?: number): Promise<Notification[]> {
    // Execute the full query
    let results = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
    
    // Apply limit in JavaScript if needed
    if (limit && limit > 0 && results.length > limit) {
      results = results.slice(0, limit);
    }
    
    return results;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const [notification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }

  async markAllUserNotificationsAsRead(userId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));
  }

  async deleteNotification(id: number): Promise<void> {
    await db
      .delete(notifications)
      .where(eq(notifications.id, id));
  }

  // Notification preferences methods
  async getUserNotificationPreferences(userId: number): Promise<NotificationPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId));
    return preferences;
  }

  async createOrUpdateNotificationPreferences(userId: number, preferences: Partial<InsertNotificationPreferences>): Promise<NotificationPreferences> {
    // Check if preferences exist
    const existingPreferences = await this.getUserNotificationPreferences(userId);
    
    if (existingPreferences) {
      // Update existing preferences
      const [updatedPreferences] = await db
        .update(notificationPreferences)
        .set({ 
          ...preferences,
          updatedAt: new Date()
        })
        .where(eq(notificationPreferences.userId, userId))
        .returning();
      return updatedPreferences;
    } else {
      // Create new preferences
      const [newPreferences] = await db
        .insert(notificationPreferences)
        .values({
          userId,
          ...preferences
        })
        .returning();
      return newPreferences;
    }
  }

  // Reminder methods
  async createReminder(reminderData: InsertReminder): Promise<Reminder> {
    const [reminder] = await db
      .insert(reminders)
      .values(reminderData)
      .returning();
    return reminder;
  }

  async getReminderById(id: number): Promise<Reminder | undefined> {
    const [reminder] = await db
      .select()
      .from(reminders)
      .where(eq(reminders.id, id));
    return reminder;
  }

  async getUserReminders(userId: number): Promise<Reminder[]> {
    return await db
      .select()
      .from(reminders)
      .where(eq(reminders.userId, userId))
      .orderBy(desc(reminders.createdAt));
  }

  async updateReminder(id: number, reminderData: Partial<InsertReminder>): Promise<Reminder> {
    const [reminder] = await db
      .update(reminders)
      .set({ 
        ...reminderData,
        updatedAt: new Date()
      })
      .where(eq(reminders.id, id))
      .returning();
    return reminder;
  }

  async deleteReminder(id: number): Promise<void> {
    await db
      .delete(reminders)
      .where(eq(reminders.id, id));
  }

  async toggleReminderActive(id: number, isActive: boolean): Promise<Reminder> {
    const [reminder] = await db
      .update(reminders)
      .set({ 
        isActive,
        updatedAt: new Date()
      })
      .where(eq(reminders.id, id))
      .returning();
    return reminder;
  }

  // Initialize database with a default user if it doesn't exist
  async initialize(): Promise<void> {
    // Check if the demo user exists
    const demoUser = await this.getUserByUsername("demo");
    
    // If demo user doesn't exist, create it
    if (!demoUser) {
      await this.createUser({
        username: "demo",
        password: "password"
      });
    }
  }
}

// Create storage instance
export const storage = new DatabaseStorage();

// Initialize storage (create default user if needed)
storage.initialize().catch(console.error);
