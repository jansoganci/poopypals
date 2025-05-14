import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, Lock, HelpCircle, LogOut, Paintbrush } from "lucide-react";
import { usePoopContext } from "@/context/PoopContext";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import Avatar from "@/components/avatar/Avatar";
import AvatarEditor from "@/components/avatar/AvatarEditor";

export default function Profile() {
  const { stats } = usePoopContext();
  const { t } = useTranslation();
  const [isAvatarEditorOpen, setIsAvatarEditorOpen] = useState(false);
  
  // Placeholder user ID, in a real app this would come from authentication context
  const userId = 1;
  
  return (
    <div className="p-4 pb-20">
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar headId={1} eyesId={1} mouthId={1} size="md" />
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
          
          <div className="flex gap-2 mt-4">
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={() => setIsAvatarEditorOpen(true)}
            >
              <Paintbrush className="w-4 h-4 mr-2" />
              {t('customize_avatar')}
            </Button>
            
            <Button className="flex-1" variant="outline">
              {t('edit_profile')}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Avatar Editor Dialog */}
      <Dialog open={isAvatarEditorOpen} onOpenChange={setIsAvatarEditorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('customize_avatar')}</DialogTitle>
            <DialogDescription>
              {t('customize_avatar_description')}
            </DialogDescription>
          </DialogHeader>
          <AvatarEditor userId={userId} />
        </DialogContent>
      </Dialog>
      
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
