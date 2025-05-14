import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Flame, Target, AlertCircle } from "lucide-react";
import { UserChallengeData } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export default function DailyChallenges() {
  const { t } = useTranslation();
  
  // Use React Query to fetch challenges
  const { data: challenges = [], isLoading, isError } = useQuery<UserChallengeData[]>({
    queryKey: ['/api/user-challenges'],
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  // Get icon based on challenge type
  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return <Target className="h-4 w-4" />;
      case 'streak':
        return <Flame className="h-4 w-4" />;
      case 'achievement':
        return <Award className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  // Get badge color based on challenge type
  const getChallengeBadgeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'streak':
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case 'achievement':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "";
    }
  };

  // Show empty state
  if (!isLoading && (challenges.length === 0 || isError)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('todays_challenges')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-col items-center justify-center p-4 text-center">
            {isError ? (
              <>
                <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">{t('challenge_fetch_error')}</p>
              </>
            ) : (
              <>
                <Target className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">{t('no_challenges')}</p>
                <p className="text-xs text-gray-400 mt-1">{t('log_to_get_challenges')}</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('todays_challenges')}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {getChallengeIcon(challenge.challenge.type)}
                    <span className="font-medium text-sm">{challenge.challenge.title}</span>
                  </div>
                  <Badge className={getChallengeBadgeColor(challenge.challenge.type)}>
                    {t(challenge.challenge.type === 'streak' ? 'streak_challenge' : challenge.challenge.type)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">{challenge.challenge.description}</div>
                  <div className="flex justify-between items-center text-xs">
                    <span>
                      {challenge.progress}/{challenge.challenge.conditionTarget}
                    </span>
                    <span className="flex items-center">
                      <Award className="h-3 w-3 mr-1 text-amber-500" />
                      {challenge.challenge.rewardAmount}
                    </span>
                  </div>
                  <Progress value={(challenge.progress / challenge.challenge.conditionTarget) * 100} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}