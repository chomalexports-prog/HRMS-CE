import { 
  Employee, 
  LeaveRequest, 
  AttendanceLog, 
  EmployeeDocument, 
  JobOpening, 
  Candidate, 
  Asset, 
  Appraisal, 
  HRNotification, 
  EmailCampaign,
  AuthUser
} from './types';

// ─── Admin Account ────────────────────────────────────────────────────────────
// Default administrator; stored separately from employee directory.
export const ADMIN_AUTH_USER: AuthUser = {
  id: 'admin-001',
  name: 'Admin',
  email: 'admin@hrms-ce.com',
  role: 'admin',
  avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Admin&backgroundColor=4f46e5&fontFamily=Helvetica&fontSize=42&fontWeight=700&textColor=ffffff',
  department: 'Administration',
  jobTitle: 'System Administrator',
};

export const ADMIN_PASSWORD = 'admin123';

// ─── Starter Employees ─────────────────────────────────────────────────────────
export const initialEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Sarah Johnson',
    email: 'sarah@hrms-ce.com',
    password: 'sarah123',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Sarah+Johnson&backgroundColor=0ea5e9&fontFamily=Helvetica&fontSize=42&fontWeight=700&textColor=ffffff',
    role: 'HR Manager',
    department: 'Human Resources',
    status: 'Active',
    contact: '+91-9876543210',
    hireDate: '2022-03-15',
    salary: { basic: 75000, hra: 18750, allowances: 8000, deductions: 5500 },
  },
  {
    id: 'EMP-002',
    name: 'Alex Chen',
    email: 'alex@hrms-ce.com',
    password: 'alex123',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Alex+Chen&backgroundColor=10b981&fontFamily=Helvetica&fontSize=42&fontWeight=700&textColor=ffffff',
    role: 'Senior Engineer',
    department: 'Engineering',
    status: 'Active',
    contact: '+91-9876541234',
    hireDate: '2021-07-01',
    salary: { basic: 95000, hra: 23750, allowances: 10000, deductions: 7200 },
  },
  {
    id: 'EMP-003',
    name: 'Priya Patel',
    email: 'priya@hrms-ce.com',
    password: 'priya123',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Priya+Patel&backgroundColor=f59e0b&fontFamily=Helvetica&fontSize=42&fontWeight=700&textColor=ffffff',
    role: 'Product Manager',
    department: 'Product',
    status: 'Active',
    contact: '+91-9812345678',
    hireDate: '2023-01-10',
    salary: { basic: 85000, hra: 21250, allowances: 9000, deductions: 6500 },
  },
  {
    id: 'EMP-004',
    name: 'Marcus Rivera',
    email: 'marcus@hrms-ce.com',
    password: 'marcus123',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Marcus+Rivera&backgroundColor=8b5cf6&fontFamily=Helvetica&fontSize=42&fontWeight=700&textColor=ffffff',
    role: 'Marketing Lead',
    department: 'Marketing',
    status: 'On Leave',
    contact: '+91-9654321098',
    hireDate: '2022-09-20',
    salary: { basic: 70000, hra: 17500, allowances: 7500, deductions: 5000 },
  },
  {
    id: 'EMP-005',
    name: 'Nadia Osei',
    email: 'nadia@hrms-ce.com',
    password: 'nadia123',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Nadia+Osei&backgroundColor=ef4444&fontFamily=Helvetica&fontSize=42&fontWeight=700&textColor=ffffff',
    role: 'UI/UX Designer',
    department: 'Design',
    status: 'Active',
    contact: '+91-9765432109',
    hireDate: '2023-06-01',
    salary: { basic: 68000, hra: 17000, allowances: 7000, deductions: 4800 },
  },
];

// ─── Leave Requests ────────────────────────────────────────────────────────────
export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'LR-001', employeeId: 'EMP-001', employeeName: 'Sarah Johnson',
    leaveType: 'Casual Leave', startDate: '2026-08-20', endDate: '2026-08-22',
    reason: 'Family function', status: 'Pending', days: 3,
  },
  {
    id: 'LR-002', employeeId: 'EMP-004', employeeName: 'Marcus Rivera',
    leaveType: 'Medical Leave', startDate: '2026-08-15', endDate: '2026-08-19',
    reason: 'Recovering from surgery', status: 'Approved', days: 5,
  },
  {
    id: 'LR-003', employeeId: 'EMP-002', employeeName: 'Alex Chen',
    leaveType: 'Annual Leave', startDate: '2026-09-01', endDate: '2026-09-05',
    reason: 'Vacation', status: 'Pending', days: 5,
  },
  {
    id: 'LR-004', employeeId: 'EMP-003', employeeName: 'Priya Patel',
    leaveType: 'Casual Leave', startDate: '2026-07-28', endDate: '2026-07-28',
    reason: 'Personal errand', status: 'Approved', days: 1,
  },
];

