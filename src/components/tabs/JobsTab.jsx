import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Briefcase, MapPin, DollarSign, Plus, EyeOff, Eye, Database } from 'lucide-react';

export const JobsTab = () => {
  const { jobs, addJob, updateJob, demoLoaded, loadDemoData } = useContext(AppContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', department: 'Engineering', type: 'Full-time',
    location: '', salary: ''
  });

  const handleToggleStatus = (job) => {
    updateJob({
      ...job,
      status: job.status === 'Open' ? 'Closed' : 'Open'
    });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addJob({
      title: formData.title,
      department: formData.department,
      type: formData.type,
      location: formData.location,
      salary: formData.salary
    });
    setIsAddModalOpen(false);
    setFormData({
      title: '', department: 'Engineering', type: 'Full-time',
      location: '', salary: ''
    });
  };

  return (
    <div>
      <div className="card-section" style={{ marginBottom: '24px' }}>
        <div className="card-section-header">
          <h3 className="chart-title">Job Openings Directory</h3>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Create Job Post
          </button>
        </div>
      </div>

      {jobs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {jobs.map(job => (
            <div 
              key={job.id} 
              className="stat-card" 
              style={{ 
                flexDirection: 'column', 
                alignItems: 'stretch', 
                gap: '12px',
                borderLeft: job.status === 'Open' ? '4px solid var(--teal)' : '4px solid var(--text-muted)',
                opacity: job.status === 'Closed' ? 0.75 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)' }}>{job.title}</h3>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', backgroundColor: 'rgba(var(--primary-rgb), 0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                    {job.department}
                  </span>
                </div>
                <span className={`badge ${job.status === 'Open' ? 'badge-hired' : 'badge-rejected'}`}>
                  {job.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} className="text-muted" /> {job.location} ({job.type})
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign size={14} className="text-muted" /> {job.salary || 'Competitive'}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  <strong>{job.applicantsCount}</strong> Applicants
                </span>
                <button 
                  className={`btn btn-sm ${job.status === 'Open' ? 'btn-outline' : 'btn-secondary'}`}
                  onClick={() => handleToggleStatus(job)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {job.status === 'Open' ? (
                    <>
                      <EyeOff size={12} /> Close Role
                    </>
                  ) : (
                    <>
                      <Eye size={12} /> Reopen Role
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Briefcase className="empty-icon" />
          <h4 className="empty-title">No Jobs Available</h4>
          <p className="empty-description">Create a job post to start accepting candidate applications, or reload the demo mockup workspace.</p>
          {!demoLoaded && (
            <button className="btn btn-secondary btn-sm" onClick={loadDemoData} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={14} /> Populate Demo Workspace
            </button>
          )}
        </div>
      )}

      {/* Add Job Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <form className="modal-content" onClick={(e) => e.stopPropagation()} onSubmit={handleAddSubmit}>
            <div className="modal-header">
              <h3 className="modal-title">Create Job Posting</h3>
              <button type="button" className="modal-close" onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Senior Frontend Engineer" 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select 
                    className="form-control" 
                    value={formData.department} 
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Operations">Operations</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Job Type</label>
                  <select 
                    className="form-control" 
                    value={formData.type} 
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    value={formData.location} 
                    onChange={(e) => setFormData({...formData, location: e.target.value})} 
                    placeholder="e.g. SF, CA or Remote, US" 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Salary Range</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.salary} 
                    onChange={(e) => setFormData({...formData, salary: e.target.value})} 
                    placeholder="e.g. $120k - $150k" 
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Post Job</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default JobsTab;
