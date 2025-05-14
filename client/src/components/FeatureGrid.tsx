import FeatureCard from "./FeatureCard";
import { MapPin, Clock, Trophy, Brain } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FeatureGrid() {
  const { t } = useTranslation();
  
  // These titles can be translated using translation keys
  const getFeatures = () => [
    {
      title: t('nav_home'),
      subtitle: "3 " + t('nav_stats').toLowerCase(),
      icon: <MapPin />,
      color: "bg-blue-100 text-info"
    },
    {
      title: t('log_title'),
      subtitle: t('take_quiz'),
      icon: <Clock />,
      color: "bg-purple-100 text-purple-500"
    },
    {
      title: t('achievements'),
      subtitle: "12 " + t('unlocked').toLowerCase(),
      icon: <Trophy />,
      color: "bg-green-100 text-success"
    },
    {
      title: t('personality_quiz'),
      subtitle: t('health_tip'),
      icon: <Brain />,
      color: "bg-red-100 text-danger"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mx-4 my-4">
      {getFeatures().map((feature, index) => (
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
