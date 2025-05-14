import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePoopContext } from "@/context/PoopContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { format, subDays, differenceInDays, isWithinInterval, startOfDay, endOfDay, formatDistanceToNow, parseISO } from "date-fns";
import {
  Calendar, 
  Clock, 
  BarChart4, 
  LineChart, 
  Activity, 
  AlertCircle, 
  Calendar as CalendarIcon,
  Check, 
  ChevronDown, 
  Grid3X3, 
  ListFilter, 
  Moon, 
  Sun, 
  Sunrise, 
  Sunset, 
  TrendingDown, 
  TrendingUp, 
  Droplets,
  ArrowDownUp,
  Timer,
  Zap,
  Heart,
  Info
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Scatter,
  ScatterChart,
  ComposedChart,
  BarChart as RechartsBarChart,
  Bar
} from "recharts";

// Insight Card Component
const InsightCard = ({ 
  title, 
  description, 
  icon: Icon, 
  variant = "default",
  action,
  actionText
}: { 
  title: string, 
  description: string, 
  icon: React.ElementType, 
  variant?: "default" | "warning" | "success" | "info",
  action?: (() => void) | undefined,
  actionText?: string | undefined
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return {
          bg: "bg-orange-50 dark:bg-orange-900/20",
          border: "border-orange-200 dark:border-orange-800",
          icon: "bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-300",
          title: "text-orange-800 dark:text-orange-300",
          description: "text-orange-700 dark:text-orange-400",
          button: "bg-orange-100 hover:bg-orange-200 text-orange-700"
        };
      case "success":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-900/20",
          border: "border-emerald-200 dark:border-emerald-800",
          icon: "bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300",
          title: "text-emerald-800 dark:text-emerald-300",
          description: "text-emerald-700 dark:text-emerald-400",
          button: "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
        };
      case "info":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          icon: "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300",
          title: "text-blue-800 dark:text-blue-300",
          description: "text-blue-700 dark:text-blue-400",
          button: "bg-blue-100 hover:bg-blue-200 text-blue-700"
        };
      default:
        return {
          bg: "bg-amber-50 dark:bg-amber-900/20",
          border: "border-amber-200 dark:border-amber-800",
          icon: "bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300",
          title: "text-amber-800 dark:text-amber-300",
          description: "text-amber-700 dark:text-amber-400",
          button: "bg-amber-100 hover:bg-amber-200 text-amber-700"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div 
      className={cn("rounded-lg p-4 border", styles.bg, styles.border)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start gap-4">
        <div className={cn("rounded-full p-2", styles.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className={cn("font-semibold text-base", styles.title)}>{title}</h3>
          <p className={cn("text-sm mt-1", styles.description)}>{description}</p>
          
          {action && actionText && (
            <Button 
              onClick={action} 
              variant="outline" 
              size="sm" 
              className={cn("mt-3", styles.button)}
            >
              {actionText}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Analytics Metric Card
const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend,
  subtitle,
  color = "amber"
}: { 
  title: string, 
  value: string | number, 
  change?: number, 
  icon: React.ElementType,
  trend?: "up" | "down" | "neutral",
  subtitle?: string,
  color?: "amber" | "blue" | "emerald" | "purple" | "orange"
}) => {
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-rose-500" />;
    return null;
  };

  const getChangeColor = () => {
    if (!change) return "text-gray-500";
    return change > 0 ? "text-emerald-500" : change < 0 ? "text-rose-500" : "text-gray-500";
  };

  const getIconClass = () => {
    switch (color) {
      case "blue": return "text-blue-500";
      case "emerald": return "text-emerald-500";
      case "purple": return "text-purple-500";
      case "orange": return "text-orange-500";
      default: return "text-amber-500";
    }
  };

  const getBgClass = () => {
    switch (color) {
      case "blue": return "bg-blue-100 dark:bg-blue-900/20";
      case "emerald": return "bg-emerald-100 dark:bg-emerald-900/20";
      case "purple": return "bg-purple-100 dark:bg-purple-900/20";
      case "orange": return "bg-orange-100 dark:bg-orange-900/20";
      default: return "bg-amber-100 dark:bg-amber-900/20";
    }
  };

  return (
    <motion.div
      className="rounded-lg border bg-card overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-full", getBgClass())}>
            <Icon className={cn("w-5 h-5", getIconClass())} />
          </div>
          <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
        </div>
        {(change !== undefined || trend) && (
          <div className={cn("flex items-center gap-1 mt-2 text-xs", getChangeColor())}>
            {getTrendIcon()}
            {change !== undefined && (
              <span>
                {change > 0 ? "+" : ""}{change}%
                {trend === undefined && <span className="text-muted-foreground ml-1">vs last period</span>}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Time Distribution Component
const TimeDistribution = ({ logs }: { logs: any[] }) => {
  const { t } = useTranslation();
  
  // Process time distribution data
  const timeData = [
    { name: t('morning'), value: 0, time: '5-12', icon: Sunrise },
    { name: t('afternoon'), value: 0, time: '12-17', icon: Sun },
    { name: t('evening'), value: 0, time: '17-22', icon: Sunset },
    { name: t('night'), value: 0, time: '22-5', icon: Moon },
  ];
  
  logs.forEach(log => {
    const hour = new Date(log.dateTime).getHours();
    if (hour >= 5 && hour < 12) {
      timeData[0].value += 1; // Morning
    } else if (hour >= 12 && hour < 17) {
      timeData[1].value += 1; // Afternoon
    } else if (hour >= 17 && hour < 22) {
      timeData[2].value += 1; // Evening
    } else {
      timeData[3].value += 1; // Night
    }
  });
  
  const total = timeData.reduce((sum, item) => sum + item.value, 0);
  const COLORS = ['var(--amber-500)', 'var(--orange-500)', 'var(--purple-500)', 'var(--blue-500)'];
  const formatPercent = (value: number) => `${((value / total) * 100).toFixed(0)}%`;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-amber-500 mr-2" />
          <CardTitle>{t('time_distribution')}</CardTitle>
        </div>
        <CardDescription>{t('when_you_usually_go')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={timeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return percent > 0 ? (
                      <text 
                        x={x} 
                        y={y} 
                        fill="#888888" 
                        textAnchor={x > cx ? 'start' : 'end'} 
                        dominantBaseline="central"
                        fontSize={12}
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    ) : null;
                  }}
                >
                  {timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} ${t('logs')}`, '']}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-3">
            {timeData.map((item, index) => (
              <motion.div 
                key={index}
                className="border rounded-lg p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] + '20' }}>
                    <item.icon className="w-4 h-4" style={{ color: COLORS[index % COLORS.length] }} />
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{item.value}</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{total > 0 ? formatPercent(item.value) : '0%'} of total</div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Consistency Patterns Component
const ConsistencyPatterns = ({ logs }: { logs: any[] }) => {
  const { t } = useTranslation();
  
  // Process consistency data
  const consistencyLabels: Record<number, string> = {
    1: t('very_hard'),
    2: t('hard'),
    3: t('normal'),
    4: t('soft'),
    5: t('very_soft')
  };
  
  // Count by consistency type
  const consistencyCounts: Record<number, number> = {};
  logs.forEach(log => {
    consistencyCounts[log.consistency] = (consistencyCounts[log.consistency] || 0) + 1;
  });
  
  // Prepare data for charts
  const radarData = [
    { subject: t('very_hard'), A: 0, fullMark: logs.length },
    { subject: t('hard'), A: 0, fullMark: logs.length },
    { subject: t('normal'), A: 0, fullMark: logs.length },
    { subject: t('soft'), A: 0, fullMark: logs.length },
    { subject: t('very_soft'), A: 0, fullMark: logs.length },
  ];
  
  for (const [key, value] of Object.entries(consistencyCounts)) {
    const index = parseInt(key) - 1;
    if (index >= 0 && index < radarData.length) {
      radarData[index].A = value;
    }
  }
  
  // Find the most common consistency
  const mostCommon = Object.entries(consistencyCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || "3";
  
  // Calculate consistency change over time
  const last5Logs = [...logs].sort((a, b) => 
    new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  ).slice(0, 5);
  
  // Prepare trend data
  const trendData = last5Logs.map((log, index) => ({
    name: `Log ${last5Logs.length - index}`,
    value: log.consistency,
    date: format(new Date(log.dateTime), 'MMM d'),
  })).reverse();
  
  // Is consistency stable?
  const isStable = last5Logs.length >= 3 && 
    last5Logs.slice(0, 3).every(log => log.consistency === last5Logs[0].consistency);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Activity className="w-5 h-5 text-blue-500 mr-2" />
          <CardTitle>{t('consistency_patterns')}</CardTitle>
        </div>
        <CardDescription>{t('consistency_patterns_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsRadarChart outerRadius={80} data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--foreground)', fontSize: 12 }} />
                <PolarRadiusAxis />
                <Radar
                  name={t('frequency')}
                  dataKey="A"
                  stroke="var(--blue-500)"
                  fill="var(--blue-500)"
                  fillOpacity={0.4}
                />
                <Tooltip
                  formatter={(value) => [`${value} ${t('logs')}`, t('frequency')]}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                  }}
                />
              </RechartsRadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t('most_common_consistency')}
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {consistencyLabels[parseInt(mostCommon)]}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('type')} {mostCommon} - {((consistencyCounts[parseInt(mostCommon)] || 0) / logs.length * 100).toFixed(0)}% {t('of_logs')}
                  </div>
                </div>
              </div>
            </div>
            
            {trendData.length > 1 && (
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {t('recent_consistency_trend')}
                </h3>
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={trendData}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="var(--blue-500)" 
                        strokeWidth={2}
                        dot={{ fill: 'var(--blue-500)', r: 4 }}
                      />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        formatter={(value) => [
                          consistencyLabels[value as number], 
                          t('consistency')
                        ]}
                        contentStyle={{
                          backgroundColor: 'var(--background)',
                          borderColor: 'var(--border)',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {isStable ? (
                    <span className="flex items-center gap-1 text-emerald-500">
                      <Check className="w-3 h-3" /> {t('consistency_is_stable')}
                    </span>
                  ) : (
                    <span>{t('consistency_varies')}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Duration Analysis Component
const DurationAnalysis = ({ logs }: { logs: any[] }) => {
  const { t } = useTranslation();
  
  // Process duration data
  const avgDuration = logs.length > 0
    ? Math.round(logs.reduce((sum, log) => sum + log.duration, 0) / logs.length)
    : 0;
  
  // Group durations into ranges
  const durationRanges = [
    { name: '< 5 min', range: [0, 5], count: 0 },
    { name: '5-10 min', range: [5, 10], count: 0 },
    { name: '10-15 min', range: [10, 15], count: 0 },
    { name: '15-20 min', range: [15, 20], count: 0 },
    { name: '> 20 min', range: [20, Infinity], count: 0 },
  ];
  
  logs.forEach(log => {
    const duration = log.duration;
    const range = durationRanges.find(r => 
      duration >= r.range[0] && duration < r.range[1]
    );
    if (range) range.count++;
  });
  
  // Find most common duration range
  const mostCommonRange = [...durationRanges].sort((a, b) => b.count - a.count)[0];
  
  // Check if durations are changing over time
  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
    .slice(0, 10);
    
  const durationChange = recentLogs.length >= 5
    ? Math.round(((recentLogs.slice(0, 5).reduce((sum, log) => sum + log.duration, 0) / 5) /
        (recentLogs.slice(5, 10).reduce((sum, log) => sum + log.duration, 0) / 5) - 1) * 100)
    : 0;
    
  // Calculate efficiency score (shorter is more efficient, but not too short)
  let efficiencyScore = 0;
  if (logs.length > 0) {
    const idealDuration = 5; // 5 min is ideal
    const avgDiff = Math.abs(avgDuration - idealDuration);
    efficiencyScore = Math.max(0, 100 - (avgDiff * 10)); // Decrease score as we move away from ideal
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Timer className="w-5 h-5 text-orange-500 mr-2" />
          <CardTitle>{t('duration_analysis')}</CardTitle>
        </div>
        <CardDescription>{t('duration_analysis_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('average_duration')}
                  </h3>
                  <div className="text-3xl font-bold mt-1">{avgDuration}</div>
                  <div className="text-xs text-muted-foreground">{t('minutes').toLowerCase()}</div>
                </div>
                
                <div className="border rounded-full h-16 w-16 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {efficiencyScore}%
                    </div>
                    <div className="text-[10px] text-muted-foreground leading-none">
                      {t('efficiency')}
                    </div>
                  </div>
                </div>
              </div>
              
              {durationChange !== 0 && (
                <div className={cn(
                  "text-xs mt-4 flex items-center gap-1",
                  durationChange > 0 ? "text-amber-500" : "text-emerald-500"
                )}>
                  {durationChange > 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3" /> 
                      {t('duration_increasing', { value: durationChange })}
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3" /> 
                      {t('duration_decreasing', { value: Math.abs(durationChange) })}
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('most_common_duration')}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-xl font-bold">
                    {mostCommonRange.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {((mostCommonRange.count / logs.length) * 100).toFixed(0)}% {t('of_all_logs')}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={durationRanges}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis 
                  tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <Tooltip
                  formatter={(value) => [`${value} ${t('logs')}`, t('count')]}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar 
                  dataKey="count" 
                  name={t('logs')}
                  fill="var(--orange-500)" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t text-xs text-muted-foreground">
        {logs.length > 0 ? (
          <>
            {t('bathroom_efficiency_tip', { 
              efficiency: efficiencyScore,
              score: efficiencyScore < 50 
                ? t('low') 
                : efficiencyScore < 75 
                  ? t('moderate') 
                  : t('high')
            })}
          </>
        ) : (
          t('no_duration_data')
        )}
      </CardFooter>
    </Card>
  );
};

// Health Correlations Component
const HealthCorrelations = ({ logs }: { logs: any[] }) => {
  const { t } = useTranslation();
  
  // Process correlation data  
  const correlationData = logs.map(log => ({
    rating: 
      log.rating === 'excellent' ? 4 :
      log.rating === 'good' ? 3 :
      log.rating === 'okay' ? 2 : 1,
    consistency: log.consistency,
    duration: log.duration,
    date: format(new Date(log.dateTime), 'MM/dd'),
    dateTime: log.dateTime
  }));
  
  // Calculate correlation between consistency and rating
  let consistencyRatingCorrelation = 0;
  if (logs.length > 3) {
    const ratings = correlationData.map(d => d.rating);
    const consistencies = correlationData.map(d => d.consistency);
    
    // Simplified correlation calculation
    const avgRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    const avgConsistency = consistencies.reduce((sum, c) => sum + c, 0) / consistencies.length;
    
    let numerator = 0;
    let denomRating = 0;
    let denomConsistency = 0;
    
    for (let i = 0; i < logs.length; i++) {
      const ratingDiff = ratings[i] - avgRating;
      const consistencyDiff = consistencies[i] - avgConsistency;
      
      numerator += ratingDiff * consistencyDiff;
      denomRating += ratingDiff * ratingDiff;
      denomConsistency += consistencyDiff * consistencyDiff;
    }
    
    const denominator = Math.sqrt(denomRating * denomConsistency);
    if (denominator !== 0) {
      consistencyRatingCorrelation = numerator / denominator;
    }
  }
  
  // Check if longer duration means worse rating
  let durationRatingCorrelation = 0;
  if (logs.length > 3) {
    const ratings = correlationData.map(d => d.rating);
    const durations = correlationData.map(d => d.duration);
    
    const avgRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    
    let numerator = 0;
    let denomRating = 0;
    let denomDuration = 0;
    
    for (let i = 0; i < logs.length; i++) {
      const ratingDiff = ratings[i] - avgRating;
      const durationDiff = durations[i] - avgDuration;
      
      numerator += ratingDiff * durationDiff;
      denomRating += ratingDiff * ratingDiff;
      denomDuration += durationDiff * durationDiff;
    }
    
    const denominator = Math.sqrt(denomRating * denomDuration);
    if (denominator !== 0) {
      durationRatingCorrelation = numerator / denominator;
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <LineChart className="w-5 h-5 text-purple-500 mr-2" />
          <CardTitle>{t('health_correlations')}</CardTitle>
        </div>
        <CardDescription>{t('health_correlations_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis 
                  type="number" 
                  dataKey="consistency" 
                  name={t('consistency')}
                  domain={[0, 6]}
                  tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="rating" 
                  name={t('rating')}
                  domain={[0, 5]}
                  tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'rating') {
                      const ratingMap: Record<number, string> = {
                        1: t('bad'),
                        2: t('ok'),
                        3: t('good'),
                        4: t('excellent')
                      };
                      return [ratingMap[value as number], name];
                    }
                    if (name === 'consistency') {
                      const consistencyMap: Record<number, string> = {
                        1: t('very_hard'),
                        2: t('hard'),
                        3: t('normal'),
                        4: t('soft'),
                        5: t('very_soft')
                      };
                      return [consistencyMap[value as number], name];
                    }
                    return [value, name];
                  }}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(value) => t('consistency_rating_correlation')}
                />
                <Scatter 
                  name={t('logs')} 
                  data={correlationData} 
                  fill="var(--purple-500)"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t('consistency_rating_correlation')}
              </h3>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {Math.abs(consistencyRatingCorrelation).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {consistencyRatingCorrelation > 0.2 
                      ? t('positive_correlation') 
                      : consistencyRatingCorrelation < -0.2 
                        ? t('negative_correlation')
                        : t('no_correlation')}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 text-xs">
                {consistencyRatingCorrelation > 0.2 ? (
                  <p>{t('higher_consistency_better_rating')}</p>
                ) : consistencyRatingCorrelation < -0.2 ? (
                  <p>{t('lower_consistency_better_rating')}</p>
                ) : (
                  <p>{t('no_clear_relationship')}</p>
                )}
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t('duration_rating_relationship')}
              </h3>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {Math.abs(durationRatingCorrelation).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {durationRatingCorrelation > 0.2 
                      ? t('positive_correlation') 
                      : durationRatingCorrelation < -0.2 
                        ? t('negative_correlation')
                        : t('no_correlation')}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 text-xs">
                {durationRatingCorrelation > 0.2 ? (
                  <p>{t('longer_duration_better_rating')}</p>
                ) : durationRatingCorrelation < -0.2 ? (
                  <p>{t('shorter_duration_better_rating')}</p>
                ) : (
                  <p>{t('duration_not_affecting_rating')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t text-xs text-muted-foreground">
        {logs.length < 5 ? (
          t('need_more_logs_for_correlations')
        ) : (
          t('correlations_disclaimer')
        )}
      </CardFooter>
    </Card>
  );
};

// Insights and Recommendations Component
const InsightsRecommendations = ({ logs }: { logs: any[] }) => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  
  // Generate personalized insights based on data
  const generateInsights = () => {
    const insights = [];
    
    // Check if user has enough data
    if (logs.length < 5) {
      insights.push({
        title: t('need_more_data'),
        description: t('need_more_data_description'),
        icon: Info,
        variant: "info" as const,
        action: () => navigate('/'),
        actionText: t('log_now')
      });
      return insights;
    }
    
    // Check for consistency issues
    const consistencies = logs.map(log => log.consistency);
    const avgConsistency = consistencies.reduce((sum, c) => sum + c, 0) / consistencies.length;
    
    if (avgConsistency < 2) {
      insights.push({
        title: t('hydration_recommendation'),
        description: t('hydration_recommendation_description'),
        icon: Droplets,
        variant: "warning" as const
      });
    }
    
    if (avgConsistency > 4) {
      insights.push({
        title: t('fiber_recommendation'),
        description: t('fiber_recommendation_description'),
        icon: ArrowDownUp,
        variant: "warning" as const
      });
    }
    
    // Check for duration issues
    const durations = logs.map(log => log.duration);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    
    if (avgDuration > 15) {
      insights.push({
        title: t('reduce_toilet_time'),
        description: t('reduce_toilet_time_description'),
        icon: Timer,
        variant: "warning" as const
      });
    }
    
    // Check for positive patterns
    const ratings = logs.map(log => 
      log.rating === 'excellent' ? 4 :
      log.rating === 'good' ? 3 :
      log.rating === 'okay' ? 2 : 1
    );
    const avgRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    
    if (avgRating > 3 && avgConsistency >= 2.5 && avgConsistency <= 3.5) {
      insights.push({
        title: t('healthy_patterns'),
        description: t('healthy_patterns_description'),
        icon: Heart,
        variant: "success" as const
      });
    }
    
    // Frequency insights
    const last30Days = subDays(new Date(), 30);
    const recentLogs = logs.filter(log => new Date(log.dateTime) >= last30Days);
    
    if (recentLogs.length < 15) { // Less than every other day
      insights.push({
        title: t('improve_regularity'),
        description: t('improve_regularity_description'),
        icon: Calendar,
        variant: "info" as const
      });
    }
    
    return insights;
  };
  
  const insights = generateInsights();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Info className="w-5 h-5 text-amber-500 mr-2" />
          <CardTitle>{t('personal_insights')}</CardTitle>
        </div>
        <CardDescription>{t('personal_insights_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <InsightCard
              key={index}
              title={insight.title}
              description={insight.description}
              icon={insight.icon}
              variant={insight.variant}
              action={insight.action}
              actionText={insight.actionText}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t text-xs text-muted-foreground">
        {t('insights_disclaimer')}
      </CardFooter>
    </Card>
  );
};

// Main Analytics Component
export default function Analytics() {
  const { logs } = usePoopContext();
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("all");
  
  // Filter logs based on selected time range
  const filteredLogs = React.useMemo(() => {
    if (timeRange === "all") return logs;
    
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case "week":
        startDate = subDays(now, 7);
        break;
      case "month":
        startDate = subDays(now, 30);
        break;
      case "quarter":
        startDate = subDays(now, 90);
        break;
      default:
        return logs;
    }
    
    return logs.filter(log => new Date(log.dateTime) >= startDate);
  }, [logs, timeRange]);
  
  // Calculate key metrics for overview
  const metrics = React.useMemo(() => {
    const now = new Date();
    const last30 = subDays(now, 30);
    const last60 = subDays(now, 60);
    
    // Get logs from last 30 days
    const recentLogs = logs.filter(log => new Date(log.dateTime) >= last30);
    // Get logs from 30-60 days ago
    const previousLogs = logs.filter(log => 
      new Date(log.dateTime) >= last60 && new Date(log.dateTime) < last30
    );
    
    // Calculate frequency change
    const frequencyChange = previousLogs.length > 0
      ? Math.round(((recentLogs.length / previousLogs.length) - 1) * 100)
      : 0;
    
    // Calculate average consistency
    const avgConsistency = recentLogs.length > 0
      ? Math.round((recentLogs.reduce((sum, log) => sum + log.consistency, 0) / recentLogs.length) * 10) / 10
      : 0;
    
    // Calculate rating quality
    const qualityScore = recentLogs.length > 0
      ? Math.round((recentLogs.reduce((sum, log) => {
          const rating = 
            log.rating === 'excellent' ? 100 :
            log.rating === 'good' ? 75 :
            log.rating === 'okay' ? 50 : 25;
          return sum + rating;
        }, 0) / recentLogs.length))
      : 0;
    
    // Calculate consistency stability
    const consistencyStability = recentLogs.length > 0
      ? Math.round((1 - (new Set(recentLogs.map(log => log.consistency)).size / recentLogs.length)) * 100)
      : 0;
    
    return {
      frequency: {
        value: recentLogs.length,
        change: frequencyChange,
        subtitle: t('last_30_days')
      },
      consistency: {
        value: avgConsistency,
        subtitle: `/ 5 ${t('average')}`
      },
      quality: {
        value: `${qualityScore}%`,
        trend: qualityScore > 70 ? "up" : qualityScore < 50 ? "down" : "neutral"
      },
      stability: {
        value: `${consistencyStability}%`,
        trend: consistencyStability > 70 ? "up" : consistencyStability < 40 ? "down" : "neutral"
      }
    };
  }, [logs, t]);
  
  return (
    <motion.div 
      className="p-4 pb-20 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-2xl font-bold text-secondary">{t('advanced_analytics')}</h1>
        <p className="text-sm text-muted-foreground">{t('advanced_analytics_description')}</p>
      </div>
      
      {/* Time Range Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-medium">{t('showing_data_for')}:</div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('all_time')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_time')}</SelectItem>
            <SelectItem value="week">{t('last_7_days')}</SelectItem>
            <SelectItem value="month">{t('last_30_days')}</SelectItem>
            <SelectItem value="quarter">{t('last_90_days')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title={t('frequency')}
          value={metrics.frequency.value}
          change={metrics.frequency.change}
          icon={BarChart4}
          subtitle={metrics.frequency.subtitle}
          color="amber"
        />
        <MetricCard
          title={t('consistency')}
          value={metrics.consistency.value}
          icon={Activity}
          subtitle={metrics.consistency.subtitle}
          color="blue"
        />
        <MetricCard
          title={t('quality_score')}
          value={metrics.quality.value}
          icon={Heart}
          trend={metrics.quality.trend}
          color="emerald"
        />
        <MetricCard
          title={t('stability')}
          value={metrics.stability.value}
          icon={ArrowDownUp}
          trend={metrics.stability.trend}
          color="purple"
        />
      </div>
      
      {/* No Data State */}
      {filteredLogs.length === 0 ? (
        <Card className="p-8 flex flex-col items-center justify-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('no_data_available')}</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            {t('no_data_description')}
          </p>
          <Button onClick={() => setTimeRange("all")}>
            {t('view_all_time_data')}
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Insights and Recommendations */}
          <InsightsRecommendations logs={filteredLogs} />
          
          {/* Time Distribution */}
          <TimeDistribution logs={filteredLogs} />
          
          {/* Consistency Patterns */}
          <ConsistencyPatterns logs={filteredLogs} />
          
          {/* Duration Analysis */}
          <DurationAnalysis logs={filteredLogs} />
          
          {/* Health Correlations */}
          <HealthCorrelations logs={filteredLogs} />
        </div>
      )}
    </motion.div>
  );
}