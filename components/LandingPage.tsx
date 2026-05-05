import React, { useState } from 'react';
import { LeafIcon } from './icons/IconComponents';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('anantika12345@gmail.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-eco-grey dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in">
        
        {/* Left side - Visual and branding */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-eco-green to-sky-blue text-white flex flex-col justify-between relative">
          <div className="absolute top-0 left-0 w-full h-full bg-no-repeat opacity-10" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
          <div className="z-10">
            <div className="flex items-center text-3xl font-bold">
              <LeafIcon className="w-10 h-10 mr-3"/>
              Renova
            </div>
            <p className="mt-4 text-lg opacity-90">
              Transform your house into a smart, sustainable home.
            </p>
          </div>
          <div className="z-10 mt-8">
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight">Plan Your<br/>Green Renovation<br/>Today.</h2>
          </div>
          <div className="z-10 text-sm opacity-80 mt-8">
             &copy; {new Date().getFullYear()} Renova. All rights reserved.
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Welcome Back!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Please sign in to continue.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-eco-green-dark"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-eco-green-dark"
                required
              />
               <a href="#" className="text-xs text-eco-green-dark hover:underline mt-2 inline-block">
                Forgot Password?
              </a>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-eco-green-dark text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Log In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            Don't have an account? <a href="#" className="font-bold text-eco-green-dark hover:underline">Sign up now</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;