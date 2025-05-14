import { storage } from './storage';
import { type InsertChallenge } from '@shared/schema';

export const DEFAULT_CHALLENGES: InsertChallenge[] = [
  {
    title: 'Regular Morning',
    description: 'Log a poop between 6-9am for 3 days',
    rewardAmount: 50,
    type: 'daily',
    conditionType: 'consistentTime',
    conditionTarget: 3,
    conditionTimeframe: 7,
    isActive: true
  },
  {
    title: 'Consistency King',
    description: 'Log 5 consecutive days',
    rewardAmount: 100,
    type: 'streak',
    conditionType: 'streakReached',
    conditionTarget: 5,
    isActive: true
  },
  {
    title: 'Rating Collector',
    description: 'Log poops with all different ratings',
    rewardAmount: 75,
    type: 'achievement',
    conditionType: 'ratingAchieved',
    conditionTarget: 4, // number of different ratings
    conditionTimeframe: 14,
    isActive: true
  },
  {
    title: 'Weekend Warrior',
    description: 'Log a poop on both Saturday and Sunday',
    rewardAmount: 60,
    type: 'daily',
    conditionType: 'logCount',
    conditionTarget: 2,
    conditionTimeframe: 2,
    isActive: true
  },
  {
    title: 'Hydration Hero',
    description: 'Log 3 Type-4 consistency poops in a row',
    rewardAmount: 70,
    type: 'streak',
    conditionType: 'consistentType',
    conditionTarget: 3,
    conditionTimeframe: 7,
    isActive: true
  }
];

export async function initializeChallenges(): Promise<void> {
  try {
    // Get existing challenges
    const existingChallenges = await storage.getActiveGlobalChallenges();
    
    // If we already have challenges, no need to create defaults
    if (existingChallenges.length > 0) {
      console.log(`${existingChallenges.length} challenges already exist, skipping initialization`);
      return;
    }
    
    // Create default challenges
    for (const challenge of DEFAULT_CHALLENGES) {
      await storage.createChallenge(challenge);
    }
    
    console.log(`${DEFAULT_CHALLENGES.length} default challenges created`);
  } catch (error) {
    console.error('Failed to initialize challenges:', error);
  }
}

// Function to determine if a challenge should be assigned to a user
export async function shouldAssignChallenge(
  userId: number, 
  challengeType: string
): Promise<boolean> {
  // Get user's active challenges
  const activeChallenges = await storage.getUserActiveChallenges(userId);
  
  // Count how many challenges of this type the user already has
  const typeCount = activeChallenges.filter(
    uc => uc.challenge.type === challengeType
  ).length;
  
  // Limits by challenge type
  const limits: Record<string, number> = {
    'daily': 2,
    'streak': 1,
    'achievement': 2
  };
  
  // Check if user is under the limit for this type
  return typeCount < (limits[challengeType] || 1);
}

// Function to assign random challenges to a user
export async function assignRandomChallenges(userId: number): Promise<void> {
  try {
    // Get all available challenges
    const availableChallenges = await storage.getActiveGlobalChallenges();
    
    // Get user's active challenges to avoid duplicates
    const userActiveChallenges = await storage.getUserActiveChallenges(userId);
    const activeIds = userActiveChallenges.map(uc => uc.challengeId);
    
    // Filter out challenges user already has
    const newChallenges = availableChallenges.filter(
      challenge => !activeIds.includes(challenge.id)
    );
    
    // Group by type
    const byType: Record<string, typeof availableChallenges> = {
      'daily': [],
      'streak': [],
      'achievement': []
    };
    
    newChallenges.forEach(challenge => {
      if (byType[challenge.type]) {
        byType[challenge.type].push(challenge);
      }
    });
    
    // Assign challenges by type, respecting limits
    for (const type of Object.keys(byType)) {
      if (await shouldAssignChallenge(userId, type) && byType[type].length > 0) {
        // Randomly select a challenge of this type
        const randomIndex = Math.floor(Math.random() * byType[type].length);
        const selectedChallenge = byType[type][randomIndex];
        
        // Assign to user
        await storage.assignChallengeToUser(userId, selectedChallenge.id);
        console.log(`Assigned ${type} challenge to user ${userId}: ${selectedChallenge.title}`);
      }
    }
  } catch (error) {
    console.error('Failed to assign random challenges:', error);
  }
}

// Function to check and update progress of user's challenges
export async function checkChallengeProgress(userId: number): Promise<void> {
  try {
    // Get user's active challenges
    const userChallenges = await storage.getUserActiveChallenges(userId);
    
    // For each challenge, check if it's been completed
    for (const userChallenge of userChallenges) {
      const { id, progress, challenge } = userChallenge;
      let isCompleted = false;
      let newProgress = progress;
      
      // Get recent logs to evaluate challenges
      const recentLogs = await storage.getRecentPoopLogs(
        userId, 
        challenge.conditionTimeframe || 7
      );
      
      // Check progress based on challenge type
      switch (challenge.conditionType) {
        case 'logCount':
          // Simply count logs in the time period
          newProgress = recentLogs.length;
          isCompleted = newProgress >= challenge.conditionTarget;
          break;
          
        case 'consistentTime':
          // Count logs in a specific time range (morning: 6-9am)
          const morningLogs = recentLogs.filter(log => {
            const date = new Date(log.dateTime);
            const hour = date.getHours();
            return hour >= 6 && hour <= 9;
          });
          newProgress = morningLogs.length;
          isCompleted = newProgress >= challenge.conditionTarget;
          break;
          
        case 'ratingAchieved':
          // Count unique ratings
          const uniqueRatings = new Set(recentLogs.map(log => log.rating));
          newProgress = uniqueRatings.size;
          isCompleted = newProgress >= challenge.conditionTarget;
          break;
          
        case 'streakReached':
          // Checking consecutive days with logs
          // This is simplified; a real implementation would check actual day-by-day streak
          if (recentLogs.length >= challenge.conditionTarget) {
            const dates = recentLogs.map(log => {
              const date = new Date(log.dateTime);
              return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            });
            
            // Count unique dates
            const uniqueDates = new Set(dates);
            newProgress = uniqueDates.size;
            isCompleted = newProgress >= challenge.conditionTarget;
          }
          break;
      }
      
      // Update progress if changed
      if (newProgress !== progress) {
        await storage.updateUserChallengeProgress(id, newProgress);
      }
      
      // Complete challenge if target reached
      if (isCompleted) {
        await storage.completeUserChallenge(id);
        console.log(`User ${userId} completed challenge: ${challenge.title}`);
      }
    }
  } catch (error) {
    console.error('Failed to check challenge progress:', error);
  }
}