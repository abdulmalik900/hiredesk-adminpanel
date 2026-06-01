import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { User, Mail, Plus, Star, Database } from 'lucide-react';

export const RecruitersTab = () => {
  const { recruiters, candidates, addRecruiter, demoLoaded, loadDemoData } = useContext(AppContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Technical Recruiter'
  });

  const getActiveCount = (recruiterId) => {
    // count candidates assigned to recruiter that are not hired or rejected
    return candidates.filter(c => c.recruiterId === recruiterId && c.status !== 'hired' && c.status !== 'rejected').length;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addRecruiter({
      name: formData.name,
      email: formData.email,
      role: formData.role
    });
    setIsAddModalOpen(false);
    setFormData({ name: '', email: '', role: 'Technical Recruiter' });
  };

  return (
    <div>
      <div className="card-section" style={{ marginBottom: '24px' }}>
        <div className="card-section-header">
          <h3 className="chart-title">Recruitment Advisors</h3>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Add Recruiter
          </button>
        </div>
      </div>

      {recruiters.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {recruiters.map(rec => {
            const activeLoad = getActiveCount(rec.id);
            return (
              <div key={rec.id} className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="profile-avatar" style={{ width: '48px', height: '48px', fontSize: '18px' }}>
                    {rec.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', color: 'var(--primary-dark)' }}>{rec.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{rec.role}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} className="text-muted" /> {rec.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                      Rating: 
                      <span style={{ display: 'inline-flex', color: 'gold', alignItems: 'center' }}>
                        <Star size={14} fill="gold" /> {rec.rating || 5.0}
                      </span>
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: activeLoad > 8 ? '#b45309' : 'var(--teal-dark)' }}>
                      Load: {activeLoad} active candidates
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <User className="empty-icon" />
          <h4 className="empty-title">No Recruiters Added</h4>
          <p className="empty-description">Create profiles for your talent acquisition team members to distribute candidate assignments.</p>
          {!demoLoaded && (
            <button className="btn btn-secondary btn-sm" onClick={loadDemoData} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={14} /> Populate Demo Workspace
            </button>
          )}
        </div>
      )}

      {/* Add Recruiter Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <form className="modal-content" onClick={(e) => e.stopPropagation()} onSubmit={handleAddSubmit}>
            <div className="modal-header">
              <h3 className="modal-title">Register Recruiter</h3>
              <button type="button" className="modal-close" onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="Sarah Connor" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  required 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="sarah@hiredesk.com" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role Title</label>
                <select 
                  className="form-control" 
                  value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Lead Recruiter">Lead Recruiter</option>
                  <option value="Technical Recruiter">Technical Recruiter</option>
                  <option value="Executive Headhunter">Executive Headhunter</option>
                  <option value="Talent Scout">Talent Scout</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Register Team Member</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default RecruitersTab;
