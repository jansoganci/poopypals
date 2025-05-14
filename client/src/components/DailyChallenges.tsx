import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { UserChallengeData } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { usePoopContext } from "@/context/PoopContext";

// Icon mapping for challenge types
const challengeIcons: Record<string, React.ReactNode> = {
  'daily': <Target className="h-5 w-5 text-amber-500" />,
  'streak': <Trophy className="h-5 w-5 text-amber-500" />,
  'achievement': <Award className="h-5 w-5 text-amber-500" />
};

export default function DailyChallenges() {
  const { t } = useTranslation();
  const [challenges, setChallenges] = useState<UserChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const { stats } = usePoopContext();

  // Fetch user challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('/api/user-challenges', 'GET');
        // Ensure the response is an array, or default to empty array
        const data = Array.isArray(response) ? response : [];
        setChallenges(data as UserChallengeData[]);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        toast({
          title: t('error'),
          description: t('challenge_fetch_error'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [t, stats.totalLogs]); // Re-fetch when logs count changes

  // Format the challenge type badge
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'daily': t('daily'),
      'streak': t('streak'),
      'achievement': t('achievement')
    };
    return labels[type] || type;
  };

  // Return a loading state while fetching challenges
  if (loading) {
    return (
      <Card className="border-amber-200 shadow-md">
        <CardHeader>
          <CardTitle>{t('todays_challenges')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-16 bg-gray-200 rounded-md"></div>
            <div className="h-16 bg-gray-200 rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no challenges are assigned yet
  if (challenges.length === 0) {
    return (
      <Card className="border-amber-200 shadow-md">
        <CardHeader>
          <CardTitle>{t('todays_challenges')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-500">{t('no_challenges')}</p>
            <p className="text-sm text-gray-400 mt-2">{t('log_to_get_challenges')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 shadow-md">
      <CardHeader>
        <CardTitle>{t('todays_challenges')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id} 
              className="border rounded-lg p-3 transition-all hover:border-amber-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {challengeIcons[challenge.challenge.type] || <Target className="h-5 w-5 text-amber-500" />}
                  <span className="font-medium">{challenge.challenge.title}</span>
                </div>
                <div>
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                    {getTypeLabel(challenge.challenge.type)}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{challenge.challenge.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="w-full mr-4">
                  <Progress 
                    value={(challenge.progress / challenge.challenge.conditionTarget) * 100} 
                    className="h-2 bg-gray-100"
                  />
                </div>
                <div className="flex items-center whitespace-nowrap">
                  <span className="font-semibold">{challenge.progress}/{challenge.challenge.conditionTarget}</span>
                  <span className="ml-1 text-amber-800">+{challenge.challenge.rewardAmount} FF</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}