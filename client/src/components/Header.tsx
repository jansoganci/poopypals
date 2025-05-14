import { Settings, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' }
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  
  return (
    <header className="sticky top-0 z-50 p-4 bg-background rounded-b-xl shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-3xl">💩</span>
          <h1 className="text-secondary text-2xl font-bold">{t('app_name')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 text-secondary rounded-full hover:bg-primary/20">
                <Globe size={22} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <Select value={i18n.language} onValueChange={changeLanguage}>
                <SelectTrigger>
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
            </PopoverContent>
          </Popover>
        
          <button 
            className="p-2 text-secondary rounded-full hover:bg-primary/20"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mounted && (
              theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />
            )}
          </button>
          
          <button className="p-2 text-secondary rounded-full hover:bg-primary/20">
            <Settings size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
