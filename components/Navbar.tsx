import React, { useState, useEffect } from 'react';
import { NavItem } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'আমাদের সম্পর্কে', href: 'about' },
  { label: 'ইতিহাস', href: 'history' },
  { label: 'ইভেন্ট', href: 'events' },
  { label: 'গ্যালারি', href: 'gallery' },
  { label: 'ঘোষণা', href: 'announcements', isPage: true },
];

export const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: NavItem) => {
    if (!item) return;
    if (item.isPage) {
      navigate(`/${item.href}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation then scroll
        setTimeout(() => {
          const element = document.getElementById(item.href);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById(item.href);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled ? 'bg-black/95 shadow-lg py-2' : 'bg-gradient-to-b from-black/80 to-transparent pt-6 pb-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <button onClick={handleHomeClick} className="bg-primary text-white font-bold px-6 py-2 uppercase tracking-widest text-sm hover:bg-red-700 transition-colors rounded-sm font-sans">
              হোম
            </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className="text-white/80 hover:text-primary px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider transition-colors bg-transparent border-none cursor-pointer font-sans"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="text-white hover:text-primary transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              <span className="material-icons">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <span className="material-icons">menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div className={`fixed top-0 right-0 w-[280px] h-full bg-surface-light dark:bg-surface-dark z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark">
            <span className="text-xl font-header font-bold text-primary">মেনু</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-primary transition-colors"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="w-full flex items-center px-4 py-3 text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all font-sans"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="p-6 border-t border-border-light dark:border-border-dark">
            <button
              onClick={handleHomeClick}
              className="w-full bg-primary text-white font-bold py-3 rounded-lg uppercase tracking-widest text-sm hover:bg-primary-hover transition-colors"
            >
              হোম পেজ
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};