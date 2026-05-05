import React from 'react';
import { Page } from '../types';
import { Theme } from '../App';
import { LeafIcon, MoonIcon, SunIcon } from './icons/IconComponents';

interface HeaderProps {
  navigateTo: (page: Page) => void;
  currentPage: Page;
  theme: Theme;
  toggleTheme: () => void;
}

const navItems: { page: Page; label: string }[] = [
    { page: 'dashboard', label: 'Dashboard' },
    { page: 'garden', label: 'Garden' },
    { page: 'homeCanvas', label: 'Home Canvas' },
    { page: 'smartHome', label: 'Smart Home' },
    { page: 'maintenance', label: 'Maintenance' },
    { page: 'budget', label: 'Budget' },
    { page: 'timeline', label: 'Timeline' },
    { page: 'sustainability', label: 'Sustainability' },
    { page: 'summary', label: 'Summary' },
];

const Header: React.FC<HeaderProps> = ({ navigateTo, currentPage, theme, toggleTheme }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md dark:shadow-none sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigateTo('landing')}>
            <LeafIcon className="h-8 w-8 text-eco-green-dark" />
            <h1 className="ml-2 text-xl font-bold text-eco-green-dark dark:text-eco-green">Renova</h1>
          </div>
          <div className="flex items-center">
            <nav className="hidden md:flex space-x-1 lg:space-x-4">
              {navItems.map((item) => {
                const isActive = (item.page === 'dashboard' && currentPage === 'landing') || currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => navigateTo(item.page)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-eco-green-light text-eco-green-dark dark:bg-gray-700 dark:text-white'
                        : 'text-gray-600 hover:bg-eco-green-light hover:text-eco-green-dark dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </nav>
            <button
              onClick={toggleTheme}
              className="ml-6 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eco-green-dark dark:focus:ring-offset-gray-800"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-6 w-6" />
              ) : (
                <SunIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;