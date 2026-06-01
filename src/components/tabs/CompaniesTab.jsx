import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Building2, Calendar, Check, Mail, Phone, Database } from 'lucide-react';

export const CompaniesTab = () => {
  const { 
    companies, candidates, recruiters, 
    promoteCandidate, associateCandidateWithCompany, scheduleInterview,
    demoLoaded, loadDemoData
  } = useContext(AppContext);

  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || '');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  
  const [scheduleData, setScheduleData] = useState({
    candidateId: '', dateTime: '', type: 'Technical', recruiterId: ''
  });

  const schedulingCandidate = candidates.find(c => c.id === scheduleData.candidateId);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  // Candidates marked as 'ready' AND associated with this company
  const readyCandidates = candidates.filter(
    c => c.status === 'ready' && c.companyId === selectedCompanyId
  );

  // Candidates who are 'ready' but have NO company assigned (so they can be placed here)
  const unassignedReadyCandidates = candidates.filter(
    c => c.status === 'ready' && !c.companyId
  );

  const handleAssignCandidate = (candidateId) => {
    associateCandidateWithCompany(candidateId, selectedCompanyId);
  };

  const handleRemoveAssociation = (candidateId) => {
    associateCandidateWithCompany(candidateId, null);
  };

  const handleOpenSchedule = (cand) => {
    setScheduleData({
      candidateId: cand.id,
      dateTime: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
      type: 'Technical',
      recruiterId: cand.recruiterId || recruiters[0]?.id || ''
    });
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    const cand = candidates.find(c => c.id === scheduleData.candidateId);
    if (!cand) return;

    scheduleInterview({
      candidateId: cand.id,
      candidateName: cand.name,
      jobTitle: cand.role,
      recruiterId: scheduleData.recruiterId,
      dateTime: scheduleData.dateTime,
      type: scheduleData.type
    });
    setIsScheduleModalOpen(false);
    setScheduleData({ candidateId: '', dateTime: '', type: 'Technical', recruiterId: '' });
  };

  return (
    <div>
      <div className="card-section" style={{ marginBottom: '24px' }}>
        <div className="card-section-header">
          <h3 className="chart-title">Client Company Portals</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Manage placements and client-ready portfolios</span>
        </div>
      </div>

      {companies.length > 0 ? (
        <div>
          {/* Companies Selection Grid */}
          <div className="company-grid">
            {companies.map(comp => (
              <div 
                key={comp.id} 
                className={`company-card ${selectedCompanyId === comp.id ? 'selected' : ''}`}
                onClick={() => setSelectedCompanyId(comp.id)}
              >
                <div className="company-header">
                  <div className="company-logo-ph">
                    {comp.name[0]}
                  </div>
                  <div>
                    <h4 className="company-title" style={{ color: 'var(--primary-dark)' }}>{comp.name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{comp.industry}</span>
                  </div>
                </div>
                
                <div className="company-detail-item" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                  <span>Open Client Roles:</span>
                  <strong>{comp.openRolesCount} positions</strong>
                </div>

                <div className="company-detail-item">
                  <span>Ready Candidates:</span>
                  <span className="company-ready-tag">
                    {candidates.filter(c => c.status === 'ready' && c.companyId === comp.id).length} candidates
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Company Placements Section */}
          {selectedCompany && (
            <div className="card-section" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div className="card-section-header">
                <div>
                  <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)' }}>
                    {selectedCompany.name} - Ready Candidate Roster
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    These candidates have passed all internal screening benchmarks and are ready for company evaluation.
                  </p>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                {readyCandidates.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {readyCandidates.map(cand => (
                      <div 
                        key={cand.id} 
                        style={{ 
                          border: '1px solid var(--border-color)', 
                          borderRadius: '12px', 
                          padding: '20px', 
                          backgroundColor: '#ffffff',
                          boxShadow: 'var(--shadow-sm)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <h4 style={{ fontSize: '18px', color: 'var(--primary-dark)' }}>{cand.name}</h4>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{cand.role} ({cand.experience})</p>
                            
                            <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Mail size={12} /> {cand.email}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Phone size={12} /> {cand.phone}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Screening Score</span>
                              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--teal-dark)' }}>{cand.score}/100</div>
                            </div>
                            <span className="badge badge-ready">Ready for Interview</span>
                          </div>
                        </div>

                        {cand.resume?.summary && (
                          <div style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.01)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--teal)' }}>
                            <strong style={{ fontSize: '12px', display: 'block', marginBottom: '4px', color: 'var(--primary-dark)' }}>Profile Highlights:</strong>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{cand.resume.summary}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                              {cand.resume.skills?.map((s, i) => (
                                <span key={i} style={{ fontSize: '11px', backgroundColor: 'rgba(var(--primary-rgb), 0.05)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px' }}>{s}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px', flexWrap: 'wrap', gap: '12px' }}>
                          <button 
                            className="btn btn-outline btn-sm" 
                            style={{ color: '#dc2626', borderColor: 'rgba(220,38,38,0.2)' }}
                            onClick={() => handleRemoveAssociation(cand.id)}
                          >
                            Remove Placement Assignment
                          </button>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn btn-teal btn-sm"
                              onClick={() => handleOpenSchedule(cand)}
                              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Calendar size={12} /> Schedule Client Interview
                            </button>
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => promoteCandidate(cand.id, 'hired')}
                              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Check size={12} /> Finalize Job Offer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state" style={{ padding: '40px 16px', borderStyle: 'dashed' }}>
                    <Building2 className="empty-icon" />
                    <h4 className="empty-title">No Ready Candidates Placed</h4>
                    <p className="empty-description">
                      There are currently no candidates in the "Ready for Interview" stage assigned to {selectedCompany.name}.
                    </p>
                  </div>
                )}

                {/* Placement Opportunity - Add Unassigned Ready Candidates */}
                {unassignedReadyCandidates.length > 0 && (
                  <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                    <h4 style={{ fontSize: '16px', color: 'var(--primary-dark)', marginBottom: '12px' }}>
                      Assign Candidates Ready for Placements ({unassignedReadyCandidates.length})
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                      {unassignedReadyCandidates.map(cand => (
                        <div 
                          key={cand.id}
                          style={{ 
                            padding: '14px', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: 'rgba(240, 233, 182, 0.08)'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--primary-dark)' }}>{cand.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cand.role} (Score: {cand.score})</div>
                          </div>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleAssignCandidate(cand.id)}
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                          >
                            Assign Placements
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <Building2 className="empty-icon" />
          <h4 className="empty-title">No Partner Companies Registered</h4>
          <p className="empty-description">Create corporate accounts in the placements panel to initiate active candidate tracks, or reload the demo mockup workspace.</p>
          {!demoLoaded && (
            <button className="btn btn-secondary btn-sm" onClick={loadDemoData} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={14} /> Populate Demo Workspace
            </button>
          )}
        </div>
      )}

      {/* Schedule Client Interview Modal */}
      {isScheduleModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsScheduleModalOpen(false); setScheduleData({ candidateId: '', dateTime: '', type: 'Technical', recruiterId: '' }); }}>
          <form className="modal-content" onClick={(e) => e.stopPropagation()} onSubmit={handleSaveSchedule}>
            <div className="modal-header">
              <h3 className="modal-title">Schedule Client Interview</h3>
              <button type="button" className="modal-close" onClick={() => { setIsScheduleModalOpen(false); setScheduleData({ candidateId: '', dateTime: '', type: 'Technical', recruiterId: '' }); }}>×</button>
            </div>

            <div className="modal-body">
              <div style={{ marginBottom: '16px', fontSize: '14px' }}>
                <strong style={{ color: 'var(--primary)' }}>Client:</strong> {selectedCompany?.name}<br />
                <strong style={{ color: 'var(--primary)' }}>Candidate:</strong> {schedulingCandidate?.name} ({schedulingCandidate?.role})
              </div>

              <div className="form-group">
                <label className="form-label">Interview Stage / Format</label>
                <select 
                  className="form-control" 
                  value={scheduleData.type} 
                  onChange={(e) => setScheduleData({...scheduleData, type: e.target.value})}
                >
                  <option value="Technical">Client Technical Assessment</option>
                  <option value="Manager Round">Client Hiring Manager Interview</option>
                  <option value="Executive Round">Partner Board Interview</option>
                  <option value="System Design">System Design Review</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  required 
                  value={scheduleData.dateTime} 
                  onChange={(e) => setScheduleData({...scheduleData, dateTime: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Advisor (Recruiter Monitor)</label>
                <select 
                  className="form-control" 
                  value={scheduleData.recruiterId} 
                  onChange={(e) => setScheduleData({...scheduleData, recruiterId: e.target.value})}
                >
                  {recruiters.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.role})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => { setIsScheduleModalOpen(false); setScheduleData({ candidateId: '', dateTime: '', type: 'Technical', recruiterId: '' }); }}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Confirm Schedule</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default CompaniesTab;
