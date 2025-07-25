import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { useTheme } from './theme-provider';
import logoBlack from '../assets/images/kigri-logo-black.svg';
import logoWhite from '../assets/images/kigri-logo-white.svg';

export function Navbar() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <nav className="bg-background sticky top-0 z-50 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 relative">
            <Link to="/" className="flex items-center">
              <img 
                src={logoBlack} 
                alt="Kigri" 
                className={`h-5 transition-opacity duration-300 ${
                  isDark ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <img 
                src={logoWhite} 
                alt="Kigri" 
                className={`h-5 absolute top-0 left-0 transition-opacity duration-300 ${
                  isDark ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
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
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 