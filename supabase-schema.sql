-- Supabase Schema for HRMS-CE
-- Run this entire script in your Supabase SQL Editor

-- 1. Employees Table
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT,
  avatar TEXT,
  role TEXT,
  department TEXT,
  status TEXT,
  contact TEXT,
  "hireDate" TEXT,
  salary JSONB
);

-- 2. Leave Requests Table
CREATE TABLE "leaveRequests" (
  id TEXT PRIMARY KEY,
  "employeeId" TEXT NOT NULL,
  "employeeName" TEXT NOT NULL,
  "leaveType" TEXT,
  "startDate" TEXT,
  "endDate" TEXT,
  reason TEXT,
  status TEXT,
  days NUMERIC
);

-- 3. Attendance Logs Table
CREATE TABLE "attendanceLogs" (
  id TEXT PRIMARY KEY,
  "employeeId" TEXT NOT NULL,
  "employeeName" TEXT NOT NULL,
  date TEXT,
  "checkIn" TEXT,
  "checkOut" TEXT,
  status TEXT
);

-- 4. Documents Table
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  "employeeId" TEXT NOT NULL,
  name TEXT,
  category TEXT,
  "uploadDate" TEXT,
  size TEXT
);

-- 5. Job Openings Table
CREATE TABLE "jobOpenings" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  type TEXT,
  status TEXT,
  "applicantsCount" NUMERIC
);

-- 6. Candidates Table
CREATE TABLE candidates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  "jobId" TEXT,
  "jobTitle" TEXT,
  stage TEXT,
  "resumeText" TEXT,
  "aiScore" NUMERIC,
  "aiEvaluation" TEXT,
  "appliedDate" TEXT
);

-- 7. Assets Table
CREATE TABLE assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "serialNumber" TEXT,
  category TEXT,
  status TEXT,
  "assignedToId" TEXT,
  "assignedToName" TEXT,
  "purchaseDate" TEXT
);

-- 8. Appraisals Table
CREATE TABLE appraisals (
  id TEXT PRIMARY KEY,
  "employeeId" TEXT NOT NULL,
  "employeeName" TEXT NOT NULL,
  "reviewerName" TEXT,
  period TEXT,
  "goalsSet" TEXT,
  "selfRating" NUMERIC,
  "managerRating" NUMERIC,
  feedback TEXT,
  status TEXT,
  date TEXT
);

-- 9. Notifications Table
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  date TEXT,
  type TEXT,
  read BOOLEAN DEFAULT false
);

-- 10. Email Campaigns Table
CREATE TABLE "emailCampaigns" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "triggerType" TEXT,
  subject TEXT,
  "templateBody" TEXT,
  active BOOLEAN DEFAULT true
);

-- 11. Password Reset Requests Table
CREATE TABLE "passwordResetRequests" (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  timestamp TEXT,
  status TEXT
);


-- ==========================================
-- ENABLE REALTIME FOR ALL TABLES
-- ==========================================
alter publication supabase_realtime add table employees;
alter publication supabase_realtime add table "leaveRequests";
alter publication supabase_realtime add table "attendanceLogs";
alter publication supabase_realtime add table documents;
alter publication supabase_realtime add table "jobOpenings";
alter publication supabase_realtime add table candidates;
alter publication supabase_realtime add table assets;
alter publication supabase_realtime add table appraisals;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table "emailCampaigns";
alter publication supabase_realtime add table "passwordResetRequests";
