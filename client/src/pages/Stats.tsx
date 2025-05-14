import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePoopContext } from "@/context/PoopContext";
import { AreaChart, BarChart, PieChart, LineChart, RadarChart } from "@/components/ui/recharts";
import { addDays, format, subDays, getDay, isWithinInterval, startOfDay, endOfDay, setHours, addWeeks, subWeeks } from "date-fns";
import { useTranslation } from "react-i18next";
import { Sparkles, Award, Calendar, Clock, ArrowUp, BarChart3, ActivitySquare, TrendingUp, Droplets, ThumbsUp, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Health tip component
const HealthTip = ({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) => (
  <motion.div 
    className="border rounded-lg p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-start space-x-3">
      <div className="bg-amber-100 dark:bg-amber-800 rounded-md p-2 text-amber-800 dark:text-amber-200">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-semibold text-amber-800 dark:text-amber-200">{title}</h3>
        <p className="text-sm text-amber-700 dark:text-amber-300">{description}</p>
      </div>
    </div>
  </motion.div>
);

// Stat card component with animation
const StatCard = ({ title, value, icon: Icon, trend, trendLabel, valueLabel, className }: { 
  title: string, 
  value: number | string, 
  icon: React.ElementType, 
  trend?: number, 
  trendLabel?: string,
  valueLabel?: string,
  className?: string
}) => (
  <motion.div 
    className={cn("rounded-lg border bg-card text-card-foreground shadow", className)}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
        {valueLabel && <span className="ml-1 text-xs text-muted-foreground">{valueLabel}</span>}
      </div>
      {trend !== undefined && (
        <div className="mt-2 flex items-center text-xs">
          <span className={cn(
            "flex items-center",
            trend > 0 ? "text-emerald-500" : trend < 0 ? "text-rose-500" : "text-gray-500"
          )}>
            {trend > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : null}
            {trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : "0%"}
          </span>
          {trendLabel && <span className="ml-1 text-muted-foreground">{trendLabel}</span>}
        </div>
      )}
    </div>
  </motion.div>
);

export default function Stats() {
  const { logs } = usePoopContext();
  const { t } = useTranslation();
  
  // Generate data for last 7 days with fancy animation
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const formattedDate = format(date, 'MMM d');
    const logsForDay = logs.filter(log => 
      format(new Date(log.dateTime), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    // Calculate average duration and consistency
    const avgDuration = logsForDay.length 
      ? logsForDay.reduce((sum, log) => sum + log.duration, 0) / logsForDay.length 
      : 0;
    
    const avgConsistency = logsForDay.length 
      ? logsForDay.reduce((sum, log) => sum + log.consistency, 0) / logsForDay.length 
      : 0;
    
    return {
      name: formattedDate,
      count: logsForDay.length,
      duration: Math.round(avgDuration * 10) / 10,
      consistency: Math.round(avgConsistency * 10) / 10
    };
  }).reverse();
  
  // Calculate time of day distribution
  const timeOfDayData = [
    { name: t('morning'), value: 0 },
    { name: t('afternoon'), value: 0 },
    { name: t('evening'), value: 0 },
    { name: t('night'), value: 0 }
  ];
  
  logs.forEach(log => {
    const hour = new Date(log.dateTime).getHours();
    if (hour >= 5 && hour < 12) {
      timeOfDayData[0].value += 1; // Morning
    } else if (hour >= 12 && hour < 17) {
      timeOfDayData[1].value += 1; // Afternoon
    } else if (hour >= 17 && hour < 22) {
      timeOfDayData[2].value += 1; // Evening
    } else {
      timeOfDayData[3].value += 1; // Night
    }
  });
  
  // Calculate day of week distribution
  const dayNames = [t('sunday'), t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday')];
  const dayOfWeekData = dayNames.map(day => ({ name: day, value: 0 }));
  
  logs.forEach(log => {
    const dayIndex = getDay(new Date(log.dateTime));
    dayOfWeekData[dayIndex].value += 1;
  });
  
  // Calculate rating percentages
  const ratingCounts = logs.reduce((acc: Record<string, number>, log) => {
    acc[log.rating] = (acc[log.rating] || 0) + 1;
    return acc;
  }, {});
  
  const ratingLabels: Record<string, string> = {
    excellent: t('excellent'),
    good: t('good'),
    okay: t('ok'),
    bad: t('bad')
  };
  
  const ratingData = Object.entries(ratingCounts).map(([rating, count]) => ({
    name: ratingLabels[rating] || rating,
    value: count
  }));
  
  // Calculate consistency data
  const consistencyCounts = logs.reduce((acc: Record<string, number>, log) => {
    acc[log.consistency] = (acc[log.consistency] || 0) + 1;
    return acc;
  }, {});
  
  const consistencyTypes: Record<string, string> = {
    1: t('very_hard'),
    2: t('hard'),
    3: t('normal'),
    4: t('soft'),
    5: t('very_soft')
  };
  
  const consistencyData = Object.entries(consistencyCounts).map(([value, count]) => ({
    name: consistencyTypes[value] || `${t('consistency')} ${value}`,
    value: count
  }));
  
  // Calculate trends for key metrics
  const calculateTrend = (metric: string) => {
    if (logs.length < 2) return 0;
    
    const thisWeek = logs.filter(log => 
      isWithinInterval(new Date(log.dateTime), {
        start: startOfDay(subDays(new Date(), 7)),
        end: endOfDay(new Date())
      })
    );
    
    const lastWeek = logs.filter(log => 
      isWithinInterval(new Date(log.dateTime), {
        start: startOfDay(subDays(new Date(), 14)),
        end: endOfDay(subDays(new Date(), 7))
      })
    );
    
    if (metric === 'count') {
      if (lastWeek.length === 0) return 100; // No logs last week, 100% increase
      return Math.round(((thisWeek.length - lastWeek.length) / lastWeek.length) * 100);
    }
    
    if (metric === 'duration') {
      const thisWeekAvg = thisWeek.length 
        ? thisWeek.reduce((sum, log) => sum + log.duration, 0) / thisWeek.length 
        : 0;
      const lastWeekAvg = lastWeek.length 
        ? lastWeek.reduce((sum, log) => sum + log.duration, 0) / lastWeek.length 
        : 0;
      
      if (lastWeekAvg === 0) return thisWeekAvg > 0 ? 100 : 0;
      return Math.round(((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100);
    }
    
    return 0;
  };
  
  // Calculate averages
  const calculateAverage = (property: string) => {
    if (logs.length === 0) return 0;
    if (property === 'duration') {
      return Math.round(logs.reduce((sum, log) => sum + log.duration, 0) / logs.length);
    }
    if (property === 'consistency') {
      return Math.round(logs.reduce((sum, log) => sum + log.consistency, 0) / logs.length * 10) / 10;
    }
    return 0;
  };
  
  // Get most frequent time
  const getMostFrequentTime = () => {
    if (logs.length === 0) return '—';
    
    const hours = logs.map(log => new Date(log.dateTime).getHours());
    const hourCounts: Record<number, number> = {};
    
    hours.forEach(hour => {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const mostFrequentHour = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    return format(setHours(new Date(), parseInt(mostFrequentHour)), 'h a');
  };
  
  // Generate health insights based on data
  const getHealthInsights = () => {
    const insights = [];
    
    // Check consistency patterns
    const avgConsistency = calculateAverage('consistency');
    if (avgConsistency < 2) {
      insights.push({
        title: t('low_consistency_title'),
        description: t('low_consistency_tip'),
        icon: Droplets
      });
    } else if (avgConsistency > 4) {
      insights.push({
        title: t('high_consistency_title'),
        description: t('high_consistency_tip'),
        icon: Droplets
      });
    }
    
    // Check duration patterns
    const avgDuration = calculateAverage('duration');
    if (avgDuration > 10) {
      insights.push({
        title: t('long_duration_title'),
        description: t('long_duration_tip'),
        icon: Clock
      });
    }
    
    // Check frequency patterns
    const countTrend = calculateTrend('count');
    if (countTrend < -20) {
      insights.push({
        title: t('decreasing_frequency_title'),
        description: t('decreasing_frequency_tip'),
        icon: TrendingUp
      });
    }
    
    // Default insight if none apply
    if (insights.length === 0) {
      insights.push({
        title: t('healthy_pattern_title'),
        description: t('healthy_pattern_description'),
        icon: Heart
      });
    }
    
    return insights;
  };
  
  const insights = getHealthInsights();
  
  return (
    <div className="p-4 pb-20">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-2xl font-bold text-secondary">{t('statistics')}</h1>
        <p className="text-sm text-muted-foreground">{t('stats_description')}</p>
      </div>
      
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard 
          title={t('total_logs')} 
          value={logs.length} 
          icon={BarChart3}
          trend={calculateTrend('count')}
          trendLabel={t('vs_last_week')}
        />
        <StatCard 
          title={t('avg_duration')} 
          value={calculateAverage('duration')} 
          valueLabel={t('minutes').toLowerCase()}
          icon={Clock}
          trend={calculateTrend('duration')}
          trendLabel={t('vs_last_week')}
        />
        <StatCard 
          title={t('most_frequent_time')} 
          value={getMostFrequentTime()} 
          icon={Calendar}
        />
        <StatCard 
          title={t('avg_consistency')} 
          value={calculateAverage('consistency')} 
          icon={ActivitySquare}
          valueLabel={`/ 5`}
        />
      </div>
      
      {/* Health Insights */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
            <CardTitle>{t('health_insights')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <HealthTip 
                key={i}
                title={insight.title}
                description={insight.description}
                icon={insight.icon}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Charts */}
      <Tabs defaultValue="frequency" className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="frequency">{t('frequency')}</TabsTrigger>
          <TabsTrigger value="distribution">{t('distribution')}</TabsTrigger>
          <TabsTrigger value="ratings">{t('rating')}</TabsTrigger>
          <TabsTrigger value="consistency">{t('consistency')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="frequency">
          <Card>
            <CardHeader>
              <CardTitle>{t('weekly_overview')}</CardTitle>
              <CardDescription>{t('frequency_chart_description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <AreaChart 
                  data={last7Days}
                  index="name"
                  categories={["count"]}
                  valueFormatter={(value) => `${value} ${t('logs').toLowerCase()}`}
                  showAnimation
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-muted-foreground">
              <div>{t('last_7_days')}</div>
              <Badge variant="outline">{logs.length} {t('total_logs')}</Badge>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('time_of_day')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <PieChart 
                    data={timeOfDayData}
                    category="value"
                    index="name"
                    valueFormatter={(value) => `${value} ${t('logs').toLowerCase()}`}
                    showAnimation
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('day_of_week')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <BarChart 
                    data={dayOfWeekData}
                    index="name"
                    categories={["value"]}
                    valueFormatter={(value) => `${value} ${t('logs').toLowerCase()}`}
                    showAnimation
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>{t('rating_distribution')}</CardTitle>
              <CardDescription>{t('rating_chart_description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <PieChart 
                  data={ratingData}
                  category="value"
                  index="name"
                  valueFormatter={(value) => `${value} ${t('logs').toLowerCase()}`}
                  showAnimation
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="consistency">
          <Card>
            <CardHeader>
              <CardTitle>{t('consistency_chart')}</CardTitle>
              <CardDescription>{t('consistency_chart_description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart 
                  data={consistencyData}
                  index="name"
                  categories={["value"]}
                  valueFormatter={(value) => `${value} ${t('logs').toLowerCase()}`}
                  showAnimation
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Trends Over Time */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-primary mr-2" />
            <CardTitle>{t('trends_over_time')}</CardTitle>
          </div>
          <CardDescription>{t('trends_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <LineChart 
              data={last7Days}
              index="name"
              categories={["duration", "consistency"]}
              valueFormatter={(value) => `${value}`}
              showAnimation
            />
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          {t('trends_footer')}
        </CardFooter>
      </Card>
    </div>
  );
}
