import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ThemeToggle } from './theme-toggle';
import { useTheme } from './theme-provider';
import { isLoggedIn, logout } from '../lib/helpers/Auth';
import { SettingsModal } from './SettingsModal';
import { User, Settings, LogOut } from 'lucide-react';
import logoBlack from '../assets/images/sinewax-logo-black.svg';
import logoWhite from '../assets/images/sinewax-logo-white.svg';

export function Navbar() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    // Check login status on mount
    setLoggedIn(isLoggedIn());
    
    // Listen for storage changes (e.g., when user logs in/out in another tab)
    const handleStorageChange = () => {
      setLoggedIn(isLoggedIn());
    };
    
    // Listen for custom auth events (e.g., when user logs in/out in same tab)
    const handleAuthChange = () => {
      setLoggedIn(isLoggedIn());
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  return (
    <nav className="bg-background sticky top-0 z-50 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 relative">
            <Link to="/" className="flex items-center">
              <img 
                src={logoBlack} 
                alt="Sinewax" 
                className={`h-5 transition-opacity duration-300 ${
                  isDark ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <img 
                src={logoWhite} 
                alt="Sinewax" 
                className={`h-5 absolute top-0 left-0 transition-opacity duration-300 ${
                  isDark ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {loggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full p-0 bg-primary/10 hover:bg-primary/20"
                  >
                    <User className="h-5 w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">
            {loggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full p-0 bg-primary/10 hover:bg-primary/20"
                  >
                    <User className="h-5 w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </nav>
  );
} 