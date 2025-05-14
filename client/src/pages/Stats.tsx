import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePoopContext } from "@/context/PoopContext";
import { BarChart, PieChart, RadarChart } from "@/components/ui/recharts";
import { addDays, format, subDays, getDay, isWithinInterval, startOfDay, endOfDay, setHours, addWeeks, subWeeks } from "date-fns";
import { useTranslation } from "react-i18next";
import { Sparkles, Award, Calendar, Clock, ArrowUp, BarChart3, ActivitySquare, TrendingUp, Droplets, ThumbsUp, Heart, LineChart } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart as RechartsAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from "recharts";

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
  const [, navigate] = useLocation();
  
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-secondary">{t('statistics')}</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/analytics')}
            className="text-xs"
          >
            <LineChart className="w-4 h-4 mr-1" /> {t('advanced_analytics')}
          </Button>
        </div>
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
          <Card className="overflow-hidden border-2 border-amber-100 dark:border-amber-900/30">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-amber-500 mr-2" />
                <CardTitle>{t('weekly_overview')}</CardTitle>
              </div>
              <CardDescription>{t('frequency_chart_description')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsAreaChart
                      data={last7Days}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--amber-500)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="var(--amber-500)" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--amber-200)" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: 'var(--amber-700)', fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: 'var(--amber-200)' }}
                      />
                      <YAxis 
                        tick={{ fill: 'var(--amber-700)', fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: 'var(--amber-200)' }}
                        tickFormatter={(value: number) => `${value}`}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'var(--amber-50)', 
                          borderColor: 'var(--amber-200)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                        labelStyle={{ color: 'var(--amber-900)', fontWeight: 'bold' }}
                        itemStyle={{ color: 'var(--amber-700)' }}
                        formatter={(value: number) => [`${value} ${t('logs').toLowerCase()}`, 'Logs']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="var(--amber-500)" 
                        fillOpacity={1}
                        fill="url(#colorCount)"
                        strokeWidth={3}
                        activeDot={{ r: 8, strokeWidth: 0, fill: 'var(--amber-600)' }}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                      />
                    </RechartsAreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
              
              {/* Summary stats below chart */}
              <motion.div 
                className="grid grid-cols-3 gap-4 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-amber-700 dark:text-amber-300">{t('avg_per_day')}</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-200">
                    {logs.length ? (logs.length / 7).toFixed(1) : '0'}
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-amber-700 dark:text-amber-300">{t('most_active_day')}</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-200">
                    {last7Days.sort((a, b) => b.count - a.count)[0]?.name || '—'}
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-amber-700 dark:text-amber-300">{t('total_this_week')}</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-200">
                    {last7Days.reduce((sum, day) => sum + day.count, 0)}
                  </p>
                </div>
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-muted-foreground bg-amber-50/50 dark:bg-amber-900/10 py-3">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1 text-amber-500" />
                {t('last_7_days')}
              </div>
              <Badge variant="outline" className="bg-amber-100/50 dark:bg-amber-800/30 border-amber-200 dark:border-amber-700">
                {logs.length} {t('total_logs')}
              </Badge>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="overflow-hidden border-2 border-purple-100 dark:border-purple-900/30">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-purple-500 mr-2" />
                  <CardTitle>{t('time_of_day')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="h-full"
                  >
                    <PieChart 
                      data={timeOfDayData}
                      category="value"
                      index="name"
                      valueFormatter={(value) => `${value} ${t('logs').toLowerCase()}`}
                      showAnimation
                    />
                  </motion.div>
                </div>
              </CardContent>
              <CardFooter className="bg-purple-50/50 dark:bg-purple-900/10 text-xs text-center text-purple-700 dark:text-purple-300">
                <div className="w-full">
                  {timeOfDayData.reduce((max, item) => item.value > max.value ? item : max, {name: '', value: 0}).name !== '' && 
                    <>Most active time: <Badge variant="outline" className="ml-1 bg-purple-100 dark:bg-purple-800 border-purple-200">
                      {timeOfDayData.reduce((max, item) => item.value > max.value ? item : max, {name: '', value: 0}).name}
                    </Badge></>
                  }
                </div>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/30">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-emerald-500 mr-2" />
                  <CardTitle>{t('day_of_week')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="h-full"
                  >
                    <BarChart 
                      data={dayOfWeekData}
                      index="name"
                      categories={["value"]}
                      valueFormatter={(value) => `${value} ${t('logs').toLowerCase()}`}
                      showAnimation
                    />
                  </motion.div>
                </div>
              </CardContent>
              <CardFooter className="bg-emerald-50/50 dark:bg-emerald-900/10 text-xs text-center text-emerald-700 dark:text-emerald-300">
                <div className="w-full">
                  {dayOfWeekData.reduce((max, item) => item.value > max.value ? item : max, {name: '', value: 0}).name !== '' &&
                    <>Most active day: <Badge variant="outline" className="ml-1 bg-emerald-100 dark:bg-emerald-800 border-emerald-200">
                      {dayOfWeekData.reduce((max, item) => item.value > max.value ? item : max, {name: '', value: 0}).name}
                    </Badge></>
                  }
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ratings">
          <Card className="overflow-hidden border-2 border-blue-100 dark:border-blue-900/30">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10">
              <div className="flex items-center">
                <ThumbsUp className="h-5 w-5 text-blue-500 mr-2" />
                <CardTitle>{t('rating_distribution')}</CardTitle>
              </div>
              <CardDescription>{t('rating_chart_description')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-full"
                >
                  <PieChart 
                    data={ratingData}
                    category="value"
                    index="name"
                    valueFormatter={(value) => `${value} ${t('logs').toLowerCase()}`}
                    showAnimation
                  />
                </motion.div>
              </div>
            </CardContent>
            <CardFooter className="bg-blue-50/50 dark:bg-blue-900/10 py-3">
              <div className="w-full grid grid-cols-2 gap-2">
                <div className="text-center">
                  <p className="text-xs text-blue-700 dark:text-blue-300">{t('most_common')}</p>
                  {ratingData.length > 0 && (
                    <Badge variant="outline" className="bg-blue-100 dark:bg-blue-800 border-blue-200">
                      {ratingData.reduce((max, item) => item.value > max.value ? item : max, {name: '', value: 0}).name}
                    </Badge>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs text-blue-700 dark:text-blue-300">{t('satisfaction_rate')}</p>
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-800 border-blue-200">
                    {logs.length ? Math.round((logs.filter(log => log.rating === 'good' || log.rating === 'excellent').length / logs.length) * 100) : 0}%
                  </Badge>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="consistency">
          <Card className="overflow-hidden border-2 border-pink-100 dark:border-pink-900/30">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10">
              <div className="flex items-center">
                <ActivitySquare className="h-5 w-5 text-pink-500 mr-2" />
                <CardTitle>{t('consistency_chart')}</CardTitle>
              </div>
              <CardDescription>{t('consistency_chart_description')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-full"
                >
                  <BarChart 
                    data={consistencyData}
                    index="name"
                    categories={["value"]}
                    valueFormatter={(value) => `${value} ${t('logs').toLowerCase()}`}
                    showAnimation
                  />
                </motion.div>
              </div>
            </CardContent>
            <CardFooter className="bg-pink-50/50 dark:bg-pink-900/10 py-3">
              <div className="w-full grid grid-cols-3 gap-1">
                <div className="text-center">
                  <p className="text-xs text-pink-700 dark:text-pink-300 mb-1">{t('normal_rate')}</p>
                  <Badge variant="outline" className="bg-pink-100 dark:bg-pink-800 border-pink-200">
                    {logs.length ? Math.round((logs.filter(log => log.consistency === 3).length / logs.length) * 100) : 0}%
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-xs text-pink-700 dark:text-pink-300 mb-1">{t('most_common')}</p>
                  {consistencyData.length > 0 && (
                    <Badge variant="outline" className="bg-pink-100 dark:bg-pink-800 border-pink-200">
                      {consistencyData.reduce((max, item) => item.value > max.value ? item : max, {name: '', value: 0}).name}
                    </Badge>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs text-pink-700 dark:text-pink-300 mb-1">{t('avg_score')}</p>
                  <Badge variant="outline" className="bg-pink-100 dark:bg-pink-800 border-pink-200">
                    {calculateAverage('consistency')}
                  </Badge>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Trends Over Time */}
      <Card className="overflow-hidden border-2 border-orange-100 dark:border-orange-900/30 mb-20">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
            <CardTitle>{t('trends_over_time')}</CardTitle>
          </div>
          <CardDescription>{t('trends_description')}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={last7Days}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--orange-500)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--orange-500)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorConsistency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--blue-500)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--blue-500)" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--orange-200)" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'var(--orange-700)', fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--orange-200)' }}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--orange-700)', fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--orange-200)' }}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--orange-50)', 
                      borderColor: 'var(--orange-200)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    labelStyle={{ color: 'var(--orange-900)', fontWeight: 'bold' }}
                    itemStyle={{ color: 'var(--orange-700)' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: 10 }}
                    iconSize={10}
                    iconType="circle"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="duration" 
                    name={t('duration')}
                    stroke="var(--orange-500)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--orange-500)', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: 'var(--orange-600)' }}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="consistency" 
                    name={t('consistency')}
                    stroke="var(--blue-500)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--blue-500)', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: 'var(--blue-600)' }}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    animationBegin={300}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
          
          {/* Pattern insights */}
          <motion.div 
            className="mt-6 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 dark:bg-orange-800 rounded-md p-2 text-orange-800 dark:text-orange-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800 dark:text-orange-200">{t('pattern_insight')}</h3>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  {logs.length > 3 
                    ? t('pattern_insight_description') 
                    : t('pattern_insight_need_more_data')}
                </p>
                
                {/* Correlation badges */}
                {logs.length > 3 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-orange-100 dark:bg-orange-800 border-orange-200">
                      {t('duration_consistency_correlation')}
                    </Badge>
                    {calculateTrend('count') > 10 && (
                      <Badge variant="outline" className="bg-orange-100 dark:bg-orange-800 border-orange-200">
                        {t('improving_frequency')}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </CardContent>
        <CardFooter className="bg-orange-50/50 dark:bg-orange-900/10 py-3 text-xs text-muted-foreground">
          {t('trends_footer')}
        </CardFooter>
      </Card>
    </div>
  );
}
