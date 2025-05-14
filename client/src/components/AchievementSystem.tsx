import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Clock, Calendar, Flame, Droplet, Apple, Award, Heart, Star } from "lucide-react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: 'streak' | 'consistency' | 'hydration' | 'fiber' | 'frequency' | 'variety' | 'speed' | 'special';
  level: 1 | 2 | 3;
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  healthTip: string;
  color: string;
}

export const achievements: Achievement[] = [
  // Streak achievements
  {
    id: 'streak-1',
    name: 'Regular Rookie',
    description: 'Log 3 days in a row',
    icon: <Calendar className="h-10 w-10" />,
    type: 'streak',
    level: 1,
    progress: 100,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    healthTip: 'Regular bathroom habits are a sign of good digestive health.',
    color: 'bg-orange-100 text-orange-500'
  },
  {
    id: 'streak-2',
    name: 'Consistency King',
    description: 'Log 7 days in a row',
    icon: <Calendar className="h-10 w-10" />,
    type: 'streak',
    level: 2,
    progress: 71,
    unlocked: false,
    healthTip: 'A regular 7-day pattern indicates stable gut health.',
    color: 'bg-orange-100 text-orange-500'
  },
  {
    id: 'streak-3',
    name: 'Bathroom Believer',
    description: 'Log 14 days in a row',
    icon: <Calendar className="h-10 w-10" />,
    type: 'streak',
    level: 3,
    progress: 35,
    unlocked: false,
    healthTip: 'Two weeks of consistency shows excellent digestive regularity.',
    color: 'bg-orange-100 text-orange-500'
  },
  
  // Hydration achievements
  {
    id: 'hydration-1',
    name: 'Water Warrior',
    description: 'Log proper hydration for 3 days',
    icon: <Droplet className="h-10 w-10" />,
    type: 'hydration',
    level: 1,
    progress: 66,
    unlocked: false,
    healthTip: 'Staying hydrated helps prevent constipation and keeps stool soft.',
    color: 'bg-blue-100 text-blue-500'
  },
  {
    id: 'hydration-2',
    name: 'Hydration Hero',
    description: 'Log proper hydration for 7 days',
    icon: <Droplet className="h-10 w-10" />,
    type: 'hydration',
    level: 2,
    progress: 28,
    unlocked: false,
    healthTip: 'Consistent hydration improves overall digestive transit time.',
    color: 'bg-blue-100 text-blue-500'
  },
  
  // Fiber achievements
  {
    id: 'fiber-1',
    name: 'Fiber Fanatic',
    description: 'Log high-fiber foods for 3 days',
    icon: <Apple className="h-10 w-10" />,
    type: 'fiber',
    level: 1,
    progress: 100,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    healthTip: 'Fiber adds bulk to stool and helps prevent constipation.',
    color: 'bg-green-100 text-green-500'
  },
  {
    id: 'fiber-2',
    name: 'Fiber Champion',
    description: 'Log high-fiber foods for 7 days',
    icon: <Apple className="h-10 w-10" />,
    type: 'fiber',
    level: 2,
    progress: 42,
    unlocked: false,
    healthTip: 'Adults should aim for 25-30g of fiber daily for optimal digestive health.',
    color: 'bg-green-100 text-green-500'
  },
  
  // Speed achievements
  {
    id: 'speed-1',
    name: 'Speed Demon',
    description: 'Complete in under 2 minutes',
    icon: <Clock className="h-10 w-10" />,
    type: 'speed',
    level: 1,
    progress: 100,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    healthTip: 'Quick, easy bowel movements indicate a healthy digestive system.',
    color: 'bg-purple-100 text-purple-500'
  },
  
  // Consistency achievements
  {
    id: 'consistency-1',
    name: 'Perfect Form',
    description: 'Achieve ideal consistency (3-4 on scale) 5 times',
    icon: <Star className="h-10 w-10" />,
    type: 'consistency',
    level: 1,
    progress: 80,
    unlocked: false,
    healthTip: 'The Bristol Stool Chart types 3-4 indicate ideal stool consistency.',
    color: 'bg-yellow-100 text-yellow-600'
  },
  
  // Special achievements
  {
    id: 'special-1',
    name: 'Health Nut',
    description: 'Complete the personality quiz',
    icon: <Heart className="h-10 w-10" />,
    type: 'special',
    level: 1,
    progress: 0,
    unlocked: false,
    healthTip: 'Understanding your habits is the first step to improving them.',
    color: 'bg-red-100 text-red-500'
  }
];

