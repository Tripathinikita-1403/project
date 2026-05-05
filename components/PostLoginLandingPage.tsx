import React from 'react';
import { Page } from '../types';
import { Theme } from '../App';
import UserDashboard from './UserDashboard';

interface PostLoginLandingPageProps {
  navigateTo: (page: Page) => void;
  theme: Theme;
}

const PostLoginLandingPage: React.FC<PostLoginLandingPageProps> = ({ navigateTo, theme }) => {
  // This component acts as the main landing area after login,
  // which is the User Dashboard.
  return <UserDashboard navigateTo={navigateTo} theme={theme} />;
};

export default PostLoginLandingPage;