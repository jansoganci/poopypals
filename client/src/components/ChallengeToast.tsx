import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { UserChallengeData } from "@/lib/types";
import { usePoopContext } from "@/context/PoopContext";
import { useQueryClient, useQuery } from "@tanstack/react-query";

export function useChallengeToast() {
  const { t } = useTranslation();
  const { stats, setStats } = usePoopContext();
  const [lastChallengeCount, setLastChallengeCount] = useState(0);
  const queryClient = useQueryClient();
  
  // Get the challenge data from the cache without making a new query
  const { data: challenges } = useQuery<UserChallengeData[]>({
    queryKey: ['/api/user-challenges', 'toast-check'],
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
    // Disable automatic queries, we'll handle this manually
    enabled: false,
  });
  
  // Effect to check for completed challenges when challenges data changes
  useEffect(() => {
    if (!challenges || !Array.isArray(challenges)) return;
    
    const completedChallenges = challenges.filter(c => c.isCompleted && c.completedAt);
    
    // If we have more completed challenges than before, show toast
    if (completedChallenges.length > lastChallengeCount && lastChallengeCount > 0) {
      // Find the newly completed challenges (be cautious with the slice index calculation)
      const newCount = completedChallenges.length - lastChallengeCount;
      const newlyCompleted = completedChallenges.slice(0, newCount);
      
      // Show toast for each newly completed challenge
      newlyCompleted.forEach((challenge: UserChallengeData) => {
        showChallengeCompletedToast(challenge);
        
        // Update stats (add reward)
        if (stats) {
          setStats({
            ...stats,
            flushFunds: stats.flushFunds + challenge.challenge.rewardAmount
          });
        }
      });
    }
    
    // Update the counter
    setLastChallengeCount(completedChallenges.length);
  }, [challenges, lastChallengeCount, stats, setStats, t]);
  
  const showChallengeCompletedToast = (challenge: UserChallengeData) => {
    toast({
      title: t('challenge_completed'),
      description: `${challenge.challenge.title} (+${challenge.challenge.rewardAmount} ${t('flush_funds')})`,
      variant: "default",
      duration: 5000,
    });
  };
  
  // Function to manually check for completed challenges - use this sparingly
  const checkForCompletedChallenges = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/user-challenges', 'toast-check'] });
  };
  
  return { checkForCompletedChallenges };
}