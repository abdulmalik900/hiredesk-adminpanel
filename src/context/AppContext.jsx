/* eslint-disable no-unused-vars, react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { INITIAL_EMPTY_STATE, getDemoData } from '../data/demoData';

export const AppContext = createContext();

const mergeWithDefaults = (parsed) => ({
  ...INITIAL_EMPTY_STATE,
  ...parsed,
  settings: {
    ...INITIAL_EMPTY_STATE.settings,
    ...(parsed?.settings || {}),
  },
});

const loadInitialState = () => {
  const saved = localStorage.getItem('hiredesk_state');
  if (saved) {
    try {
      const merged = mergeWithDefaults(JSON.parse(saved));
      const hasAnyData =
        merged.candidates.length > 0 ||
        merged.jobs.length > 0 ||
        merged.recruiters.length > 0;
      if (!hasAnyData) {
        return getDemoData();
      }
      return merged;
    } catch (e) {
      return getDemoData();
    }
  }
  return getDemoData();
};

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(loadInitialState);

  const [demoLoaded, setDemoLoaded] = useState(() => {
    const savedLoaded = localStorage.getItem('hiredesk_demo_loaded');
    const saved = localStorage.getItem('hiredesk_state');
    // If saved state had no data, treat demo as loaded since we defaulted to demo data
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasAnyData = (
          (parsed.candidates && parsed.candidates.length > 0) ||
          (parsed.jobs && parsed.jobs.length > 0) ||
          (parsed.recruiters && parsed.recruiters.length > 0)
        );
        if (!hasAnyData) return true;
      } catch (e) { /* fall through */ }
    }
    return savedLoaded ? savedLoaded === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('hiredesk_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('hiredesk_demo_loaded', demoLoaded.toString());
  }, [demoLoaded]);

  const loadDemoData = () => {
    const demo = getDemoData();
    setState(demo);
    setDemoLoaded(true);
  };

  const clearData = () => {
    setState(INITIAL_EMPTY_STATE);
    setDemoLoaded(false);
  };

  // CANDIDATES CRUD
  const addCandidate = (cand) => {
    const newCand = {
      ...cand,
      id: `CAND${String(state.candidates.length + 1).padStart(3, '0')}`,
      appliedDate: new Date().toISOString().split('T')[0],
      score: cand.score ? parseInt(cand.score) : 70,
      resume: cand.resume || { summary: "", skills: [], history: "" }
    };
    setState(prev => ({
      ...prev,
      candidates: [newCand, ...prev.candidates]
    }));
  };

  const updateCandidate = (updatedCand) => {
    setState(prev => ({
      ...prev,
      candidates: prev.candidates.map(c => c.id === updatedCand.id ? updatedCand : c)
    }));
  };

  const deleteCandidate = (id) => {
    setState(prev => ({
      ...prev,
      candidates: prev.candidates.filter(c => c.id !== id),
      interviews: prev.interviews.filter(i => i.candidateId !== id)
    }));
  };

  const promoteCandidate = (id, newStatus) => {
    setState(prev => {
      // Find candidate
      const cand = prev.candidates.find(c => c.id === id);
      if (!cand) return prev;

      // Adjust candidate details if status is 'ready' or others
      const updatedCand = { ...cand, status: newStatus };
      
      // If moving to Hired or Ready, adjust company references if any
      let updatedCompanies = [...prev.companies];
      if (newStatus === 'ready' && cand.companyId) {
        updatedCompanies = prev.companies.map(c => 
          c.id === cand.companyId 
            ? { ...c, readyCandidatesCount: c.readyCandidatesCount + 1 }
            : c
        );
      } else if (cand.status === 'ready' && newStatus !== 'ready' && cand.companyId) {
        updatedCompanies = prev.companies.map(c => 
          c.id === cand.companyId 
            ? { ...c, readyCandidatesCount: Math.max(0, c.readyCandidatesCount - 1) }
            : c
        );
      }

      return {
        ...prev,
        candidates: prev.candidates.map(c => c.id === id ? updatedCand : c),
        companies: updatedCompanies
      };
    });
  };

  const associateCandidateWithCompany = (candidateId, companyId) => {
    setState(prev => {
      const cand = prev.candidates.find(c => c.id === candidateId);
      if (!cand) return prev;

      const oldCompanyId = cand.companyId;
      const updatedCand = { ...cand, companyId };

      const updatedCompanies = prev.companies.map(c => {
        let count = c.readyCandidatesCount;
        if (c.id === companyId && cand.status === 'ready' && oldCompanyId !== companyId) {
          count += 1;
        }
        if (c.id === oldCompanyId && cand.status === 'ready' && oldCompanyId !== companyId) {
          count = Math.max(0, count - 1);
        }
        return { ...c, readyCandidatesCount: count };
      });

      return {
        ...prev,
        candidates: prev.candidates.map(c => c.id === candidateId ? updatedCand : c),
        companies: updatedCompanies
      };
    });
  };

  // JOBS CRUD
  const addJob = (job) => {
    const newJob = {
      ...job,
      id: `J${String(state.jobs.length + 1).padStart(3, '0')}`,
      applicantsCount: 0,
      status: 'Open'
    };
    setState(prev => ({
      ...prev,
      jobs: [newJob, ...prev.jobs]
    }));
  };

  const updateJob = (updatedJob) => {
    setState(prev => ({
      ...prev,
      jobs: prev.jobs.map(j => j.id === updatedJob.id ? updatedJob : j)
    }));
  };

  // INTERVIEWS CRUD
  const scheduleInterview = (interview) => {
    const newInt = {
      ...interview,
      id: `INT${String(state.interviews.length + 1).padStart(3, '0')}`,
      status: 'Scheduled'
    };

    // Auto promote candidate to 'interview' stage
    setState(prev => {
      const updatedCandidates = prev.candidates.map(c => 
        c.id === interview.candidateId ? { ...c, status: 'interview' } : c
      );

      return {
        ...prev,
        interviews: [newInt, ...prev.interviews],
        candidates: updatedCandidates
      };
    });
  };

  const rescheduleInterview = (id, newDateTime) => {
    setState(prev => ({
      ...prev,
      interviews: prev.interviews.map(i => i.id === id ? { ...i, dateTime: newDateTime } : i)
    }));
  };

  const updateInterviewStatus = (id, newStatus) => {
    setState(prev => ({
      ...prev,
      interviews: prev.interviews.map(i => i.id === id ? { ...i, status: newStatus } : i)
    }));
  };

  const cancelInterview = (id) => {
    setState(prev => ({
      ...prev,
      interviews: prev.interviews.map(i => i.id === id ? { ...i, status: 'Cancelled' } : i)
    }));
  };

  // RECRUITERS CRUD
  const addRecruiter = (recruiter) => {
    const newRec = {
      ...recruiter,
      id: `R${String(state.recruiters.length + 1).padStart(3, '0')}`,
      activeCandidates: 0,
      rating: 5.0
    };
    setState(prev => ({
      ...prev,
      recruiters: [...prev.recruiters, newRec]
    }));
  };

  const updateRecruiter = (updatedRec) => {
    setState(prev => ({
      ...prev,
      recruiters: prev.recruiters.map(r => r.id === updatedRec.id ? updatedRec : r)
    }));
  };

  // COMMUNICATION
  const sendEmail = (candidateId, subject, content) => {
    const candidate = state.candidates.find(c => c.id === candidateId);
    const candidateName = candidate ? candidate.name : "Unknown Candidate";

    const newComm = {
      id: `COM${String(state.communications.length + 1).padStart(3, '0')}`,
      candidateId,
      candidateName,
      subject,
      content,
      sentDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Sent'
    };

    setState(prev => ({
      ...prev,
      communications: [newComm, ...prev.communications]
    }));
  };

  // SETTINGS
  const updateSettings = (newSettings) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  return (
    <AppContext.Provider value={{
      candidates: state.candidates ?? [],
      jobs: state.jobs ?? [],
      interviews: state.interviews ?? [],
      recruiters: state.recruiters ?? [],
      companies: state.companies ?? [],
      communications: state.communications ?? [],
      settings: { ...INITIAL_EMPTY_STATE.settings, ...(state.settings || {}) },
      demoLoaded,
      loadDemoData,
      clearData,
      addCandidate,
      updateCandidate,
      deleteCandidate,
      promoteCandidate,
      associateCandidateWithCompany,
      addJob,
      updateJob,
      scheduleInterview,
      rescheduleInterview,
      updateInterviewStatus,
      cancelInterview,
      addRecruiter,
      updateRecruiter,
      sendEmail,
      updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};
