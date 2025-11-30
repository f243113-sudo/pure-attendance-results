// Storage utility functions for localStorage operations

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  class?: string;
  subject?: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: 'present' | 'absent';
  markedBy: string;
}

export interface ResultRecord {
  studentId: string;
  subject: string;
  marks: number;
  maxMarks: number;
  uploadedBy: string;
  uploadedAt: string;
}

const USERS_KEY = 'portal_users';
const ATTENDANCE_KEY = 'portal_attendance';
const RESULTS_KEY = 'portal_results';
const CURRENT_USER_KEY = 'portal_current_user';

// Initialize with dummy data if not exists
export const initializeStorage = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultUsers: User[] = [
      { id: '1', username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
      { id: '2', username: 'teacher1', password: 'teacher123', role: 'teacher', name: 'John Smith', subject: 'Mathematics' },
      { id: '3', username: 'teacher2', password: 'teacher123', role: 'teacher', name: 'Sarah Johnson', subject: 'Science' },
      { id: '4', username: 'student1', password: 'student123', role: 'student', name: 'Alice Brown', class: '10-A' },
      { id: '5', username: 'student2', password: 'student123', role: 'student', name: 'Bob Wilson', class: '10-A' },
      { id: '6', username: 'student3', password: 'student123', role: 'student', name: 'Carol Davis', class: '10-B' },
      { id: '7', username: 'student4', password: 'student123', role: 'student', name: 'David Lee', class: '10-B' },
      { id: '8', username: 'student5', password: 'student123', role: 'student', name: 'Emma White', class: '10-A' },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem(ATTENDANCE_KEY)) {
    const defaultAttendance: AttendanceRecord[] = [
      { studentId: '4', date: '2024-01-15', status: 'present', markedBy: '2' },
      { studentId: '5', date: '2024-01-15', status: 'present', markedBy: '2' },
      { studentId: '6', date: '2024-01-15', status: 'absent', markedBy: '2' },
      { studentId: '4', date: '2024-01-16', status: 'present', markedBy: '2' },
      { studentId: '5', date: '2024-01-16', status: 'absent', markedBy: '2' },
      { studentId: '6', date: '2024-01-16', status: 'present', markedBy: '2' },
    ];
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(defaultAttendance));
  }

  if (!localStorage.getItem(RESULTS_KEY)) {
    const defaultResults: ResultRecord[] = [
      { studentId: '4', subject: 'Mathematics', marks: 85, maxMarks: 100, uploadedBy: '2', uploadedAt: '2024-01-10' },
      { studentId: '4', subject: 'Science', marks: 78, maxMarks: 100, uploadedBy: '3', uploadedAt: '2024-01-10' },
      { studentId: '5', subject: 'Mathematics', marks: 92, maxMarks: 100, uploadedBy: '2', uploadedAt: '2024-01-10' },
      { studentId: '5', subject: 'Science', marks: 88, maxMarks: 100, uploadedBy: '3', uploadedAt: '2024-01-10' },
    ];
    localStorage.setItem(RESULTS_KEY, JSON.stringify(defaultResults));
  }
};

// User operations
export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getUserById = (id: string): User | undefined => {
  return getUsers().find(u => u.id === id);
};

export const getUsersByRole = (role: UserRole): User[] => {
  return getUsers().filter(u => u.role === role);
};

export const createUser = (user: Omit<User, 'id'>): User => {
  const users = getUsers();
  const newUser = { ...user, id: Date.now().toString() };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

export const deleteUser = (id: string): void => {
  const users = getUsers().filter(u => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Auth operations
export const login = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

// Attendance operations
export const getAttendance = (): AttendanceRecord[] => {
  const data = localStorage.getItem(ATTENDANCE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getStudentAttendance = (studentId: string): AttendanceRecord[] => {
  return getAttendance().filter(a => a.studentId === studentId);
};

export const saveAttendance = (records: AttendanceRecord[]): void => {
  const existing = getAttendance();
  // Remove existing records for the same date and students
  const filtered = existing.filter(e => 
    !records.some(r => r.studentId === e.studentId && r.date === e.date)
  );
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify([...filtered, ...records]));
};

export const calculateAttendancePercentage = (studentId: string): number => {
  const records = getStudentAttendance(studentId);
  if (records.length === 0) return 0;
  const present = records.filter(r => r.status === 'present').length;
  return Math.round((present / records.length) * 100);
};

// Results operations
export const getResults = (): ResultRecord[] => {
  const data = localStorage.getItem(RESULTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getStudentResults = (studentId: string): ResultRecord[] => {
  return getResults().filter(r => r.studentId === studentId);
};

export const saveResult = (result: ResultRecord): void => {
  const results = getResults();
  // Update if exists, otherwise add
  const existingIndex = results.findIndex(
    r => r.studentId === result.studentId && r.subject === result.subject
  );
  if (existingIndex >= 0) {
    results[existingIndex] = result;
  } else {
    results.push(result);
  }
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
};

export const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

export const calculateTotalAndGrade = (results: ResultRecord[]): { total: number; maxTotal: number; percentage: number; grade: string } => {
  const total = results.reduce((sum, r) => sum + r.marks, 0);
  const maxTotal = results.reduce((sum, r) => sum + r.maxMarks, 0);
  const percentage = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
  const grade = calculateGrade(percentage);
  return { total, maxTotal, percentage, grade };
};
