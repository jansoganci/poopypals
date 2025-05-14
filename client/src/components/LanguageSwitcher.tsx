import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' }
];

interface LanguageSwitcherProps {
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export default function LanguageSwitcher({ 
  showIcon = true, 
  showLabel = true, 
  className = ""
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  
  // Prevent hydration mismatch by not rendering until client-side
  if (!mounted) return null;
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {(showIcon || showLabel) && (
        <div className="flex items-center gap-2">
          {showIcon && <Globe className="h-5 w-5 text-muted-foreground" />}
          {showLabel && <Label>{t('language')}</Label>}
        </div>
      )}
      
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder={t('language')} />
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}