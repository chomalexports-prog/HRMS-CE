import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, setDoc, doc, updateDoc, deleteDoc, DocumentData, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
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
  EmailCampaign
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

  useEffect(() => {
    // Array of collections to subscribe to
    const collections = [
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
    const unsubscribes = collections.map(({ name, setter }) => {
      const q = query(collection(db, name));
      return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        (setter as any)(data);
        
        initializedCount++;
        if (initializedCount >= collections.length) {
          setLoading(false);
        }
      }, (error) => {
        console.error(`Error fetching ${name}:`, error);
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  // Generic CRUD helpers
  const addRecord = async (col: string, id: string, data: any) => {
    await setDoc(doc(db, col, id), data);
  };

  const updateRecord = async (col: string, id: string, data: any) => {
    await updateDoc(doc(db, col, id), data);
  };

  const deleteRecord = async (col: string, id: string) => {
    await deleteDoc(doc(db, col, id));
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
    addRecord,
    updateRecord,
    deleteRecord
  };
}
