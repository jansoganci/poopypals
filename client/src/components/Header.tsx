import { Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return (
    <header className="sticky top-0 z-50 p-4 bg-background rounded-b-xl shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-3xl">💩</span>
          <h1 className="text-secondary text-2xl font-bold">Poopy Pals</h1>
        </div>
        <div className="flex items-center gap-2">
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
