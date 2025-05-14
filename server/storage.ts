import { users, poopLogs, achievements, type User, type InsertUser, type PoopLog, type Achievement } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private logs: Map<number, PoopLog>;
  private achievements: Map<number, Achievement>;
  private userIdCounter: number;
  private logIdCounter: number;
  private achievementIdCounter: number;

  constructor() {
    this.users = new Map();
    this.logs = new Map();
    this.achievements = new Map();
    this.userIdCounter = 1;
    this.logIdCounter = 1;
    this.achievementIdCounter = 1;
    
    // Add a default user
    this.createUser({
      username: "demo",
      password: "password"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      streakCount: 5,
      totalLogs: 12,
      flushFunds: 235,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async createPoopLog(logData: any): Promise<PoopLog> {
    const id = this.logIdCounter++;
    const now = new Date();
    const log: PoopLog = {
      id,
      userId: 1, // Default to first user for demo
      dateTime: logData.dateTime ? new Date(logData.dateTime) : now,
      duration: logData.duration || 5,
      rating: logData.rating || 'excellent',
      consistency: logData.consistency || 4,
      notes: logData.notes || '',
      createdAt: now
    };
    
    this.logs.set(id, log);
    
    // Update user stats
    const user = await this.getUser(1);
    if (user) {
      user.totalLogs += 1;
      this.users.set(1, user);
    }
    
    return log;
  }
  
  async getPoopLogById(id: number): Promise<PoopLog | undefined> {
    return this.logs.get(id);
  }
  
  async getAllPoopLogs(): Promise<PoopLog[]> {
    return Array.from(this.logs.values()).sort((a, b) => 
      b.dateTime.getTime() - a.dateTime.getTime()
    );
  }
  
  async createAchievement(achievementData: any): Promise<Achievement> {
    const id = this.achievementIdCounter++;
    const now = new Date();
    const achievement: Achievement = {
      id,
      userId: 1, // Default to first user for demo
      type: achievementData.type || 'streak',
      name: achievementData.name || 'Consistent Pooper',
      description: achievementData.description || '5 day streak',
      unlockedAt: now
    };
    
    this.achievements.set(id, achievement);
    return achievement;
  }
  
  async getAchievementById(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }
  
  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).sort((a, b) => 
      b.unlockedAt.getTime() - a.unlockedAt.getTime()
    );
  }
  
  async getUserStats(): Promise<any> {
    const user = await this.getUser(1);
    const logs = await this.getAllPoopLogs();
    const achievements = await this.getAllAchievements();
    
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
      achievementCount: achievements.length
    };
  }
}

export const storage = new MemStorage();
