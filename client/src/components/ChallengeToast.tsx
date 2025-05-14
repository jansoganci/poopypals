import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { UserChallengeData } from "@/lib/types";
import { usePoopContext } from "@/context/PoopContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useChallengeToast() {
  const { t } = useTranslation();
  const { stats, setStats } = usePoopContext();
  const [lastChallengeCount, setLastChallengeCount] = useState(0);
  const queryClient = useQueryClient();
  
  // Use React Query to get challenges and check for completions
  useQuery({
    queryKey: ['/api/user-challenges', 'toast-check'],
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
    select: (data: UserChallengeData[]) => {
      if (!Array.isArray(data)) return [];
      
      const completedChallenges = data.filter(c => c.isCompleted && c.completedAt);
      
      // If we have more completed challenges than before, show toast
      if (completedChallenges.length > lastChallengeCount && lastChallengeCount > 0) {
        // Find the newly completed challenges
        const newlyCompleted = completedChallenges.slice(0, completedChallenges.length - lastChallengeCount);
        
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
      return completedChallenges;
    },
  });
  
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