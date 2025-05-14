import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadLogs, loadAchievements, loadStats, addNewLog, addNewAchievement, PoopLogData, AchievementData, StatsData } from '@/lib/storage';

interface PoopContextType {
  logs: PoopLogData[];
  achievements: AchievementData[];
  stats: StatsData;
  setStats: (stats: StatsData) => void;
  addLog: (logData: Omit<PoopLogData, 'id'>) => void;
  addAchievement: (achievementData: Omit<AchievementData, 'id'>) => void;
}

const PoopContext = createContext<PoopContextType | undefined>(undefined);

export function PoopProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<PoopLogData[]>([]);
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    streak: 0,
    totalLogs: 0,
    flushFunds: 0,
    achievementCount: 0
  });
  
  // Load initial data from local storage
  useEffect(() => {
    const initialLogs = loadLogs();
    const initialAchievements = loadAchievements();
    const initialStats = loadStats();
    
    setLogs(initialLogs);
    setAchievements(initialAchievements);
    setStats(initialStats);
  }, []);
  
  // Add a new log
  const addLog = (logData: Omit<PoopLogData, 'id'>) => {
    const newLog = addNewLog(logData);
    setLogs([newLog, ...logs]);
    
    // Update stats
    setStats(prevStats => ({
      ...prevStats,
      totalLogs: prevStats.totalLogs + 1,
      flushFunds: prevStats.flushFunds + 5 // Earn 5 Flush Funds per log
    }));
    
    // Check for achievements
    checkForAchievements([newLog, ...logs]);
  };
  
  // Add a new achievement
  const addAchievement = (achievementData: Omit<AchievementData, 'id'>) => {
    const newAchievement = addNewAchievement(achievementData);
    setAchievements([newAchievement, ...achievements]);
    
    // Update stats
    setStats(prevStats => ({
      ...prevStats,
      achievementCount: prevStats.achievementCount + 1,
      flushFunds: prevStats.flushFunds + 20 // Earn 20 Flush Funds per achievement
    }));
  };
  
  // Check for new achievements after adding a log
  const checkForAchievements = (updatedLogs: PoopLogData[]) => {
    // Check for streak achievements
    const streakDays = checkStreak(updatedLogs);
    if (streakDays >= 5 && !hasAchievement('streak', 'Consistent Pooper')) {
      addAchievement({
        type: 'streak',
        name: 'Consistent Pooper',
        description: '5 day streak',
        unlockedAt: new Date()
      });
    }
    
    // Check for log count achievements
    if (updatedLogs.length >= 10 && !hasAchievement('count', 'Master Logger')) {
      addAchievement({
        type: 'count',
        name: 'Master Logger',
        description: 'Logged 10 times',
        unlockedAt: new Date()
      });
    }
    
    // Check for speed achievements
    const latestLog = updatedLogs[0];
    if (latestLog && latestLog.duration <= 2 && !hasAchievement('speed', 'Speed Demon')) {
      addAchievement({
        type: 'speed',
        name: 'Speed Demon',
        description: 'Completed in under 2 minutes',
        unlockedAt: new Date()
      });
    }
  };
  
  // Check if user has a specific achievement
  const hasAchievement = (type: string, name: string) => {
    return achievements.some(a => a.type === type && a.name === name);
  };
  
  // Calculate streak based on logs
  const checkStreak = (logs: PoopLogData[]) => {
    // For simplicity, we're using the mock streak value for now
    return stats.streak;
  };
  
  return (
    <PoopContext.Provider value={{
      logs,
      achievements,
      stats,
      addLog,
      addAchievement
    }}>
      {children}
    </PoopContext.Provider>
  );
}

export function usePoopContext() {
  const context = useContext(PoopContext);
  if (context === undefined) {
    throw new Error('usePoopContext must be used within a PoopProvider');
  }
  return context;
}