interface AchievementDetailProps {
  achievement: Achievement;
  onClose: () => void;
}

function AchievementDetail({ achievement, onClose }: AchievementDetailProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-t-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-secondary">Achievement Details</DialogTitle>
            <DialogClose className="p-1 text-gray-500 rounded-full hover:bg-gray-100">
              <X size={20} />
            </DialogClose>
          </div>
        </DialogHeader>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-center mb-2">
              <div className={`p-4 rounded-full ${achievement.color}`}>
                {achievement.icon}
              </div>
            </div>
            <CardTitle className="text-center text-xl">{achievement.name}</CardTitle>
            <CardDescription className="text-center">{achievement.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {achievement.unlocked ? '100%' : `${achievement.progress}%`}
              </span>
            </div>
            <Progress value={achievement.unlocked ? 100 : achievement.progress} className="h-2" />
            
            {achievement.unlocked && achievement.unlockedAt && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium">Unlocked</span>
                <span className="text-sm text-muted-foreground">
                  {achievement.unlockedAt.toLocaleDateString()}
                </span>
              </div>
            )}
            
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mt-4">
              <p className="text-sm font-semibold">Health Tip:</p>
              <p className="text-sm">{achievement.healthTip}</p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
  onClick: (achievement: Achievement) => void;
}

function AchievementCard({ achievement, onClick }: AchievementCardProps) {
  return (
    <div 
      className={`p-4 rounded-xl border ${achievement.unlocked ? 'bg-amber-50' : 'bg-gray-100'} flex flex-col items-center text-center cursor-pointer`}
      onClick={() => onClick(achievement)}
    >
      <div className={`p-3 rounded-full mb-2 ${achievement.color}`}>
        {achievement.icon}
      </div>
      <h3 className="font-bold text-gray-800">{achievement.name}</h3>
      <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
      {achievement.unlocked ? (
        <Badge className="mt-2 bg-amber-500">Unlocked</Badge>
      ) : (
        <div className="w-full mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>{achievement.progress}%</span>
          </div>
          <Progress value={achievement.progress} className="h-1.5" />
        </div>
      )}
    </div>
  );
}

interface AchievementSystemProps {
  achievements: Achievement[];
}

export default function AchievementSystem({ achievements }: AchievementSystemProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  const handleSelectAchievement = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };
  
  const handleCloseDetail = () => {
    setSelectedAchievement(null);
  };
  
  // Group achievements by type for better organization
  const achievementsByType = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.type]) {
      acc[achievement.type] = [];
    }
    acc[achievement.type].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);
  
  const typeLabels: Record<string, string> = {
    'streak': 'Consistency Streaks',
    'consistency': 'Perfect Form',
    'hydration': 'Hydration',
    'fiber': 'Nutrition',
    'frequency': 'Frequency',
    'variety': 'Variety',
    'speed': 'Efficiency',
    'special': 'Special'
  };
  
  return (
    <div className="space-y-6">
      {Object.entries(achievementsByType).map(([type, typeAchievements]) => (
        <div key={type} className="mb-6">
          <h2 className="text-lg font-bold text-secondary mb-3">{typeLabels[type]}</h2>
          <div className="grid grid-cols-2 gap-4">
            {typeAchievements.map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
                onClick={handleSelectAchievement}
              />
            ))}
          </div>
        </div>
      ))}
      
      {selectedAchievement && (
        <AchievementDetail
          achievement={selectedAchievement}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}