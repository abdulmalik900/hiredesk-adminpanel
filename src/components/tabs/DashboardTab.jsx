import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import MyChart from '../MyChart';
import { Users, Briefcase, Calendar, CheckCircle2, AlertCircle, ArrowUpRight, Database } from 'lucide-react';

export const DashboardTab = ({ setActiveTab }) => {
  const { candidates, jobs, interviews, recruiters, demoLoaded, loadDemoData } = useContext(AppContext);

  // Stats Calculations
  const totalCandidates = candidates.length;
  const activeJobs = jobs.filter(j => j.status === 'Open').length;
  const pendingInterviews = interviews.filter(i => i.status === 'Scheduled').length;
  
  const hiredCount = candidates.filter(c => c.status === 'hired').length;
  const rejectedCount = candidates.filter(c => c.status === 'rejected').length;
  const completedCandidates = hiredCount + rejectedCount;
  const placementRate = completedCandidates > 0 ? Math.round((hiredCount / (totalCandidates - rejectedCount || 1)) * 100) : 0;

  // Chart 1: Funnel Distribution
  const statusCounts = {
    applied: 0,
    screening: 0,
    assessment: 0,
    interview: 0,
    ready: 0,
    offer: 0,
    hired: 0,
    rejected: 0
  };

  candidates.forEach(c => {
    if (statusCounts[c.status] !== undefined) {
      statusCounts[c.status]++;
    }
  });

  const funnelChartData = {
    labels: ['Applied', 'Screening', 'Assessment', 'Interview', 'Ready', 'Offer', 'Hired', 'Rejected'],
    datasets: [{
      label: 'Candidates',
      data: [
        statusCounts.applied,
        statusCounts.screening,
        statusCounts.assessment,
        statusCounts.interview,
        statusCounts.ready,
        statusCounts.offer,
        statusCounts.hired,
        statusCounts.rejected
      ],
      backgroundColor: [
        '#f3f0f5', // applied
        '#fffbeb', // screening
        '#eff6ff', // assessment
        '#84C5B1', // interview
        '#F0E9B6', // ready
        '#f0fdf4', // offer
        '#ACCFA3', // hired
        '#fef2f2'  // rejected
      ],
      borderColor: [
        '#744577',
        '#b45309',
        '#1d4ed8',
        '#57a68e',
        '#d8ce84',
        '#16a34a',
        '#81ad75',
        '#dc2626'
      ],
      borderWidth: 1
    }]
  };

  const funnelChartOptions = {
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  // Chart 2: Recruiters Workload
  const recruiterNames = recruiters.map(r => r.name);
  const recruiterLoads = recruiters.map(r => {
    // count candidates assigned to this recruiter
    return candidates.filter(c => c.recruiterId === r.id && c.status !== 'rejected' && c.status !== 'hired').length;
  });

  const loadChartData = {
    labels: recruiterNames.length > 0 ? recruiterNames : ['No Recruiters'],
    datasets: [{
      label: 'Active Candidates',
      data: recruiterLoads.length > 0 ? recruiterLoads : [0],
      backgroundColor: '#744577',
      borderRadius: 6
    }]
  };

  const loadChartOptions = {
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  // Recent Candidates
  const recentCandidates = [...candidates]
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .slice(0, 5);

  return (
    <div>
      {!demoLoaded && (
        <div 
          style={{ 
            backgroundColor: 'rgba(116, 69, 119, 0.05)', 
            border: '1px dashed var(--primary)', 
            borderRadius: '12px', 
            padding: '16px 20px', 
            marginBottom: '24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <h4 style={{ color: 'var(--primary-dark)', fontSize: '15px', fontWeight: 600, marginBottom: '2px' }}>Welcome to HireDesk CRM!</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>The system is currently empty. Populate the CRM database with rich mockup datasets to test all analytics and recruiter grids instantly.</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={loadDemoData} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={14} /> Populate Demo Workspace
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon-wrapper">
            <Users size={24} />
          </div>
          <div className="stat-data">
            <div className="stat-label">Total Candidates</div>
            <div className="stat-value">{totalCandidates}</div>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon-wrapper">
            <Briefcase size={24} />
          </div>
          <div className="stat-data">
            <div className="stat-label">Active Jobs</div>
            <div className="stat-value">{activeJobs}</div>
          </div>
        </div>

        <div className="stat-card teal">
          <div className="stat-icon-wrapper">
            <Calendar size={24} />
          </div>
          <div className="stat-data">
            <div className="stat-label">Interviews Scheduled</div>
            <div className="stat-value">{pendingInterviews}</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon-wrapper">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-data">
            <div className="stat-label">Hiring Rate</div>
            <div className="stat-value">{placementRate}%</div>
          </div>
        </div>
      </div>

      {/* Graphics section */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Hiring Pipeline Stages</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Candidates count per stage</span>
          </div>
          <div className="chart-canvas-container">
            {totalCandidates > 0 ? (
              <MyChart type="bar" data={funnelChartData} options={funnelChartOptions} />
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                No candidate data to display. Load demo data above.
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Recruiter Load</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active pipelines</span>
          </div>
          <div className="chart-canvas-container">
            {recruiters.length > 0 ? (
              <MyChart type="bar" data={loadChartData} options={loadChartOptions} />
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                No recruiter data.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card-section">
        <div className="card-section-header">
          <h3 className="chart-title">Recent Candidate Applications</h3>
          <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('candidates')} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All Candidates <ArrowUpRight size={14} />
          </button>
        </div>
        
        {recentCandidates.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Applied Position</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentCandidates.map(cand => (
                  <tr key={cand.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{cand.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cand.email}</div>
                    </td>
                    <td>{cand.role}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: cand.score >= 85 ? 'var(--teal-dark)' : 'inherit' }}>
                        {cand.score}/100
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${cand.status}`}>
                        {cand.status === 'ready' ? 'Ready for Interview' : cand.status}
                      </span>
                    </td>
                    <td>{cand.appliedDate}</td>
                    <td>
                      <button 
                        className="btn btn-outline btn-sm" 
                        onClick={() => setActiveTab('candidates')}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state" style={{ border: 'none' }}>
            <AlertCircle className="empty-icon" />
            <h4 className="empty-title">No Candidate Data Available</h4>
            <p className="empty-description">Create candidate profiles in the Candidates tab to populate active dashboard grids.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default DashboardTab;
