
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { UserRole } from '../types';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import BriefcaseIcon from '../components/icons/BriefcaseIcon';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = login(email);

    if (user) {
      if (user.role === UserRole.ADMIN) {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } else {
      setError('Invalid email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
           <BriefcaseIcon className="h-16 w-16 text-blue-600"/>
        </div>
        <Card>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">Welcome Back</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Sign in to manage your leave.</p>
                {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-6">
                    <Input
                    label="Email Address"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., admin@example.com"
                    required
                    />
                    <Button type="submit" className="w-full">
                    Sign In
                    </Button>
                </form>
                 <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    <p className="font-semibold">Demo Accounts:</p>
                    <ul className="list-disc list-inside mt-2">
                        <li><span className="font-mono">admin@example.com</span> (Admin)</li>
                        <li><span className="font-mono">alice@example.com</span> (Employee)</li>
                        <li><span className="font-mono">bob@example.com</span> (Employee)</li>
                    </ul>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
