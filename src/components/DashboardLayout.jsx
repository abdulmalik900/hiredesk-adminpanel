import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, UserCheck, Briefcase, Calendar, Users, 
  Layers, Building2, Mail, BarChart3, Settings, Menu, X, LogOut, Database, RefreshCw 
} from 'lucide-react';

// Tab Views
import DashboardTab from './tabs/DashboardTab';
import CandidatesTab from './tabs/CandidatesTab';
import JobsTab from './tabs/JobsTab';
import InterviewsTab from './tabs/InterviewsTab';
import RecruitersTab from './tabs/RecruitersTab';
import PipelineTab from './tabs/PipelineTab';
import CompaniesTab from './tabs/CompaniesTab';
import CommunicationTab from './tabs/CommunicationTab';
import ReportsTab from './tabs/ReportsTab';
import SettingsTab from './tabs/SettingsTab';

export const DashboardLayout = ({ username, onLogout }) => {
  const { demoLoaded, loadDemoData, settings } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Tab configurations
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: DashboardTab },
    { id: 'candidates', label: 'Candidates', icon: UserCheck, component: CandidatesTab },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, component: JobsTab },
    { id: 'interviews', label: 'Interview Schedule', icon: Calendar, component: InterviewsTab },
    { id: 'recruiters', label: 'Recruiters', icon: Users, component: RecruitersTab },
    { id: 'pipeline', label: 'Status Pipeline', icon: Layers, component: PipelineTab },
    { id: 'companies', label: 'Companies & Placements', icon: Building2, component: CompaniesTab },
    { id: 'communication', label: 'Communication', icon: Mail, component: CommunicationTab },
    { id: 'reports', label: 'Reports', icon: BarChart3, component: ReportsTab },
    { id: 'settings', label: 'Settings', icon: Settings, component: SettingsTab }
  ];

  const activeItem = menuItems.find(item => item.id === activeTab);
  const ActiveTabComponent = activeItem ? activeItem.component : DashboardTab;

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="brand-section">
          {/* Custom brand SVG logo */}
          <svg width="34" height="34" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <rect width="64" height="64" rx="16" fill="url(#brand-logo-grad)" />
            <path d="M18 42V22C18 20.8954 18.8954 20 20 20H44C45.1046 20 46 20.8954 46 22V42" stroke="#744577" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M24 28H40" stroke="#744577" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M24 35H40" stroke="#744577" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M24 42H32" stroke="#744577" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M37 45L41 49L50 38" stroke="#ACCFA3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="brand-logo-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F0E9B6" />
                <stop offset="100%" stopColor="#84C5B1" />
              </linearGradient>
            </defs>
          </svg>
          <span className="brand-name">{settings.systemName || 'HireDesk'}</span>
          <button className="menu-toggle" onClick={toggleSidebar} style={{ color: '#ffffff', display: 'none' /* Handled by css @media */ }}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  closeSidebar();
                }}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="sidebar-footer">
          <div className="profile-card">
            <div className="profile-avatar">
              {username ? username[0].toUpperCase() : 'M'}
            </div>
            <div className="profile-info">
              <div className="profile-name">{username}</div>
              <div className="profile-role">Recruiter</div>
            </div>
            <button className="logout-btn" onClick={onLogout} title="Log Out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-window">
        {/* Top Header */}
        <header className="main-header">
          <div className="header-title-section">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1 className="header-title">{activeItem ? activeItem.label : 'Dashboard'}</h1>
          </div>

          <div className="header-actions">
            {/* Display simple elegant time indicator to represent professional dashboard */}
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Session: Superuser Active
            </span>
          </div>
        </header>

        {/* Tab Body Contents */}
        <main className="content-body">
          <ActiveTabComponent setActiveTab={setActiveTab} />
        </main>
      </div>

      {/* Responsive mobile sidebar backdrop click to close overlay */}
      {isSidebarOpen && (
        <div 
          onClick={closeSidebar}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: 'rgba(0,0,0,0.3)', 
            zIndex: 95 
          }}
        ></div>
      )}
    </div>
  );
};
export default DashboardLayout;
