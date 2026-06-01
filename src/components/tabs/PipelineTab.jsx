import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';

export const PipelineTab = () => {
  const { candidates, promoteCandidate } = useContext(AppContext);

  const columns = [
    { key: 'applied', title: 'Applied', color: '#f3f0f5' },
    { key: 'screening', title: 'Screening', color: '#fffbeb' },
    { key: 'assessment', title: 'Assessment', color: '#eff6ff' },
    { key: 'interview', title: 'Interview', color: 'var(--teal-light)' },
    { key: 'ready', title: 'Ready for Interview', color: 'rgba(240, 233, 182, 0.3)' },
    { key: 'offer', title: 'Offer Stage', color: '#f0fdf4' },
    { key: 'hired', title: 'Hired 🎉', color: 'var(--success-light)' },
    { key: 'rejected', title: 'Rejected', color: '#fef2f2' }
  ];

  const getNextStage = (current) => {
    const sequence = ['applied', 'screening', 'assessment', 'interview', 'ready', 'offer', 'hired'];
    const idx = sequence.indexOf(current);
    if (idx !== -1 && idx < sequence.length - 1) {
      return sequence[idx + 1];
    }
    return null;
  };

  const getCandidatesInStage = (stageKey) => {
    return candidates.filter(c => c.status === stageKey);
  };

  return (
    <div>
      <div className="card-section" style={{ marginBottom: '24px' }}>
        <div className="card-section-header">
          <h3 className="chart-title">Status Funnel Pipeline</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Advance candidate pipelines with quick-click controls</span>
        </div>
      </div>

      <div className="kanban-board">
        {columns.map(col => {
          const colCandidates = getCandidatesInStage(col.key);
          const nextStage = getNextStage(col.key);
          
          return (
            <div key={col.key} className="kanban-column" style={{ borderTop: `4px solid ${
              col.key === 'hired' ? 'var(--success)' : 
              col.key === 'ready' ? 'var(--secondary-dark)' :
              col.key === 'rejected' ? '#dc2626' : 
              col.key === 'interview' ? 'var(--teal)' : 'var(--primary)'
            }` }}>
              <div className="kanban-column-header">
                <span className="kanban-column-title" style={{ color: 'var(--primary-dark)' }}>
                  {col.title}
                </span>
                <span className="kanban-count">{colCandidates.length}</span>
              </div>

              <div className="kanban-cards">
                {colCandidates.length > 0 ? (
                  colCandidates.map(cand => (
                    <div key={cand.id} className="kanban-card">
                      <div>
                        <div className="kanban-card-title">{cand.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{cand.role}</div>
                      </div>

                      <div className="kanban-card-meta">
                        <span>Score: <strong>{cand.score}</strong></span>
                        <span style={{ fontSize: '10px' }}>Exp: {cand.experience}</span>
                      </div>

                      <div className="kanban-card-actions">
                        {/* Reject button */}
                        {col.key !== 'rejected' && col.key !== 'hired' && (
                          <button 
                            className="action-btn danger" 
                            title="Reject Candidate"
                            onClick={() => promoteCandidate(cand.id, 'rejected')}
                            style={{ padding: '2px', height: '26px', width: '26px' }}
                          >
                            <XCircle size={12} />
                          </button>
                        )}

                        {/* Advance button */}
                        {nextStage && (
                          <button 
                            className="action-btn" 
                            title={`Promote to ${nextStage}`}
                            onClick={() => promoteCandidate(cand.id, nextStage)}
                            style={{ 
                              padding: '2px', height: '26px', width: '26px', 
                              backgroundColor: 'rgba(132, 197, 177, 0.2)', 
                              color: 'var(--teal-dark)', 
                              borderColor: 'rgba(132, 197, 177, 0.4)' 
                            }}
                          >
                            <ArrowRight size={12} />
                          </button>
                        )}

                        {/* Direct Hire button */}
                        {col.key !== 'hired' && col.key !== 'rejected' && col.key !== 'offer' && (
                          <button 
                            className="action-btn" 
                            title="Hire Candidate"
                            onClick={() => promoteCandidate(cand.id, 'hired')}
                            style={{ 
                              padding: '2px', height: '26px', width: '26px',
                              backgroundColor: 'rgba(172, 207, 163, 0.2)',
                              color: 'var(--success-dark)',
                              borderColor: 'rgba(172, 207, 163, 0.4)'
                            }}
                          >
                            <CheckCircle size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 8px', color: 'var(--text-muted)', fontSize: '12px', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                    No candidates
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default PipelineTab;
