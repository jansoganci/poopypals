import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Brain } from "lucide-react";
import { usePoopContext } from "@/context/PoopContext";
import AchievementSystem, { achievements } from "@/components/AchievementSystem";
import PersonalityQuiz from "@/components/PersonalityQuiz";
import { useTranslation } from "react-i18next";

export default function Rewards() {
  const { stats } = usePoopContext();
  const { t } = useTranslation();
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [personality, setPersonality] = useState<any>(null);

  const handleCompleteQuiz = (result: any) => {
    setPersonality(result);
    setIsQuizOpen(false);
    
    // Here you could also save the personality to the user's profile
    // or trigger an achievement for completing the quiz
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-secondary">{t('rewards')}</h1>
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <span className="text-lg font-bold text-secondary">{stats.flushFunds} {t('flush_funds')}</span>
        </div>
      </div>

      <Tabs defaultValue="achievements" className="mb-4">
        <TabsList className="grid grid-cols-2 mb-4 w-full">
          <TabsTrigger value="achievements">{t('achievements')}</TabsTrigger>
          <TabsTrigger value="shop">{t('reward_shop')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements">
          <div className="mb-4">
            <Card className="border-2 border-amber-300 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <Brain className="h-10 w-10 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{t('discover_personality')}</h3>
                    <p className="text-sm text-gray-600">{t('take_quiz_description')}</p>
                  </div>
                  <Button 
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => setIsQuizOpen(true)}
                  >
                    {t('take_quiz')}
                  </Button>
                </div>
                
                {personality && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{personality.emoji}</span>
                      <span className="font-medium">{personality.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{t('retake_quiz_hint')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{t('achievement_gallery')}</CardTitle>
                  <CardDescription>{t('collect_achievements')}</CardDescription>
                </div>
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <AchievementSystem achievements={achievements} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shop">
          <Card>
            <CardHeader>
              <CardTitle>{t('reward_shop')}</CardTitle>
              <CardDescription>{t('spend_funds')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧻</span>
                    <div>
                      <h3 className="font-medium">{t('premium_themes')}</h3>
                      <p className="text-xs text-gray-500">{t('customize_app')}</p>
                    </div>
                  </div>
                  <Button className="px-3 py-1 bg-primary text-secondary rounded-lg text-sm font-medium">
                    50 FF
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎮</span>
                    <div>
                      <h3 className="font-medium">{t('toilet_game')}</h3>
                      <p className="text-xs text-gray-500">{t('unlock_game')}</p>
                    </div>
                  </div>
                  <Button className="px-3 py-1 bg-primary text-secondary rounded-lg text-sm font-medium">
                    100 FF
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👑</span>
                    <div>
                      <h3 className="font-medium">{t('premium_status')}</h3>
                      <p className="text-xs text-gray-500">{t('premium_features')}</p>
                    </div>
                  </div>
                  <Button className="px-3 py-1 bg-primary text-secondary rounded-lg text-sm font-medium">
                    200 FF
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <h3 className="font-medium">{t('advanced_analytics')}</h3>
                      <p className="text-xs text-gray-500">{t('health_insights')}</p>
                    </div>
                  </div>
                  <Button className="px-3 py-1 bg-primary text-secondary rounded-lg text-sm font-medium">
                    150 FF
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <h3 className="font-medium">{t('custom_achievements')}</h3>
                      <p className="text-xs text-gray-500">{t('create_goals')}</p>
                    </div>
                  </div>
                  <Button className="px-3 py-1 bg-primary text-secondary rounded-lg text-sm font-medium">
                    75 FF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <PersonalityQuiz 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)}
        onComplete={handleCompleteQuiz}
      />
    </div>
  );
}
