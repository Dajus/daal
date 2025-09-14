import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocation } from 'wouter';
import { t } from '@/lib/translations';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  
  // Homepage uses white icons, other pages use dark icons
  const isHomepage = location === '/';
  
  const iconClassName = isHomepage 
    ? "w-9 h-9 p-0 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
    : "w-9 h-9 p-0 text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={iconClassName}
      title={theme === 'light' ? t('darkMode') : t('lightMode')}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">{t('toggleTheme')}</span>
    </Button>
  );
}