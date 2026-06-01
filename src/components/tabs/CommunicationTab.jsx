import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Mail, Send } from 'lucide-react';

const templates = {
  custom: { subject: '', content: '' },
  assessment_passed: {
    subject: 'HireDesk CRM: Code Assessment Passed!',
    content: (name) => `Hello ${name},\n\nCongratulations! You passed our core coding assessment with an excellent score.\nWe are moving you to the 'Ready for Interview' status and recommending you to our premium partner clients.\n\nBest regards,\nHireDesk Recruitment Team`
  },
  interview_details: {
    subject: 'HireDesk CRM: Technical Interview Details',
    content: (name) => `Hello ${name},\n\nYour Technical assessment interview is currently being scheduled.\nPlease check your dashboard calendar. A calendar invite link will be sent shortly.\n\nThanks,\nHireDesk HR Team`
  },
  reject_email: {
    subject: 'Application Update from HireDesk',
    content: (name) => `Hello ${name},\n\nThank you for taking the time to discuss your background with our recruiters. Unfortunately, we will not be moving forward with your application for this specific position...\n\nSincerely,\nHireDesk HR Team`
  }
};

export const CommunicationTab = () => {
  const { communications, candidates, sendEmail } = useContext(AppContext);
  const [selectedCandId, setSelectedCandId] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  
  const [feedback, setFeedback] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const handleCandidateChange = (candId) => {
    setSelectedCandId(candId);
    updateSubjectAndContent(selectedTemplate, candId);
  };

  const handleTemplateChange = (templateKey) => {
    setSelectedTemplate(templateKey);
    updateSubjectAndContent(templateKey, selectedCandId);
  };

  const updateSubjectAndContent = (templateKey, candId) => {
    const cand = candidates.find(c => c.id === candId);
    const name = cand ? cand.name : 'Candidate';

    if (templateKey === 'custom') {
      setSubject('');
      setContent('');
    } else {
      const tmpl = templates[templateKey];
      setSubject(tmpl.subject);
      setContent(typeof tmpl.content === 'function' ? tmpl.content(name) : tmpl.content);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!selectedCandId) {
      setFeedback('Please select a recipient candidate.');
      return;
    }

    sendEmail(selectedCandId, subject, content);
    setFeedback('Email dispatched successfully! Log updated.');
    
    // Reset form
    setSelectedCandId('');
    setSelectedTemplate('custom');
    setSubject('');
    setContent('');

    setTimeout(() => {
      setFeedback('');
    }, 3000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
      
      {/* Dispatch Panel */}
      <div className="card-section" style={{ height: 'fit-content' }}>
        <div className="card-section-header">
          <h3 className="chart-title">Candidate Mail Dispatcher</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Simulate notifications and status updates</span>
        </div>

        <form onSubmit={handleSend} style={{ padding: '24px' }}>
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
            <label className="form-label">Recipient Candidate</label>
            <select 
              className="form-control" 
              required
              value={selectedCandId} 
              onChange={(e) => handleCandidateChange(e.target.value)}
            >
              <option value="">-- Choose Candidate --</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Notification Template</label>
            <select 
              className="form-control" 
              value={selectedTemplate} 
              onChange={(e) => handleTemplateChange(e.target.value)}
            >
              <option value="custom">Blank Canvas (Custom)</option>
              <option value="assessment_passed">Assessment Passed Notice</option>
              <option value="interview_details">Interview Scheduling Details</option>
              <option value="reject_email">Polite Rejection Template</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Email Subject</label>
            <input 
              type="text" 
              className="form-control" 
              required
              placeholder="e.g. Interview scheduled for Senior Frontend Developer" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Body Content</label>
            <textarea 
              className="form-control" 
              rows="8" 
              required
              placeholder="Compose notification text..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.4 }}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Send size={16} /> Dispatch Simulated Email
          </button>
        </form>
      </div>

      {/* History log list */}
      <div className="card-section">
        <div className="card-section-header">
          <h3 className="chart-title">Delivery Status Logs</h3>
        </div>

        {communications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '560px', overflowY: 'auto' }}>
            {communications.map(log => (
              <div 
                key={log.id} 
                style={{ 
                  padding: '16px 20px', 
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  backgroundColor: selectedLog?.id === log.id ? 'rgba(var(--primary-rgb), 0.03)' : 'transparent',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => setSelectedLog(log)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--primary-dark)' }}>{log.candidateName}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.sentDate}</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {log.subject}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                    {log.content.substring(0, 40)}...
                  </span>
                  <span className="badge badge-hired" style={{ padding: '2px 8px', fontSize: '9px' }}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ border: 'none' }}>
            <Mail className="empty-icon" />
            <h4 className="empty-title">Mail Log Empty</h4>
            <p className="empty-description">Dispatch an email to simulate candidate responses and delivery logs.</p>
          </div>
        )}
      </div>

      {/* Log Detail Overlay Dialog */}
      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Sent Communication Log</h3>
              <button className="modal-close" onClick={() => setSelectedLog(null)}>×</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <strong style={{ color: 'var(--primary)' }}>Recipient:</strong> {selectedLog.candidateName}<br />
                <strong style={{ color: 'var(--primary)' }}>Subject:</strong> {selectedLog.subject}<br />
                <strong style={{ color: 'var(--primary)' }}>Timestamp:</strong> {selectedLog.sentDate}
              </div>
              <hr style={{ borderColor: 'var(--border-color)' }} />
              <div>
                <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--primary-dark)' }}>Dispatched Message Content</h4>
                <p style={{ 
                  whiteSpace: 'pre-line', 
                  fontSize: '13px', 
                  color: 'var(--text-secondary)',
                  fontFamily: 'monospace',
                  background: 'rgba(var(--primary-rgb), 0.02)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  lineHeight: 1.4
                }}>
                  {selectedLog.content}
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary btn-sm" onClick={() => setSelectedLog(null)}>Close Viewer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CommunicationTab;
