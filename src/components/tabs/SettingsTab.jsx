import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Save, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';

export const SettingsTab = () => {
  const { settings, updateSettings, clearData, loadDemoData } = useContext(AppContext);
  
  const [sysName, setSysName] = useState(settings.systemName || 'HireDesk CRM');
  const [notifyEmail, setNotifyEmail] = useState(settings.notificationEmails || 'hr@hiredesk.com');
  const [selfReg, setSelfReg] = useState(settings.allowSelfRegistration ?? true);
  const [autoArchive, setAutoArchive] = useState(settings.autoArchiveRejected ?? false);
  const [feedback, setFeedback] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      systemName: sysName,
      notificationEmails: notifyEmail,
      allowSelfRegistration: selfReg,
      autoArchiveRejected: autoArchive
    });
    setFeedback('Settings saved successfully!');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all CRM database records? This will delete all candidates, interviews, and jobs in-memory.')) {
      clearData();
      setFeedback('Workspace database cleared.');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleRestore = () => {
    loadDemoData();
    setFeedback('Demo mockup profiles reloaded!');
    
    // update local state
    setSysName('HireDesk CRM');
    setNotifyEmail('hr@hiredesk.com');
    setSelfReg(true);
    setAutoArchive(false);
    
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
      
      {/* Settings Form */}
      <div className="card-section">
        <div className="card-section-header">
          <h3 className="chart-title">System Configurations</h3>
        </div>

        <form onSubmit={handleSave} style={{ padding: '24px' }}>
          {feedback && (
            <div 
              style={{ 
                backgroundColor: 'rgba(172, 207, 163, 0.2)', 
                color: 'var(--success-dark)', 
                border: '1px solid rgba(172, 207, 163, 0.4)', 
                padding: '10px 14px', 
                borderRadius: '8px', 
                marginBottom: '16px',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              {feedback}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">CRM Portal Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={sysName} 
              onChange={(e) => setSysName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notification Email Alerts</label>
            <input 
              type="email" 
              className="form-control" 
              value={notifyEmail} 
              onChange={(e) => setNotifyEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px' }}>
            <input 
              type="checkbox" 
              id="selfReg" 
              checked={selfReg} 
              onChange={(e) => setSelfReg(e.target.checked)} 
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="selfReg" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
              Allow external candidate self-registration
            </label>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
            <input 
              type="checkbox" 
              id="autoArchive" 
              checked={autoArchive} 
              onChange={(e) => setAutoArchive(e.target.checked)} 
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="autoArchive" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
              Auto-archive rejected applicant cards
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={16} /> Save Settings Parameters
          </button>
        </form>
      </div>

      {/* Danger Zone / Admin Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Administrator Profile Card */}
        <div className="card-section">
          <div className="card-section-header">
            <h3 className="chart-title">Operator Profile</h3>
          </div>
          <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="profile-avatar" style={{ width: '56px', height: '56px', fontSize: '22px' }}>
              MA
            </div>
            <div>
              <h4 style={{ fontSize: '16px', color: 'var(--primary-dark)' }}>malik</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>System Administrator</p>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Privileges: Superuser (Full CRUD access)
              </div>
            </div>
          </div>
        </div>

        {/* Database Actions */}
        <div className="card-section" style={{ border: '1px solid rgba(220, 38, 38, 0.2)' }}>
          <div className="card-section-header" style={{ borderBottom: '1px solid rgba(220, 38, 38, 0.15)', backgroundColor: 'rgba(220, 38, 38, 0.02)' }}>
            <h3 className="chart-title" style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={18} /> Danger Actions
            </h3>
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>Reset System Database</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Clears all candidates, recruiters, jobs, and interviews. This action is irreversible.
              </p>
              <button 
                className="btn btn-danger-outline btn-sm" 
                onClick={handleClear}
                style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={12} /> Clear Database Records
              </button>
            </div>

            <hr style={{ borderColor: 'rgba(220, 38, 38, 0.1)' }} />

            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>Reload Mock Database</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Restores the standard 10+ candidate profiles and full analytics dummy logs.
              </p>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={handleRestore}
                style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RotateCcw size={12} /> Reload Mockup Data
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default SettingsTab;
