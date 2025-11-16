import { useState, useEffect } from 'react';
import { Label } from './ui/label';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useTheme } from './theme-provider';
import { Moon, Sun, Monitor, ChevronDown, X, Mail } from 'lucide-react';
import { cn } from '../lib/utils';
import { backendApi } from '../lib/models/Base';
import type { GetUserResponse } from '../lib/models/Schemas';

type SettingsSection = 'general' | 'account';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const { theme, setTheme } = useTheme();
  const [userData, setUserData] = useState<GetUserResponse | null>(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchUserData = async () => {
      if (activeSection === 'account') {
        setLoading(true);
        try {
          const response = await backendApi<never, GetUserResponse>('GET', '/user/me', true);
          if (response) {
            setUserData(response);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [activeSection]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl h-[42vh] max-h-[90vh] overflow-hidden flex flex-col p-0 translate-y-[-60%]" 
        hideCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex gap-0 overflow-hidden flex-1">
          {/* Left Sidebar Navigation */}
          <div className="w-36 flex-shrink-0 flex flex-col p-3">
            <div className="mb-4">
              <DialogPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm opacity-70 hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogPrimitive.Close>
            </div>
            <nav className="space-y-1 flex-1 overflow-y-auto">
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

          {/* Content Area with Title */}
          <div className="flex-1 min-w-0 flex flex-col bg-muted/20 overflow-hidden">
            <DialogHeader className="py-4 px-4 flex-shrink-0 border-b-2 border-border">
              <DialogTitle className="text-2xl">
                {sections.find(s => s.id === activeSection)?.label || 'Settings'}
              </DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex-1 overflow-y-auto">
            {activeSection === 'general' && (
              <div className="space-y-0">
                {/* Appearance Section */}
                <div className="py-4 border-b border-border">
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
              <div className="space-y-0">
                {loading ? (
                  <div className="py-6 border-b border-border">
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  </div>
                ) : userData && userData.success && userData.user ? (
                  <>
                    <div className="py-4 border-b border-border">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Email</Label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-foreground">{userData.user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-4 border-b border-border">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Created</Label>
                        <p className="text-sm text-foreground">
                          {new Date(userData.user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="py-4 border-b border-border">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          // TODO: Implement delete account functionality
                        }}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="py-6 border-b border-border">
                    <p className="text-sm text-muted-foreground">
                      Failed to load account information.
                    </p>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

