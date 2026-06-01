import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, UserPlus, Trash2, Edit3, Eye, Calendar, Award, Phone, Mail, FileText, CheckCircle, XCircle, Database } from 'lucide-react';

export const CandidatesTab = () => {
  const { 
    candidates, recruiters, companies,
    addCandidate, updateCandidate, deleteCandidate, promoteCandidate,
    scheduleInterview, demoLoaded, loadDemoData
  } = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', role: '', experience: '',
    recruiterId: '', companyId: '', score: 75, notes: '',
    status: 'applied',
    resumeSummary: '', resumeSkills: '', resumeHistory: ''
  });

  const [scheduleData, setScheduleData] = useState({
    candidateId: '', dateTime: '', type: 'Technical', recruiterId: ''
  });

  // Filtered candidates
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cand.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === '' || cand.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '', email: '', phone: '', role: '', experience: '',
      recruiterId: recruiters[0]?.id || '', companyId: '', score: 75, notes: '',
      status: 'applied',
      resumeSummary: '', resumeSkills: '', resumeHistory: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cand) => {
    setFormData({
      id: cand.id,
      name: cand.name,
      email: cand.email,
      phone: cand.phone,
      role: cand.role,
      experience: cand.experience,
      recruiterId: cand.recruiterId || '',
      companyId: cand.companyId || '',
      score: cand.score || 70,
      notes: cand.notes || '',
      status: cand.status,
      resumeSummary: cand.resume?.summary || '',
      resumeSkills: cand.resume?.skills?.join(', ') || '',
      resumeHistory: cand.resume?.history || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    const newCand = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      experience: formData.experience,
      recruiterId: formData.recruiterId,
      companyId: formData.status === 'ready' ? formData.companyId : null,
      score: parseInt(formData.score),
      status: formData.status,
      notes: formData.notes,
      resume: {
        summary: formData.resumeSummary || `A skilled ${formData.role} candidate with ${formData.experience} experience.`,
        skills: formData.resumeSkills ? formData.resumeSkills.split(',').map(s => s.trim()) : [],
        history: formData.resumeHistory || 'Not specified'
      }
    };
    addCandidate(newCand);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedCand = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      experience: formData.experience,
      recruiterId: formData.recruiterId,
      companyId: formData.status === 'ready' ? formData.companyId : null,
      score: parseInt(formData.score),
      status: formData.status,
      notes: formData.notes,
      resume: {
        summary: formData.resumeSummary,
        skills: formData.resumeSkills ? formData.resumeSkills.split(',').map(s => s.trim()) : [],
        history: formData.resumeHistory
      }
    };
    updateCandidate(updatedCand);
    
    // If details modal was open, update details modal view state
    if (selectedCandidate && selectedCandidate.id === formData.id) {
      setSelectedCandidate(updatedCand);
    }
    setIsEditModalOpen(false);
  };

  const handleOpenSchedule = (cand) => {
    setScheduleData({
      candidateId: cand.id,
      dateTime: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16), // 2 days later
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

    if (selectedCandidate?.id === cand.id) {
      setSelectedCandidate(prev => (prev ? { ...prev, status: 'interview' } : prev));
    }
    setIsScheduleModalOpen(false);
  };

  const schedulingCandidate = candidates.find(c => c.id === scheduleData.candidateId);

  const getRecruiterName = (id) => {
    const rec = recruiters.find(r => r.id === id);
    return rec ? rec.name : 'Unassigned';
  };


  return (
    <div>
      {/* Search and Action Bar */}
      <div className="card-section" style={{ marginBottom: '24px' }}>
        <div className="card-section-header">
          <div className="search-wrapper">
            <div className="search-input-group">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search candidates, roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="assessment">Assessment</option>
              <option value="interview">Interview</option>
              <option value="ready">Ready for Interview</option>
              <option value="offer">Offer Stage</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <UserPlus size={16} /> Add Candidate
          </button>
        </div>
      </div>

      {/* Candidates List Grid */}
      <div className="card-section">
        {filteredCandidates.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Position</th>
                  <th>Assigned Recruiter</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map(cand => (
                  <tr key={cand.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{cand.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cand.email}</div>
                    </td>
                    <td>{cand.role}</td>
                    <td>{getRecruiterName(cand.recruiterId)}</td>
                    <td>
                      <span style={{ 
                        fontWeight: 600, 
                        color: cand.score >= 90 ? 'var(--teal-dark)' : cand.score >= 80 ? 'var(--success-dark)' : 'inherit' 
                      }}>
                        {cand.score}/100
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${cand.status}`}>
                        {cand.status === 'ready' ? 'Ready for Interview' : cand.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button className="action-btn" title="View details" onClick={() => setSelectedCandidate(cand)}>
                          <Eye size={14} />
                        </button>
                        <button className="action-btn" title="Edit candidate" onClick={() => handleOpenEdit(cand)}>
                          <Edit3 size={14} />
                        </button>
                        <button className="action-btn danger" title="Delete candidate" onClick={() => deleteCandidate(cand.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Search className="empty-icon" />
            {candidates.length === 0 ? (
              <>
                <h4 className="empty-title">No Candidate Data Available</h4>
                <p className="empty-description">The CRM database is currently empty. You can register a candidate profile or reload the demo mockup workspace.</p>
                {!demoLoaded && (
                  <button className="btn btn-secondary btn-sm" onClick={loadDemoData} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Database size={14} /> Populate Demo Workspace
                  </button>
                )}
              </>
            ) : (
              <>
                <h4 className="empty-title">No Candidates Found</h4>
                <p className="empty-description">Try adjusting your filters or search query, or add a new candidate profile to start tracking.</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="modal-overlay" onClick={() => setSelectedCandidate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Candidate Profile</h3>
              <button className="modal-close" onClick={() => setSelectedCandidate(null)}>×</button>
            </div>
            
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div className="profile-avatar" style={{ width: '64px', height: '64px', fontSize: '24px' }}>
                  {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h2 style={{ fontSize: '24px', color: 'var(--primary-dark)' }}>{selectedCandidate.name}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{selectedCandidate.role} ({selectedCandidate.experience})</p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                      <Mail size={14} /> {selectedCandidate.email}
                    </span>
                    <span style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                      <Phone size={14} /> {selectedCandidate.phone}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`badge badge-${selectedCandidate.status}`} style={{ display: 'block', textAlign: 'center', padding: '6px 12px' }}>
                    {selectedCandidate.status === 'ready' ? 'Ready for Interview' : selectedCandidate.status}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    Applied: {selectedCandidate.appliedDate}
                  </div>
                </div>
              </div>

              <hr style={{ borderColor: 'var(--border-color)' }} />

              {/* Resume layout */}
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                  <FileText size={16} /> Candidate Summary
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', background: 'rgba(var(--primary-rgb), 0.02)', padding: '12px', borderRadius: '8px' }}>
                  {selectedCandidate.resume?.summary || 'No resume summary provided.'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                    <Award size={16} /> Skills / Competencies
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedCandidate.resume?.skills && selectedCandidate.resume.skills.length > 0 ? (
                      selectedCandidate.resume.skills.map((skill, i) => (
                        <span key={i} style={{ backgroundColor: 'rgba(132, 197, 177, 0.15)', color: 'var(--teal-dark)', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No skills listed.</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                    <Award size={16} /> Assessment Score
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: selectedCandidate.score >= 90 ? 'var(--teal-dark)' : 'var(--primary)' }}>
                      {selectedCandidate.score}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      points out of 100.<br />
                      {selectedCandidate.score >= 85 ? 'Highly recommended' : selectedCandidate.score >= 70 ? 'Meets core benchmarks' : 'Needs reviewing'}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '6px' }}>Professional History</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                  {selectedCandidate.resume?.history || 'No professional history details.'}
                </p>
              </div>

              {selectedCandidate.notes && (
                <div>
                  <h4 style={{ color: 'var(--primary-dark)', marginBottom: '6px' }}>Recruiter Remarks</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--primary)', paddingLeft: '10px' }}>
                    "{selectedCandidate.notes}"
                  </p>
                </div>
              )}

              {/* Status promotion trigger buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f7f9', padding: '12px 16px', borderRadius: '12px', marginTop: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Pipeline Quick Actions:</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {selectedCandidate.status !== 'ready' && selectedCandidate.status !== 'hired' && selectedCandidate.status !== 'rejected' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => promoteCandidate(selectedCandidate.id, 'ready')}>
                      Mark Ready for Interview
                    </button>
                  )}
                  {selectedCandidate.status === 'ready' && (
                    <button className="btn btn-teal btn-sm" onClick={() => handleOpenSchedule(selectedCandidate)}>
                      <Calendar size={12} /> Schedule Interview
                    </button>
                  )}
                  {selectedCandidate.status !== 'hired' && selectedCandidate.status !== 'rejected' && (
                    <>
                      <button className="btn btn-success btn-sm" onClick={() => promoteCandidate(selectedCandidate.id, 'hired')}>
                        <CheckCircle size={12} /> Hire
                      </button>
                      <button className="btn btn-outline btn-sm" style={{ color: '#dc2626', borderColor: 'rgba(220,38,38,0.2)' }} onClick={() => promoteCandidate(selectedCandidate.id, 'rejected')}>
                        <XCircle size={12} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(selectedCandidate)}>Edit Candidate</button>
              <button className="btn btn-primary btn-sm" onClick={() => setSelectedCandidate(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <form className="modal-content" onClick={(e) => e.stopPropagation()} onSubmit={handleSaveAdd}>
            <div className="modal-header">
              <h3 className="modal-title">Add Candidate Profile</h3>
              <button type="button" className="modal-close" onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Alex Rivera" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="alex@email.com" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+1 (555) 123-4567" />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Title / Role</label>
                  <input type="text" className="form-control" required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="Senior React Engineer" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Experience (Years/Level)</label>
                  <input type="text" className="form-control" required value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} placeholder="5 years" />
                </div>
                <div className="form-group">
                  <label className="form-label">Assessment Score (0-100)</label>
                  <input type="number" min="0" max="100" className="form-control" value={formData.score} onChange={(e) => setFormData({...formData, score: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Assign Recruiter</label>
                  <select className="form-control" value={formData.recruiterId} onChange={(e) => setFormData({...formData, recruiterId: e.target.value})}>
                    {recruiters.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.role})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Pipeline Stage</label>
                  <select className="form-control" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="applied">Applied</option>
                    <option value="screening">Screening</option>
                    <option value="assessment">Assessment</option>
                    <option value="interview">Interview</option>
                    <option value="ready">Ready for Interview</option>
                    <option value="offer">Offer Stage</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {formData.status === 'ready' && (
                <div className="form-group">
                  <label className="form-label">Target Placement Company (Show to Company)</label>
                  <select className="form-control" value={formData.companyId} onChange={(e) => setFormData({...formData, companyId: e.target.value})}>
                    <option value="">-- Associate with Company --</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Resume Summary</label>
                <textarea className="form-control" rows="2" value={formData.resumeSummary} onChange={(e) => setFormData({...formData, resumeSummary: e.target.value})} placeholder="Brief profile highlight..."></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Skills (Comma-separated)</label>
                <input type="text" className="form-control" value={formData.resumeSkills} onChange={(e) => setFormData({...formData, resumeSkills: e.target.value})} placeholder="React, TypeScript, AWS, Figma" />
              </div>

              <div className="form-group">
                <label className="form-label">Professional History</label>
                <textarea className="form-control" rows="2" value={formData.resumeHistory} onChange={(e) => setFormData({...formData, resumeHistory: e.target.value})} placeholder="Company A (2 yrs), Company B (3 yrs)..."></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Recruiter Internal Remarks</label>
                <textarea className="form-control" rows="2" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Notes from phone screen or assessments..."></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Add Candidate</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Candidate Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <form className="modal-content" onClick={(e) => e.stopPropagation()} onSubmit={handleSaveEdit}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Candidate Profile</h3>
              <button type="button" className="modal-close" onClick={() => setIsEditModalOpen(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Title / Role</label>
                  <input type="text" className="form-control" required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Experience (Years/Level)</label>
                  <input type="text" className="form-control" required value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Assessment Score (0-100)</label>
                  <input type="number" min="0" max="100" className="form-control" value={formData.score} onChange={(e) => setFormData({...formData, score: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Assign Recruiter</label>
                  <select className="form-control" value={formData.recruiterId} onChange={(e) => setFormData({...formData, recruiterId: e.target.value})}>
                    {recruiters.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pipeline Stage</label>
                  <select className="form-control" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="applied">Applied</option>
                    <option value="screening">Screening</option>
                    <option value="assessment">Assessment</option>
                    <option value="interview">Interview</option>
                    <option value="ready">Ready for Interview</option>
                    <option value="offer">Offer Stage</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {formData.status === 'ready' && (
                <div className="form-group">
                  <label className="form-label">Target Placement Company (Show to Company)</label>
                  <select className="form-control" value={formData.companyId} onChange={(e) => setFormData({...formData, companyId: e.target.value})}>
                    <option value="">-- Associate with Company --</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Resume Summary</label>
                <textarea className="form-control" rows="2" value={formData.resumeSummary} onChange={(e) => setFormData({...formData, resumeSummary: e.target.value})}></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Skills (Comma-separated)</label>
                <input type="text" className="form-control" value={formData.resumeSkills} onChange={(e) => setFormData({...formData, resumeSkills: e.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">Professional History</label>
                <textarea className="form-control" rows="2" value={formData.resumeHistory} onChange={(e) => setFormData({...formData, resumeHistory: e.target.value})}></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Recruiter Internal Remarks</label>
                <textarea className="form-control" rows="2" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule Interview Modal helper from Details */}
      {isScheduleModalOpen && (
        <div className="modal-overlay" onClick={() => setIsScheduleModalOpen(false)}>
          <form className="modal-content" onClick={(e) => e.stopPropagation()} onSubmit={handleSaveSchedule}>
            <div className="modal-header">
              <h3 className="modal-title">Schedule Interview - {schedulingCandidate?.name ?? 'Candidate'}</h3>
              <button type="button" className="modal-close" onClick={() => setIsScheduleModalOpen(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Interview Type</label>
                <select className="form-control" value={scheduleData.type} onChange={(e) => setScheduleData({...scheduleData, type: e.target.value})}>
                  <option value="Technical">Technical Interview</option>
                  <option value="HR">HR Screen / Cultural Fit</option>
                  <option value="System Design">System Design</option>
                  <option value="Manager Round">Manager Round</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date & Time</label>
                <input type="datetime-local" className="form-control" required value={scheduleData.dateTime} onChange={(e) => setScheduleData({...scheduleData, dateTime: e.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">Interviewer (Recruiter)</label>
                <select className="form-control" value={scheduleData.recruiterId} onChange={(e) => setScheduleData({...scheduleData, recruiterId: e.target.value})}>
                  {recruiters.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.role})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsScheduleModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-teal btn-sm">Schedule Now</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default CandidatesTab;
