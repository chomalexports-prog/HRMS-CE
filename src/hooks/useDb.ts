import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
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
  PasswordResetRequest
} from '../types';

export function useDb() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [notifications, setNotifications] = useState<HRNotification[]>([]);
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);
  const [passwordResetRequests, setPasswordResetRequests] = useState<PasswordResetRequest[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Array of tables to subscribe to
    const tables = [
      { name: 'employees', setter: setEmployees },
      { name: 'leaveRequests', setter: setLeaveRequests },
      { name: 'attendanceLogs', setter: setAttendanceLogs },
      { name: 'documents', setter: setDocuments },
      { name: 'jobOpenings', setter: setJobOpenings },
      { name: 'candidates', setter: setCandidates },
      { name: 'assets', setter: setAssets },
      { name: 'appraisals', setter: setAppraisals },
      { name: 'notifications', setter: setNotifications },
      { name: 'emailCampaigns', setter: setEmailCampaigns },
      { name: 'passwordResetRequests', setter: setPasswordResetRequests }
    ];

    let initializedCount = 0;
    
    // Fetch initial data and setup subscriptions
    const setup = async () => {
      for (const { name, setter } of tables) {
        // 1. Initial fetch
        const { data, error: fetchErr } = await supabase.from(name).select('*');
        if (fetchErr) {
          console.error(`Error fetching ${name}:`, fetchErr);
          setError(`Failed to connect to Supabase database. Please check your configuration and ensure you ran the setup SQL script.`);
          setLoading(false);
          return;
        }
        (setter as any)(data || []);
        
        initializedCount++;
        if (initializedCount === tables.length) {
          setLoading(false);
          setError(null);
        }

        // 2. Setup real-time subscription
        supabase.channel(`public:${name}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: name }, payload => {
            (setter as any)((prev: any[]) => {
              if (payload.eventType === 'INSERT') {
                return [...prev, payload.new];
              }
              if (payload.eventType === 'UPDATE') {
                return prev.map(item => item.id === payload.new.id ? payload.new : item);
              }
              if (payload.eventType === 'DELETE') {
                return prev.filter(item => item.id !== payload.old.id);
              }
              return prev;
            });
          })
          .subscribe();
      }
    };

    setup();

    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  // Generic CRUD helpers
  const addRecord = async (col: string, id: string, data: any) => {
    // Supabase allows explicit ID insertion if the column is not auto-increment
    const { error } = await supabase.from(col).insert({ id, ...data });
    if (error) console.error(`Error adding to ${col}:`, error);
  };

  const updateRecord = async (col: string, id: string, data: any) => {
    const { error } = await supabase.from(col).update(data).eq('id', id);
    if (error) console.error(`Error updating ${col}:`, error);
  };

  const deleteRecord = async (col: string, id: string) => {
    const { error } = await supabase.from(col).delete().eq('id', id);
    if (error) console.error(`Error deleting from ${col}:`, error);
  };

  return {
    employees,
    leaveRequests,
    attendanceLogs,
    documents,
    jobOpenings,
    candidates,
    assets,
    appraisals,
    notifications,
    emailCampaigns,
    passwordResetRequests,
    loading,
    error,
    addRecord,
    updateRecord,
    deleteRecord
  };
}
