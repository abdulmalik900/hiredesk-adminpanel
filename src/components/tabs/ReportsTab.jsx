import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import MyChart from '../MyChart';
import { TrendingUp, Clock, UserCheck, ShieldAlert } from 'lucide-react';

export const ReportsTab = () => {
  const { candidates, jobs } = useContext(AppContext);

  // Analytics
  const total = candidates.length;
  const hired = candidates.filter(c => c.status === 'hired').length;
  const ready = candidates.filter(c => c.status === 'ready').length;
  const screening = candidates.filter(c => c.status === 'screening').length;
  const interview = candidates.filter(c => c.status === 'interview').length;
  const offer = candidates.filter(c => c.status === 'offer').length;
  const assessment = candidates.filter(c => c.status === 'assessment').length;
  const applied = candidates.filter(c => c.status === 'applied').length;
  const rejected = candidates.filter(c => c.status === 'rejected').length;

  const funnelDoughnutData = {
    labels: ['Screening Funnel', 'Client Interviews', 'Hired Placements', 'Offer Extended', 'Under Evaluation'],
    datasets: [{
      data: [
        screening + applied,
        interview + ready,
        hired,
        offer,
        assessment
      ],
      backgroundColor: ['#744577', '#84C5B1', '#ACCFA3', '#F0E9B6', '#605163'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  const funnelDoughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } }
      }
    }
  };

  // Job distribution
  const jobLabels = jobs.map(j => j.title.substring(0, 18) + (j.title.length > 18 ? '..' : ''));
  const jobApplicants = jobs.map(j => {
    // count candidates in state whose role matches job title
    return candidates.filter(c => c.role.toLowerCase() === j.title.toLowerCase()).length;
  });

  const jobBarData = {
    labels: jobLabels.length > 0 ? jobLabels : ['No Jobs'],
    datasets: [{
      label: 'Applicants',
      data: jobApplicants.length > 0 ? jobApplicants : [0],
      backgroundColor: '#84C5B1',
      borderColor: '#57a68e',
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  const jobBarOptions = {
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  // Average score
  const avgScore = total > 0 ? Math.round(candidates.reduce((acc, curr) => acc + curr.score, 0) / total) : 0;
  
  // Placements ratio
  const successRatio = total > 0 ? Math.round((hired / (total - rejected || 1)) * 100) : 0;

  return (
    <div>
      <div className="card-section" style={{ marginBottom: '24px' }}>
        <div className="card-section-header">
          <h3 className="chart-title">Recruitment Performance Metrics</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Interactive reports representing current pool conversions</span>
        </div>
      </div>

      {/* Analytical grid stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card primary" style={{ padding: '16px 20px' }}>
          <div className="stat-icon-wrapper" style={{ width: '40px', height: '40px' }}><TrendingUp size={20} /></div>
          <div>
            <div className="stat-label">Conversion Rate</div>
            <div style={{ fontSize: '22px', fontWeight: 700 }}>{successRatio}%</div>
          </div>
        </div>

        <div className="stat-card success" style={{ padding: '16px 20px' }}>
          <div className="stat-icon-wrapper" style={{ width: '40px', height: '40px' }}><UserCheck size={20} /></div>
          <div>
            <div className="stat-label">Placed Hired</div>
            <div style={{ fontSize: '22px', fontWeight: 700 }}>{hired} candidates</div>
          </div>
        </div>

        <div className="stat-card teal" style={{ padding: '16px 20px' }}>
          <div className="stat-icon-wrapper" style={{ width: '40px', height: '40px' }}><Clock size={20} /></div>
          <div>
            <div className="stat-label">Mean Score</div>
            <div style={{ fontSize: '22px', fontWeight: 700 }}>{avgScore}/100</div>
          </div>
        </div>

        <div className="stat-card secondary" style={{ padding: '16px 20px' }}>
          <div className="stat-icon-wrapper" style={{ width: '40px', height: '40px' }}><ShieldAlert size={20} /></div>
          <div>
            <div className="stat-label">Archived / Rejected</div>
            <div style={{ fontSize: '22px', fontWeight: 700 }}>{rejected} profiles</div>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Talent Pool Conversion Breakdown</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Proportional distribution</span>
          </div>
          <div className="chart-canvas-container" style={{ height: '280px' }}>
            {total > 0 ? (
              <MyChart type="doughnut" data={funnelDoughnutData} options={funnelDoughnutOptions} />
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                No database records to compute.
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Applications by Job Position</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Talent density</span>
          </div>
          <div className="chart-canvas-container" style={{ height: '280px' }}>
            {jobs.length > 0 ? (
              <MyChart type="bar" data={jobBarData} options={jobBarOptions} />
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                No active job positions found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReportsTab;
