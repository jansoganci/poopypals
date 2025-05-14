import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

export default function FeatureCard({ title, subtitle, icon, color }: FeatureCardProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-6 flex flex-col items-center">
        <div className={`${color} p-3 rounded-full mb-3`}>
          {icon}
        </div>
        <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        <p className="text-gray-500 text-sm text-center">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
