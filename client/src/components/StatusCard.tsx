import { Card, CardContent } from "@/components/ui/card";
import { usePoopContext } from "@/context/PoopContext";
import { useTranslation } from "react-i18next";

export default function StatusCard() {
  const { stats } = usePoopContext();
  const { t } = useTranslation();
  
  return (
    <div className="mx-4 my-4">
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium">{t('status_card_title')}</p>
              <h2 className="text-secondary text-2xl font-bold">{t('status_card_description')}</h2>
            </div>
            <div className="bg-accent p-3 rounded-full">
              <span className="text-2xl">✨</span>
            </div>
          </div>

          <div className="flex justify-between mt-6 gap-4">
            <div className="text-center">
              <p className="text-gray-500 text-sm">{t('streak')}</p>
              <p className="text-secondary font-bold text-xl">{stats.streak}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm">{t('achievements')}</p>
              <p className="text-secondary font-bold text-xl">{stats.achievementCount}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm">{t('flush_funds')}</p>
              <p className="text-secondary font-bold text-xl">{stats.flushFunds}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
