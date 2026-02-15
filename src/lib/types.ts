export interface Staff {
  id: string;
  name: string;
  role: string;
  yearlySalary: number;
  hourlyRate: number;
  contact: string;
  joiningDate: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Half-Day';

export interface Attendance {
  id: string;
  staffId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  hoursWorked?: number;
}

export interface Activity {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  notes: string;
  staffIds: string[];
}

export interface Expense {
  id: string;
  service: string;
  amount: number;
  date: string; // YYYY-MM-DD
}

export interface Payment {
  id: string;
  staffId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface FarmData {
  staff: Staff[];
  attendance: Attendance[];
  activities: Activity[];
  expenses: Expense[];
  payments: Payment[];
}
