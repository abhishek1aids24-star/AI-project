import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, BarChart3, Activity, MessageCircle, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/planner', icon: CalendarDays, label: 'Planner' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/daily', icon: Activity, label: 'Daily Log' },
  { to: '/chat', icon: MessageCircle, label: 'AI Tutor' },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  return (
    <div className="app-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">📚</div>
          <h1>StudyFlow</h1>
          <button className="mobile-toggle" onClick={() => setSidebarOpen(false)} style={{ marginLeft: 'auto' }}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => isActive || (item.to !== '/' && location.pathname.startsWith(item.to)) ? 'active' : ''}
              onClick={() => setSidebarOpen(false)}
              end={item.to === '/'}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <p>{user?.name || 'Student'}</p>
            <span>{user?.email || ''}</span>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={logout} title="Logout" style={{ marginLeft: 'auto' }}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <h2>{navItems.find(n => n.to === location.pathname)?.label || 'StudyFlow'}</h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </header>
        <div className="page-body animate-in">
          {children}
        </div>
      </main>

      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
