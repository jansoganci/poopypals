import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Globe, Lock, HelpCircle, LogOut } from "lucide-react";
import { usePoopContext } from "@/context/PoopContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function Profile() {
  const { stats } = usePoopContext();
  
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
                <span className="text-sm font-medium">{stats.totalLogs} logs • {stats.streak} day streak</span>
              </div>
            </div>
          </div>
          
          <Button className="w-full mt-4" variant="outline">
            Edit Profile
          </Button>
        </CardContent>
      </Card>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Label htmlFor="notifications">Notifications</Label>
            </div>
            <Switch id="notifications" defaultChecked />
          </div>
          
          <Separator />
          
          <ThemeToggle />
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label>Language</Label>
                <p className="text-xs text-muted-foreground">English (US)</p>
              </div>
            </div>
            <span className="text-muted-foreground">›</span>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <Label htmlFor="privacy">Privacy</Label>
            </div>
            <span className="text-muted-foreground">›</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
            <span>Help & Support</span>
          </div>
          
          <Separator />
          
          <div className="flex items-center gap-3 text-red-500">
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-4 text-center text-xs text-muted-foreground">
        <p>Poopy Pals v1.0.0</p>
        <p>© 2023 Poopy Pals Inc.</p>
      </div>
    </div>
  );
}
