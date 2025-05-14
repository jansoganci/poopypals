import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface LogButtonProps {
  onClick: () => void;
}

export default function LogButton({ onClick }: LogButtonProps) {
  const { t } = useTranslation();
  
  return (
    <div className="mx-4 my-4">
      <Button 
        className="log-btn w-full py-8 px-4 bg-primary rounded-xl shadow-md hover:shadow-lg flex flex-col items-center justify-center transition duration-200 ease-in-out"
        onClick={onClick}
      >
        <span className="text-4xl mb-2">💩</span>
        <h3 className="text-secondary font-bold text-2xl mb-1">{t('log_button').toUpperCase()}</h3>
        <p className="text-secondary/80">{t('feature_grid_title')}</p>
      </Button>
    </div>
  );
}
