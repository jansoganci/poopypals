import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Lock, HelpCircle, LogOut } from "lucide-react";
import { usePoopContext } from "@/context/PoopContext";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { stats } = usePoopContext();
  const { t } = useTranslation();
  
  return (
    <div className="p-4 pb-20">
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-secondary text-xl">
                👤
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">Demo User</h2>
              <p className="text-sm text-muted-foreground">Premium Member</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm">💩</span>
                <span className="text-sm font-medium">
                  {stats.totalLogs} {t('total_logs').toLowerCase()} • {stats.streak} {t('streak').toLowerCase()}
                </span>
              </div>
            </div>
          </div>
          
          <Button className="w-full mt-4" variant="outline">
            {t('edit_profile')}
          </Button>
        </CardContent>
      </Card>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{t('settings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Label htmlFor="notifications">{t('notifications')}</Label>
            </div>
            <Switch id="notifications" defaultChecked />
          </div>
          
          <Separator />
          
          <ThemeToggle />
          
          <Separator />
          
          <LanguageSwitcher />
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <Label htmlFor="privacy">{t('privacy')}</Label>
            </div>
            <span className="text-muted-foreground">›</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
            <span>{t('help_support')}</span>
          </div>
          
          <Separator />
          
          <div className="flex items-center gap-3 text-red-500">
            <LogOut className="h-5 w-5" />
            <span>{t('log_out')}</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-4 text-center text-xs text-muted-foreground">
        <p>{t('version')}</p>
        <p>{t('copyright')}</p>
      </div>
    </div>
  );
}
