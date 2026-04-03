import { Navbar } from '../components/Navbar';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useTheme } from '../components/theme-provider';
import { Moon, Sun, Monitor, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const currentTheme = themeOptions.find((opt) => opt.value === theme) || themeOptions[2];
  const ThemeIcon = currentTheme.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto py-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
            <p className="text-lg text-muted-foreground">Appearance and preferences</p>
          </div>

          <div className="border rounded-lg p-6 max-w-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Appearance</Label>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[140px] justify-between">
                    <div className="flex items-center gap-2">
                      <ThemeIcon className="h-4 w-4" />
                      <span>{currentTheme.label}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {themeOptions.map((option) => {
                    const OptionIcon = option.icon;
                    return (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={cn(
                          'flex items-center gap-2',
                          theme === option.value && 'bg-accent',
                        )}
                      >
                        <OptionIcon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
