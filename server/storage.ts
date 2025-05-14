import { users, poopLogs, achievements, type User, type InsertUser, type PoopLog, type Achievement } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Poop log methods
  createPoopLog(log: any): Promise<PoopLog>;
  getPoopLogById(id: number): Promise<PoopLog | undefined>;
  getAllPoopLogs(): Promise<PoopLog[]>;
  
  // Achievement methods
  createAchievement(achievement: any): Promise<Achievement>;
  getAchievementById(id: number): Promise<Achievement | undefined>;
  getAllAchievements(): Promise<Achievement[]>;
  
  // Stats methods
  getUserStats(): Promise<any>;
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