// ─── Attendance Logs ──────────────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0];
export const initialAttendanceLogs: AttendanceLog[] = [
  { id: 'ATT-001', employeeId: 'EMP-001', employeeName: 'Sarah Johnson',   date: today, checkIn: '09:02', checkOut: null,    status: 'Present' },
  { id: 'ATT-002', employeeId: 'EMP-002', employeeName: 'Alex Chen',       date: today, checkIn: '08:55', checkOut: null,    status: 'Present' },
  { id: 'ATT-003', employeeId: 'EMP-003', employeeName: 'Priya Patel',     date: today, checkIn: '09:30', checkOut: null,    status: 'Late'    },
  { id: 'ATT-004', employeeId: 'EMP-004', employeeName: 'Marcus Rivera',   date: today, checkIn: '',      checkOut: null,    status: 'On Leave'},
  { id: 'ATT-005', employeeId: 'EMP-005', employeeName: 'Nadia Osei',      date: today, checkIn: '09:05', checkOut: null,    status: 'Present' },
];

// ─── Documents ────────────────────────────────────────────────────────────────
export const initialDocuments: EmployeeDocument[] = [
  { id: 'DOC-001', employeeId: 'EMP-001', name: 'Employment Contract', category: 'Contract',  uploadDate: '2022-03-15', size: '245 KB' },
  { id: 'DOC-002', employeeId: 'EMP-002', name: 'Aadhaar Card',        category: 'ID Proof',  uploadDate: '2021-07-01', size: '182 KB' },
  { id: 'DOC-003', employeeId: 'EMP-003', name: 'MBA Certificate',     category: 'Certificate', uploadDate: '2023-01-10', size: '310 KB' },
];

// ─── Job Openings ─────────────────────────────────────────────────────────────
export const initialJobOpenings: JobOpening[] = [
  { id: 'JOB-001', title: 'Frontend Engineer',     department: 'Engineering', location: 'Remote',    type: 'Full-time', status: 'Active', applicantsCount: 12 },
  { id: 'JOB-002', title: 'HR Business Partner',   department: 'HR',          location: 'Mumbai',    type: 'Full-time', status: 'Active', applicantsCount: 7  },
  { id: 'JOB-003', title: 'UX Researcher',          department: 'Design',      location: 'Bangalore', type: 'Contract',  status: 'Active', applicantsCount: 4  },
];

// ─── Candidates ───────────────────────────────────────────────────────────────
export const initialCandidates: Candidate[] = [
  { id: 'CND-001', name: 'Rohan Mehta',  email: 'rohan@example.com', phone: '+91-9900001111', jobId: 'JOB-001', jobTitle: 'Frontend Engineer',   stage: 'Interview', appliedDate: '2026-08-10' },
  { id: 'CND-002', name: 'Ananya Roy',   email: 'ananya@example.com', phone: '+91-9900002222', jobId: 'JOB-002', jobTitle: 'HR Business Partner',  stage: 'Applied',   appliedDate: '2026-08-12' },
  { id: 'CND-003', name: 'David Kim',    email: 'david@example.com',  phone: '+91-9900003333', jobId: 'JOB-001', jobTitle: 'Frontend Engineer',   stage: 'Offered',   appliedDate: '2026-08-05' },
];

// ─── Assets ───────────────────────────────────────────────────────────────────
export const initialAssets: Asset[] = [
  { id: 'AST-001', name: 'MacBook Pro 14"', serialNumber: 'MBP-XZ9001', category: 'Laptop',  status: 'Assigned',  assignedToId: 'EMP-002', assignedToName: 'Alex Chen',     purchaseDate: '2021-08-01' },
  { id: 'AST-002', name: 'Dell UltraSharp', serialNumber: 'DLU-MN2340', category: 'Monitor', status: 'Assigned',  assignedToId: 'EMP-001', assignedToName: 'Sarah Johnson',  purchaseDate: '2022-04-10' },
  { id: 'AST-003', name: 'iPhone 15 Pro',   serialNumber: 'IPH-KL7890', category: 'Mobile',  status: 'Assigned',  assignedToId: 'EMP-004', assignedToName: 'Marcus Rivera', purchaseDate: '2023-02-20' },
  { id: 'AST-004', name: 'Logitech MX Keys', serialNumber: 'LGT-PQ5566', category: 'Other',  status: 'Available', purchaseDate: '2023-05-15' },
];

