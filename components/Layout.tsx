
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from './common/Button';
import LogoutIcon from './icons/LogoutIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
               <BriefcaseIcon className="h-8 w-8 text-blue-600"/>
              <span className="text-2xl font-bold">LeaveManager</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block">Welcome, <span className="font-semibold">{currentUser?.name}</span></span>
              <Button onClick={handleLogout} variant="secondary">
                <LogoutIcon className="h-5 w-5" />
                <span className="hidden sm:block">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
