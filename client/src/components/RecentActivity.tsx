import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { usePoopContext } from "@/context/PoopContext";
import { format, differenceInDays } from "date-fns";
import { useTranslation } from "react-i18next";

export default function RecentActivity() {
  const { logs, achievements } = usePoopContext();
  const { t } = useTranslation();
  
  const formatRelativeDate = (date: Date) => {
    const days = differenceInDays(new Date(), date);
    if (days === 0) return t('today');
    if (days === 1) return t('yesterday');
    return `${days} ${t('streak').toLowerCase()}`;
  };
  
  // Combine logs and achievements and sort by date
  const activities = [
    ...logs.map(log => ({
      type: 'log',
      date: new Date(log.dateTime),
      data: log
    })),
    ...achievements.map(achievement => ({
      type: 'achievement',
      date: new Date(achievement.unlockedAt),
      data: achievement
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3);
  
  return (
    <div className="mx-4 my-6">
      <h2 className="text-xl font-bold text-secondary mb-3">{t('recent_activity')}</h2>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-200">
            {activities.map((activity, index) => (
              <li key={index} className="p-4 flex items-center">
                <div className="mr-4 text-2xl">
                  {activity.type === 'log' ? '💩' : '🏆'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {activity.type === 'log' 
                      ? `${formatRelativeDate(activity.date)}, ${format(activity.date, 'h:mm a')}`
                      : t('achievements_unlocked', { count: 1 })}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {activity.type === 'log'
                      ? `${t('duration')}: ${activity.data.duration} ${t('minutes')} • ${t('rating')}: ${activity.data.rating.charAt(0).toUpperCase() + activity.data.rating.slice(1)}`
                      : activity.data.description}
                  </p>
                </div>
                <ChevronRight className="text-gray-400" />
              </li>
            ))}
            
            {activities.length === 0 && (
              <li className="p-4 text-center text-gray-500">
                {t('loading')}
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
