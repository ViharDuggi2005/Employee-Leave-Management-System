
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { User, LeaveRequest, UserRole, LeaveStatus, LeaveType } from '../types';
import { MOCK_USERS, MOCK_LEAVE_REQUESTS } from '../constants';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  leaveRequests: LeaveRequest[];
  login: (email: string) => User | null;
  logout: () => void;
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'userName'>) => void;
  updateLeaveRequestStatus: (id: string, status: LeaveStatus, rejectionReason?: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);

  const login = useCallback((email: string): User | null => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addLeaveRequest = useCallback((request: Omit<LeaveRequest, 'id' | 'status' | 'userName'>) => {
    if (!currentUser) return;
    const newRequest: LeaveRequest = {
      ...request,
      id: `lr${Date.now()}`,
      status: LeaveStatus.PENDING,
      userName: currentUser.name,
    };
    setLeaveRequests(prev => [newRequest, ...prev]);
  }, [currentUser]);

  const updateLeaveRequestStatus = useCallback((id: string, status: LeaveStatus, rejectionReason?: string) => {
    setLeaveRequests(prev =>
      prev.map(req => {
        if (req.id === id) {
          // If approved, deduct from leave balance
          if (status === LeaveStatus.APPROVED) {
            const userToUpdate = users.find(u => u.id === req.userId);
            if (userToUpdate && req.leaveType !== LeaveType.UNPAID) {
              const startDate = new Date(req.startDate);
              const endDate = new Date(req.endDate);
              const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
              
              setUsers(currentUsers => currentUsers.map(u => {
                if (u.id === userToUpdate.id) {
                  const newBalances = { ...u.leaveBalances };
                  newBalances[req.leaveType] = (newBalances[req.leaveType] || 0) - diffDays;
                  return { ...u, leaveBalances: newBalances };
                }
                return u;
              }));
            }
          }
          return { ...req, status, rejectionReason };
        }
        return req;
      })
    );
  }, [users]);

  return (
    <AppContext.Provider value={{ currentUser, users, leaveRequests, login, logout, addLeaveRequest, updateLeaveRequestStatus }}>
      {children}
    </AppContext.Provider>
  );
};
