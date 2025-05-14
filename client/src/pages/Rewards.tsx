import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, CalendarDays, Heart } from "lucide-react";
import { usePoopContext } from "@/context/PoopContext";

export default function Rewards() {
  const { achievements, stats } = usePoopContext();

  const achievementCards = [
    {
      title: "Consistent Pooper",
      description: "Maintained a 5-day streak",
      icon: <CalendarDays className="h-10 w-10 text-amber-500" />,
      unlocked: true,
    },
    {
      title: "Speed Demon",
      description: "Completed in under 2 minutes",
      icon: <Clock className="h-10 w-10 text-amber-500" />,
      unlocked: true,
    },
    {
      title: "Master Logger",
      description: "Logged 10 times",
      icon: <Trophy className="h-10 w-10 text-amber-500" />,
      unlocked: true,
    },
    {
      title: "Health Nut",
      description: "Perfect consistency for a week",
      icon: <Heart className="h-10 w-10 text-amber-500" />,
      unlocked: false,
    }
  ];

  return (
    <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-secondary">Rewards</h1>
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <span className="text-lg font-bold text-secondary">{stats.flushFunds} Flush Funds</span>
        </div>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>You've unlocked {achievements.length} achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {achievementCards.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${achievement.unlocked ? 'bg-amber-50' : 'bg-gray-100'} flex flex-col items-center text-center`}
              >
                <div className={`p-3 rounded-full mb-2 ${achievement.unlocked ? 'bg-amber-100' : 'bg-gray-200'}`}>
                  {achievement.icon}
                </div>
                <h3 className="font-bold text-gray-800">{achievement.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                {achievement.unlocked ? (
                  <Badge className="mt-2 bg-amber-500">Unlocked</Badge>
                ) : (
                  <Badge className="mt-2 bg-gray-400">Locked</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
              <button className="px-3 py-1 bg-primary text-secondary rounded-lg text-sm font-medium">
                50 FF
              </button>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎮</span>
                <div>
                  <h3 className="font-medium">Bonus Game</h3>
                  <p className="text-xs text-gray-500">Unlock a new toilet game</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-primary text-secondary rounded-lg text-sm font-medium">
                100 FF
              </button>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👑</span>
                <div>
                  <h3 className="font-medium">Premium Status</h3>
                  <p className="text-xs text-gray-500">No ads + extra features</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-primary text-secondary rounded-lg text-sm font-medium">
                200 FF
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
