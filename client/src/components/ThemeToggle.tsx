import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export default function ThemeToggle({ showLabel = true, className = "" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Prevent hydration mismatch by not rendering until client-side
  if (!mounted) return null;
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {showLabel && (
        <div className="flex items-center gap-3">
          {theme === "dark" ? (
            <Moon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Sun className="h-5 w-5 text-muted-foreground" />
          )}
          <Label htmlFor="theme-toggle">
            {theme === "dark" ? "Dark Mode" : "Light Mode"}
          </Label>
        </div>
      )}
      
      <Switch 
        id="theme-toggle" 
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
      />
    </div>
  );
}