import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Brain } from "lucide-react";
import { usePoopContext } from "@/context/PoopContext";
import AchievementSystem, { achievements } from "@/components/AchievementSystem";
import PersonalityQuiz from "@/components/PersonalityQuiz";

export default function Rewards() {
  const { stats } = usePoopContext();
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
        <h1 className="text-2xl font-bold text-secondary">Rewards</h1>
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <span className="text-lg font-bold text-secondary">{stats.flushFunds} Flush Funds</span>
        </div>
      </div>

      <Tabs defaultValue="achievements" className="mb-4">
        <TabsList className="grid grid-cols-2 mb-4 w-full">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="shop">Reward Shop</TabsTrigger>
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
                    <h3 className="font-bold text-lg">Discover Your Poop Personality!</h3>
                    <p className="text-sm text-gray-600">Take our quiz to unlock special achievements and learn health tips</p>
                  </div>
                  <Button 
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => setIsQuizOpen(true)}
                  >
                    Take Quiz
                  </Button>
                </div>
                
                {personality && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{personality.emoji}</span>
                      <span className="font-medium">{personality.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Click to retake the quiz and explore other personalities</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Achievement Gallery</CardTitle>
                  <CardDescription>Collect them all to earn Flush Funds</CardDescription>
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
              <CardTitle>Reward Shop</CardTitle>
              <CardDescription>Spend your Flush Funds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧻</span>
                    <div>
                      <h3 className="font-medium">Premium Themes</h3>
                      <p className="text-xs text-gray-500">Customize your app</p>
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
                      <h3 className="font-medium">Toilet Tapper Game</h3>
                      <p className="text-xs text-gray-500">Unlock a new toilet game</p>
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
                      <h3 className="font-medium">Premium Status</h3>
                      <p className="text-xs text-gray-500">No ads + extra features</p>
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
                      <h3 className="font-medium">Advanced Analytics</h3>
                      <p className="text-xs text-gray-500">Detailed health insights</p>
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
                      <h3 className="font-medium">Custom Achievements</h3>
                      <p className="text-xs text-gray-500">Create your own goals</p>
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
