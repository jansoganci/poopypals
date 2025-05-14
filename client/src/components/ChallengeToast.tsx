import { useState, useEffect } from "react";
import { CheckCircle2, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { UserChallengeData } from "@/lib/types";
import { usePoopContext } from "@/context/PoopContext";

export function useChallengeToast() {
  const { t } = useTranslation();
  const { stats, setStats } = usePoopContext();
  const [lastChallengeCount, setLastChallengeCount] = useState(0);
  
  const checkForCompletedChallenges = async () => {
    try {
      // Fetch completed challenges
      const response = await fetch('/api/user-challenges');
      if (!response.ok) return;
      
      const data = await response.json();
      const completedChallenges = data.filter((c: UserChallengeData) => 
        c.isCompleted && c.completedAt
      );
      
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
    } catch (error) {
      console.error('Error checking for completed challenges:', error);
    }
  };
  
  const showChallengeCompletedToast = (challenge: UserChallengeData) => {
    toast({
      title: t('challenge_completed'),
      description: `${challenge.challenge.title} (+${challenge.challenge.rewardAmount} ${t('flush_funds')})`,
      variant: "default",
      duration: 5000,
    });
  };
  
  return { checkForCompletedChallenges };
}