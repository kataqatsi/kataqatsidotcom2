import { useState } from 'react';
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

type SettingsSection = 'general' | 'account';

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const { theme, setTheme } = useTheme();

  const sections = [
    { id: 'general' as const, label: 'General' },
    { id: 'account' as const, label: 'Account' },
  ];

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const currentTheme = themeOptions.find(opt => opt.value === theme) || themeOptions[2];
  const ThemeIcon = currentTheme.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto py-6">
          {/* Row 1: Empty space | Title */}
          <div className="flex gap-6 mb-6">
            <div className="w-64 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {sections.find(s => s.id === activeSection)?.label || 'Settings'}
              </h2>
              <p className="text-lg text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
          </div>

          {/* Row 2: Sidebar | Settings Content */}
          <div className="flex gap-6">
            {/* Left Sidebar Navigation */}
            <div className="w-64 flex-shrink-0">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start',
                      activeSection === section.id && 'bg-accent'
                    )}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.label}
                  </Button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              {activeSection === 'general' && (
                <div className="space-y-6">
                  {/* Appearance Section */}
                  <div className="border rounded-lg p-6">
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
                                  theme === option.value && 'bg-accent'
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
              )}

              {activeSection === 'account' && (
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Account Information
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Account settings coming soon...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

