import React, { useState, useCallback, useEffect } from 'react';
import { Page } from './types';
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';
import GardenPlanner from './components/GardenPlanner';
import SmartHomePlanner from './components/SmartHomePlanner';
import MaintenanceTracker from './components/MaintenanceTracker';
import BudgetPlanner from './components/BudgetPlanner';
import ProjectTimeline from './components/ProjectTimeline';
import SustainabilityDashboard from './components/SustainabilityDashboard';
import ProjectSummary from './components/ProjectSummary';
import Header from './components/Header';
import PostLoginLandingPage from './components/PostLoginLandingPage';
import HomeCanvas from './components/HomeCanvas';

export type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) return savedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('landing');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'landing':
        return <PostLoginLandingPage navigateTo={navigateTo} theme={theme} />;
      case 'dashboard':
        return <UserDashboard navigateTo={navigateTo} theme={theme} />;
      case 'garden':
        return <GardenPlanner />;
      case 'smartHome':
        return <SmartHomePlanner theme={theme} />;
      case 'maintenance':
        return <MaintenanceTracker />;
      case 'budget':
        return <BudgetPlanner theme={theme} />;
      case 'timeline':
        return <ProjectTimeline />;
      case 'sustainability':
        return <SustainabilityDashboard theme={theme} />;
      case 'summary':
        return <ProjectSummary theme={theme} />;
      case 'homeCanvas':
        return <HomeCanvas theme={theme} />;
      default:
        return <PostLoginLandingPage navigateTo={navigateTo} theme={theme} />;
    }
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="bg-eco-grey dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200">
      <Header navigateTo={navigateTo} currentPage={currentPage} theme={theme} toggleTheme={toggleTheme} />
      <main className='p-4 sm:p-6 lg:p-8'>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;