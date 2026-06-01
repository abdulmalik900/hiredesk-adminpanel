import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Calendar, User, Clock, Check, X, RefreshCw, Database } from 'lucide-react';

export const InterviewsTab = () => {
  const { 
    interviews, candidates, recruiters, 
    scheduleInterview, rescheduleInterview, updateInterviewStatus, cancelInterview,
    demoLoaded, loadDemoData
  } = useContext(AppContext);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleInterviewId, setRescheduleInterviewId] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    candidateId: '',
    recruiterId: '',
    dateTime: '',
    type: 'Technical'
  });
  
  const [newDateTime, setNewDateTime] = useState('');

  const handleOpenSchedule = () => {
    // Select first eligible candidate (not hired/rejected)
    const eligibleCands = candidates.filter(c => c.status !== 'hired' && c.status !== 'rejected');
    setFormData({
      candidateId: eligibleCands[0]?.id || '',
      recruiterId: recruiters[0]?.id || '',
      dateTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Tomorrow
      type: 'Technical'
    });
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    const cand = candidates.find(c => c.id === formData.candidateId);
    if (!cand) return;

    scheduleInterview({
      candidateId: formData.candidateId,
      candidateName: cand.name,
      jobTitle: cand.role,
      recruiterId: formData.recruiterId,
      dateTime: formData.dateTime,
      type: formData.type
    });
    setIsScheduleModalOpen(false);
  };

  const handleOpenReschedule = (interview) => {
    setRescheduleInterviewId(interview.id);
    setSelectedInterview(interview);
    setNewDateTime(interview.dateTime);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!rescheduleInterviewId) return;
    rescheduleInterview(rescheduleInterviewId, newDateTime);
    setIsRescheduleModalOpen(false);
    setRescheduleInterviewId(null);
    setSelectedInterview(null);
  };

  const getRecruiterName = (id) => {
    const rec = recruiters.find(r => r.id === id);
    return rec ? rec.name : 'Unknown Recruiter';
  };

  const formatInterviewDate = (dtString) => {
    const d = new Date(dtString);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatInterviewTime = (dtString) => {
    const d = new Date(dtString);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Filter candidates who are eligible for interviews
  const eligibleCandidatesForInterview = candidates.filter(c => c.status !== 'hired' && c.status !== 'rejected');

  return (
    <div>
      <div className="card-section" style={{ marginBottom: '24px' }}>
        <div className="card-section-header">
          <h3 className="chart-title">Interviews Scheduler</h3>
          <button className="btn btn-primary" onClick={handleOpenSchedule} disabled={eligibleCandidatesForInterview.length === 0}>
            <Calendar size={16} /> Schedule Session
          </button>
        </div>
      </div>

      {interviews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {interviews.map(session => (
            <div 
              key={session.id} 
              className="stat-card" 
              style={{ 
                padding: '20px 24px',
                borderLeft: session.status === 'Scheduled' ? '4px solid var(--teal)' : 
                            session.status === 'Completed' ? '4px solid var(--success)' : 
                            '4px solid var(--text-muted)',
                opacity: session.status === 'Cancelled' ? 0.6 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ 
                    backgroundColor: session.status === 'Scheduled' ? 'rgba(132, 197, 177, 0.15)' : 'rgba(116, 69, 119, 0.08)',
                    color: session.status === 'Scheduled' ? 'var(--teal-dark)' : 'var(--primary)',
                    width: '48px', height: '48px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justify: 'center', alignContent: 'center', justifyContent: 'center'
                  }}>
                    <Clock size={20} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '16px', color: 'var(--primary-dark)' }}>{session.candidateName}</h4>
                      <span className="badge badge-applied" style={{ fontSize: '10px' }}>{session.type}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Position: {session.jobTitle}</p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> {formatInterviewDate(session.dateTime)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {formatInterviewTime(session.dateTime)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} /> Conducted by: {getRecruiterName(session.recruiterId)}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge ${
                    session.status === 'Scheduled' ? 'badge-interview' : 
                    session.status === 'Completed' ? 'badge-hired' : 
                    'badge-rejected'
                  }`}>
                    {session.status}
                  </span>

                  {session.status === 'Scheduled' && (
                    <div className="action-buttons">
                      <button 
                        className="action-btn" 
                        title="Mark Completed" 
                        onClick={() => updateInterviewStatus(session.id, 'Completed')}
                        style={{ color: 'var(--success-dark)', borderColor: 'rgba(172, 207, 163, 0.4)' }}
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        className="action-btn" 
                        title="Reschedule" 
                        onClick={() => handleOpenReschedule(session)}
                      >
                        <RefreshCw size={14} />
                      </button>
                      <button 
                        className="action-btn danger" 
                        title="Cancel Interview" 
                        onClick={() => cancelInterview(session.id)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Calendar className="empty-icon" />
          <h4 className="empty-title">No Interviews Scheduled</h4>
          <p className="empty-description">Schedule technical evaluations or HR screenings for your current applicant roster, or reload the demo mockup workspace.</p>
          {!demoLoaded && (
            <button className="btn btn-secondary btn-sm" onClick={loadDemoData} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={14} /> Populate Demo Workspace
            </button>
          )}
        </div>
      )}

      {/* Schedule Interview Modal */}
      {isScheduleModalOpen && (
        <div className="modal-overlay" onClick={() => setIsScheduleModalOpen(false)}>
          <form className="modal-content" onClick={(e) => e.stopPropagation()} onSubmit={handleScheduleSubmit}>
            <div className="modal-header">
              <h3 className="modal-title">Schedule New Interview</h3>
              <button type="button" className="modal-close" onClick={() => setIsScheduleModalOpen(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Select Candidate</label>
                <select 
                  className="form-control" 
                  value={formData.candidateId} 
                  onChange={(e) => setFormData({...formData, candidateId: e.target.value})}
                  required
                >
                  {eligibleCandidatesForInterview.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.role} ({c.status})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Interview Stage / Type</label>
                <select 
                  className="form-control" 
                  value={formData.type} 
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Technical">Technical Assessment</option>
                  <option value="HR">HR Screen / Cultural Fit</option>
                  <option value="System Design">System Design</option>
                  <option value="Executive Round">Executive Round</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  required 
                  value={formData.dateTime} 
                  onChange={(e) => setFormData({...formData, dateTime: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Interviewer</label>
                <select 
                  className="form-control" 
                  value={formData.recruiterId} 
                  onChange={(e) => setFormData({...formData, recruiterId: e.target.value})}
                >
                  {recruiters.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.role})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsScheduleModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Schedule</button>
            </div>
          </form>
        </div>
      )}

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsRescheduleModalOpen(false); setRescheduleInterviewId(null); setSelectedInterview(null); }}>
          <form className="modal-content" onClick={(e) => e.stopPropagation()} onSubmit={handleRescheduleSubmit}>
            <div className="modal-header">
              <h3 className="modal-title">Reschedule Session</h3>
              <button type="button" className="modal-close" onClick={() => { setIsRescheduleModalOpen(false); setRescheduleInterviewId(null); setSelectedInterview(null); }}>×</button>
            </div>

            <div className="modal-body">
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: 'var(--primary)' }}>Candidate:</strong> {selectedInterview?.candidateName}<br />
                <strong style={{ color: 'var(--primary)' }}>Original Date:</strong> {selectedInterview && formatInterviewDate(selectedInterview.dateTime)} at {selectedInterview && formatInterviewTime(selectedInterview.dateTime)}
              </div>

              <div className="form-group">
                <label className="form-label">New Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  required 
                  value={newDateTime} 
                  onChange={(e) => setNewDateTime(e.target.value)} 
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => { setIsRescheduleModalOpen(false); setRescheduleInterviewId(null); setSelectedInterview(null); }}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Reschedule Session</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default InterviewsTab;