// ─── Appraisals ───────────────────────────────────────────────────────────────
export const initialAppraisals: Appraisal[] = [
  {
    id: 'APR-001', employeeId: 'EMP-001', employeeName: 'Sarah Johnson',
    reviewerName: 'Admin', period: 'Q2 2026',
    goalsSet: 'Improve onboarding process, reduce time-to-hire by 20%',
    selfRating: 4, managerRating: 4,
    feedback: 'Sarah has made significant improvements to the HR onboarding pipeline.',
    status: 'Approved', date: '2026-07-15',
  },
  {
    id: 'APR-002', employeeId: 'EMP-002', employeeName: 'Alex Chen',
    reviewerName: 'Admin', period: 'Q2 2026',
    goalsSet: 'Ship 3 major product features, mentoring junior engineers',
    selfRating: 5, managerRating: 4,
    feedback: 'Alex consistently delivers high quality code and great team leadership.',
    status: 'Approved', date: '2026-07-15',
  },
  {
    id: 'APR-003', employeeId: 'EMP-003', employeeName: 'Priya Patel',
    reviewerName: 'Admin', period: 'Q2 2026',
    goalsSet: 'Launch v2 roadmap, improve cross-team collaboration',
    selfRating: 4, managerRating: 3,
    feedback: 'Good execution on roadmap but collaboration with engineering can improve.',
    status: 'Submitted', date: '2026-07-20',
  },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const initialNotifications: HRNotification[] = [
  { id: 'NTF-001', title: 'Leave Request Pending',   message: 'Sarah Johnson has submitted a 3-day casual leave request.', date: '09:15', type: 'leave',     read: false },
  { id: 'NTF-002', title: 'New Job Application',     message: 'Rohan Mehta applied for Frontend Engineer position.',        date: '08:40', type: 'recruitment', read: false },
  { id: 'NTF-003', title: 'Payroll Ready',            message: 'August payroll calculations are ready for approval.',         date: 'Yesterday', type: 'payroll', read: true  },
];

// ─── Email Campaigns ──────────────────────────────────────────────────────────
export const initialEmailCampaigns: EmailCampaign[] = [
  {
    id: 'ECP-001',
    name: 'Personalized Birthday Wish',
    triggerType: 'Birthday',
    subject: 'Happy Birthday, {{employee_name}}! 🎂',
    templateBody: 'Hi {{employee_name}},\n\nWishing you a fantastic birthday from all of us! Thank you for bringing your energy and talent to the team every single day. We hope your year ahead is filled with joy, growth, and happiness.\n\nEnjoy your special day!\n\nBest Wishes,\nYour HR Team',
    active: true
  },
  {
    id: 'ECP-002',
    name: 'Work Anniversary Milestone',
    triggerType: 'Anniversary',
    subject: 'Congratulations on {{years}} Years with Us!',
    templateBody: 'Hi {{employee_name}},\n\nHappy Work Anniversary! Today marks {{years}} year(s) since you joined us. We are incredibly grateful for your dedication, great work, and positive impact on the team. We look forward to achieving many more milestones together!\n\nWarmly,\nYour HR Team',
    active: true
  },
  {
    id: 'ECP-003',
    name: 'Monthly Payslip Notification',
    triggerType: 'Payslip',
    subject: 'Your Payslip for {{month}} is Available',
    templateBody: 'Hello {{employee_name}},\n\nYour payslip for the month of {{month}} is now available for download.\n\nNet Pay Credited: ${{net_pay}}\nPayment Date: {{pay_date}}\n\nYou can access detailed deductions and breakdowns by logging into your Employee Self-Service portal anytime.\n\nBest regards,\nFinance Department',
    active: true
  },
  {
    id: 'ECP-004',
    name: 'New Hire Onboarding Welcome',
    triggerType: 'Welcome',
    subject: 'Welcome to the Team, {{employee_name}}!',
    templateBody: 'Welcome to the team, {{employee_name}}!\n\nWe are thrilled to have you join us as our new {{role}} in the {{department}} department.\n\nYour official start date is {{hire_date}}. On your first day, you will meet with your onboarding manager to review team guidelines, access setups, and receive your equipment.\n\nLet\'s build something great together!\n\nCheers,\nThe HR & Executive Team',
    active: false
  }
];


