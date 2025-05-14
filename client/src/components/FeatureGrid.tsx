import FeatureCard from "./FeatureCard";
import { MapPin, Clock, Trophy, Brain } from "lucide-react";

export default function FeatureGrid() {
  const features = [
    {
      title: "Find Bathroom",
      subtitle: "3 nearby",
      icon: <MapPin />,
      color: "bg-blue-100 text-info"
    },
    {
      title: "Toilet Games",
      subtitle: "Play & Earn",
      icon: <Clock />,
      color: "bg-purple-100 text-purple-500"
    },
    {
      title: "Achievements",
      subtitle: "12 Earned",
      icon: <Trophy />,
      color: "bg-green-100 text-success"
    },
    {
      title: "Poop AI",
      subtitle: "Health Insights",
      icon: <Brain />,
      color: "bg-red-100 text-danger"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mx-4 my-4">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          title={feature.title}
          subtitle={feature.subtitle}
          icon={feature.icon}
          color={feature.color}
        />
      ))}
    </div>
  );
}
