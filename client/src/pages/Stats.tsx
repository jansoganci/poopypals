import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePoopContext } from "@/context/PoopContext";
import { BarChart, AreaChart } from "@/components/ui/chart";
import { format, subDays } from "date-fns";
import { useTranslation } from "react-i18next";

export default function Stats() {
  const { logs } = usePoopContext();
  const { t } = useTranslation();
  
  // Generate data for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const formattedDate = format(date, 'MMM d');
    const logsForDay = logs.filter(log => 
      format(new Date(log.dateTime), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    return {
      name: formattedDate,
      count: logsForDay.length,
    };
  }).reverse();
  
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
  const consistencyCounts = logs.reduce((acc: Record<number, number>, log) => {
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
  
  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold text-secondary mb-4">{t('statistics')}</h1>
      
      <Tabs defaultValue="frequency">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="frequency">{t('frequency')}</TabsTrigger>
          <TabsTrigger value="ratings">{t('rating')}</TabsTrigger>
          <TabsTrigger value="consistency">{t('consistency')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="frequency">
          <Card>
            <CardHeader>
              <CardTitle>{t('weekly_overview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <AreaChart 
                  data={last7Days}
                  index="name"
                  categories={["count"]}
                  colors={["primary"]}
                  valueFormatter={(value) => `${value} ${t('total_logs').toLowerCase()}`}
                  showAnimation
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>{t('rating')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart 
                  data={ratingData}
                  index="name"
                  categories={["value"]}
                  colors={["primary"]}
                  valueFormatter={(value) => `${value} ${t('total_logs').toLowerCase()}`}
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
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart 
                  data={consistencyData}
                  index="name"
                  categories={["value"]}
                  colors={["primary"]}
                  valueFormatter={(value) => `${value} ${t('total_logs').toLowerCase()}`}
                  showAnimation
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{t('monthly_trends')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('total_logs')}</p>
              <p className="text-2xl font-bold text-secondary">{logs.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('duration_avg')}</p>
              <p className="text-2xl font-bold text-secondary">
                {logs.length ? Math.round(logs.reduce((sum, log) => sum + log.duration, 0) / logs.length) : 0} {t('minutes').toLowerCase()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('frequency')}</p>
              <p className="text-2xl font-bold text-secondary">
                {logs.length ? format(new Date(logs[0].dateTime), 'h:mm a') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('streak')}</p>
              <p className="text-2xl font-bold text-secondary">5 {t('streak').toLowerCase()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
