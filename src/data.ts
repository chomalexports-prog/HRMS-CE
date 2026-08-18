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

// ─── Employees ────────────────────────────────────────────────────────────────
export const initialEmployees: Employee[] = [];

// ─── Leave Requests ────────────────────────────────────────────────────────────
export const initialLeaveRequests: LeaveRequest[] = [];

// ─── Attendance Logs ──────────────────────────────────────────────────────────
export const initialAttendanceLogs: AttendanceLog[] = [];

// ─── Documents ────────────────────────────────────────────────────────────────
export const initialDocuments: EmployeeDocument[] = [];

// ─── Job Openings ─────────────────────────────────────────────────────────────
export const initialJobOpenings: JobOpening[] = [];

// ─── Candidates ───────────────────────────────────────────────────────────────
export const initialCandidates: Candidate[] = [];

// ─── Assets ───────────────────────────────────────────────────────────────────
export const initialAssets: Asset[] = [];

// ─── Appraisals ───────────────────────────────────────────────────────────────
export const initialAppraisals: Appraisal[] = [];

// ─── Notifications ────────────────────────────────────────────────────────────
export const initialNotifications: HRNotification[] = [];

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

