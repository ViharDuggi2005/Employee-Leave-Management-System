
import { User, LeaveRequest, UserRole, LeaveStatus, LeaveType } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    leaveBalances: {},
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: UserRole.EMPLOYEE,
    leaveBalances: {
      [LeaveType.ANNUAL]: 15,
      [LeaveType.SICK]: 8,
    },
  },
  {
    id: '3',
    name: 'Bob Williams',
    email: 'bob@example.com',
    role: UserRole.EMPLOYEE,
    leaveBalances: {
        [LeaveType.ANNUAL]: 20,
        [LeaveType.SICK]: 5,
    },
  },
  {
    id: '4',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: UserRole.EMPLOYEE,
    leaveBalances: {
        [LeaveType.ANNUAL]: 12,
        [LeaveType.SICK]: 10,
    },
  },
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr1',
    userId: '2',
    userName: 'Alice Johnson',
    leaveType: LeaveType.ANNUAL,
    startDate: '2024-08-10',
    endDate: '2024-08-15',
    reason: 'Family vacation to the mountains.',
    status: LeaveStatus.PENDING,
  },
  {
    id: 'lr2',
    userId: '3',
    userName: 'Bob Williams',
    leaveType: LeaveType.SICK,
    startDate: '2024-07-22',
    endDate: '2024-07-22',
    reason: 'Fever and cold.',
    status: LeaveStatus.APPROVED,
  },
  {
    id: 'lr3',
    userId: '4',
    userName: 'Charlie Brown',
    leaveType: LeaveType.UNPAID,
    startDate: '2024-09-01',
    endDate: '2024-09-05',
    reason: 'Personal reasons, attending a workshop.',
    status: LeaveStatus.PENDING,
  },
  {
    id: 'lr4',
    userId: '2',
    userName: 'Alice Johnson',
    leaveType: LeaveType.ANNUAL,
    startDate: '2024-06-01',
    endDate: '2024-06-03',
    reason: 'Short trip.',
    status: LeaveStatus.REJECTED,
    rejectionReason: 'Project deadline approaching, critical phase.',
  },
];
