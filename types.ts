
export enum UserRole {
  EMPLOYEE = 'employee',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  leaveBalances: {
    [key: string]: number; // e.g., { "Annual": 20, "Sick": 10 }
  };
}

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export enum LeaveType {
    ANNUAL = 'Annual',
    SICK = 'Sick',
    UNPAID = 'Unpaid',
    MATERNITY = 'Maternity',
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  rejectionReason?: string;
}
