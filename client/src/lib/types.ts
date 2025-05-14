export interface ChallengeData {
  id: number;
  title: string;
  description: string;
  rewardAmount: number;
  type: 'daily' | 'streak' | 'achievement';
  conditionType: 'logCount' | 'consistentTime' | 'ratingAchieved' | 'streakReached';
  conditionTarget: number;
  conditionTimeframe?: number;
  isActive: boolean;
  createdAt: string;
}

export interface UserChallengeData {
  id: number;
  userId: number;
  challengeId: number;
  progress: number;
  isCompleted: boolean;
  assignedAt: string;
  completedAt?: string;
  challenge: ChallengeData;
}

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