import { PoopLog, Achievement } from "@shared/schema";

// Local storage keys
const LOGS_KEY = 'poopy_pals_logs';
const ACHIEVEMENTS_KEY = 'poopy_pals_achievements';
const STATS_KEY = 'poopy_pals_stats';

// Default stats
const DEFAULT_STATS = {
  streak: 5,
  totalLogs: 12,
  flushFunds: 235,
  achievementCount: 3
};

// Types
export interface PoopLogData {
  id: number;
  dateTime: Date;
  duration: number;
  rating: string;
  consistency: number;
  notes: string;
}

export interface AchievementData {
  id: number;
  type: string;
  name: string;
  description: string;
  unlockedAt: Date;
}

export interface StatsData {
  streak: number;
  totalLogs: number;
  flushFunds: number;
  achievementCount: number;
}

// Save data to local storage
export const saveLogs = (logs: PoopLogData[]) => {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

export const saveAchievements = (achievements: AchievementData[]) => {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
};

export const saveStats = (stats: StatsData) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

// Load data from local storage
export const loadLogs = (): PoopLogData[] => {
  const data = localStorage.getItem(LOGS_KEY);
  if (!data) {
    // Initialize with sample data
    const sampleLogs = [
      {
        id: 1,
        dateTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        duration: 5,
        rating: 'excellent',
        consistency: 4,
        notes: ''
      },
      {
        id: 2,
        dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        duration: 7,
        rating: 'good',
        consistency: 3,
        notes: ''
      }
    ];
    saveLogs(sampleLogs);
    return sampleLogs;
  }
  
  try {
    const parsedData = JSON.parse(data);
    return parsedData.map((log: any) => ({
      ...log,
      dateTime: new Date(log.dateTime)
    }));
  } catch (e) {
    console.error('Error parsing logs', e);
    return [];
  }
};

export const loadAchievements = (): AchievementData[] => {
  const data = localStorage.getItem(ACHIEVEMENTS_KEY);
  if (!data) {
    // Initialize with sample data
    const sampleAchievements = [
      {
        id: 1,
        type: 'streak',
        name: 'Consistent Pooper',
        description: '5 day streak',
        unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        type: 'speed',
        name: 'Speed Demon',
        description: 'Completed in under 2 minutes',
        unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        type: 'count',
        name: 'Master Logger',
        description: 'Logged 10 times',
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];
    saveAchievements(sampleAchievements);
    return sampleAchievements;
  }
  
  try {
    const parsedData = JSON.parse(data);
    return parsedData.map((achievement: any) => ({
      ...achievement,
      unlockedAt: new Date(achievement.unlockedAt)
    }));
  } catch (e) {
    console.error('Error parsing achievements', e);
    return [];
  }
};

export const loadStats = (): StatsData => {
  const data = localStorage.getItem(STATS_KEY);
  if (!data) {
    // Initialize with default stats
    saveStats(DEFAULT_STATS);
    return DEFAULT_STATS;
  }
  
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing stats', e);
    return DEFAULT_STATS;
  }
};

// Add new log
export const addNewLog = (logData: Omit<PoopLogData, 'id'>): PoopLogData => {
  const logs = loadLogs();
  const stats = loadStats();
  
  // Generate new ID
  const newId = logs.length > 0 
    ? Math.max(...logs.map(log => log.id)) + 1 
    : 1;
  
  const newLog: PoopLogData = {
    id: newId,
    ...logData
  };
  
  // Update logs
  const updatedLogs = [newLog, ...logs];
  saveLogs(updatedLogs);
  
  // Update stats
  const updatedStats = {
    ...stats,
    totalLogs: stats.totalLogs + 1,
    flushFunds: stats.flushFunds + 5 // Earn 5 Flush Funds per log
  };
  saveStats(updatedStats);
  
  return newLog;
};

// Add new achievement
export const addNewAchievement = (achievementData: Omit<AchievementData, 'id'>): AchievementData => {
  const achievements = loadAchievements();
  const stats = loadStats();
  
  // Generate new ID
  const newId = achievements.length > 0 
    ? Math.max(...achievements.map(achievement => achievement.id)) + 1 
    : 1;
  
  const newAchievement: AchievementData = {
    id: newId,
    ...achievementData
  };
  
  // Update achievements
  const updatedAchievements = [newAchievement, ...achievements];
  saveAchievements(updatedAchievements);
  
  // Update stats
  const updatedStats = {
    ...stats,
    achievementCount: updatedAchievements.length,
    flushFunds: stats.flushFunds + 20 // Earn 20 Flush Funds per achievement
  };
  saveStats(updatedStats);
  
  return newAchievement;
};
