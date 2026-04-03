import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { isLoggedIn } from '../lib/helpers/Auth';
import { ThemeToggle } from './theme-toggle';
import { Twitter, Github, Linkedin } from 'lucide-react';

const SOCIAL_TWITTER = import.meta.env.VITE_SOCIAL_TWITTER ?? '#';
const SOCIAL_GITHUB = import.meta.env.VITE_SOCIAL_GITHUB ?? '#';
const SOCIAL_LINKEDIN = import.meta.env.VITE_SOCIAL_LINKEDIN ?? '#';

function SocialNavLinks() {
  const linkClass =
    'inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground';
  return (
    <>
      <a
        href={SOCIAL_TWITTER}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        aria-label="Twitter"
      >
        <Twitter className="h-4 w-4" />
      </a>
      <a
        href={SOCIAL_GITHUB}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        aria-label="GitHub"
      >
        <Github className="h-4 w-4" />
      </a>
      <a
        href={SOCIAL_LINKEDIN}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        aria-label="LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </a>
    </>
  );
}

function ThemeWithSocial() {
  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <SocialNavLinks />
      <ThemeToggle />
    </div>
  );
}

export function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());

    const handleStorageChange = () => {
      setLoggedIn(isLoggedIn());
    };

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

  return (
    <nav className="bg-background sticky top-0 z-50 transition-colors duration-300">
      <div className="mx-auto w-full max-w-[672px] px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + primary nav */}
          <div className="flex shrink-0 items-center gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'italic font-bold text-lg tracking-tight text-foreground underline-offset-4 transition-colors',
                  isActive ? 'underline' : 'no-underline hover:underline',
                )
              }
              aria-label="Home"
            >
              DA
            </NavLink>
            <NavLink
              to="/ideas"
              className={({ isActive }) =>
                cn(
                  'text-sm underline-offset-4 transition-colors',
                  isActive
                    ? 'text-foreground underline'
                    : 'text-muted-foreground hover:text-foreground hover:underline',
                )
              }
            >
              Ideas
            </NavLink>
            <NavLink
              to="/about"
              end
              className={({ isActive }) =>
                cn(
                  'text-sm underline-offset-4 transition-colors',
                  isActive
                    ? 'text-foreground underline'
                    : 'text-muted-foreground hover:text-foreground hover:underline',
                )
              }
            >
              About
            </NavLink>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!loggedIn && (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
            <ThemeWithSocial />
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">
            {!loggedIn && (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
            )}
            <ThemeWithSocial />
          </div>
        </div>
      </div>
    </nav>
  );
}
