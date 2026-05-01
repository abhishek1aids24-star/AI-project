import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Flame, TrendingUp, Plus, CalendarDays, BarChart3, Activity, MessageCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, getStats } = useData();
  const stats = getStats();
  const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 5);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickLinks = [
    { to: '/planner', icon: CalendarDays, label: 'Planner', color: 'purple' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics', color: 'blue' },
    { to: '/daily', icon: Activity, label: 'Daily Log', color: 'green' },
    { to: '/chat', icon: MessageCircle, label: 'AI Tutor', color: 'orange' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{greeting()}, {user?.name?.split(' ')[0] || 'Student'} 👋</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Here's your learning overview for today.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon purple"><CheckCircle size={20} /></div>
          <div className="stat-info">
            <h4>Tasks Done</h4>
            <div className="stat-value">{stats.completedToday}/{stats.todayTasks}</div>
            <div className="stat-change up">Today's progress</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Clock size={20} /></div>
          <div className="stat-info">
            <h4>Study Hours</h4>
            <div className="stat-value">{stats.totalStudyHours}h</div>
            <div className="stat-change up">Total logged</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><Flame size={20} /></div>
          <div className="stat-info">
            <h4>Day Streak</h4>
            <div className="stat-value">{stats.streak} 🔥</div>
            <div className="stat-change up">Keep it going!</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><TrendingUp size={20} /></div>
          <div className="stat-info">
            <h4>Avg Score</h4>
            <div className="stat-value">{stats.avgScore}%</div>
            <div className="stat-change up">Performance</div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="card-header">
            <h3>📋 Upcoming Tasks</h3>
            <Link to="/planner" className="btn btn-ghost btn-sm"><Plus size={14} /> Add</Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <p style={{ fontSize: '0.85rem' }}>No pending tasks. Add some in the Planner!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {upcomingTasks.map(task => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: task.category === 'exam' ? 'var(--danger)' : task.category === 'revision' ? 'var(--warning)' : 'var(--accent-primary)', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>{task.title}</span>
                  <span className={`badge badge-${task.category || 'study'}`}>{task.category || 'study'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>⚡ Quick Access</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {quickLinks.map(link => (
              <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', transition: 'var(--transition)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-active)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <div className={`stat-icon ${link.color}`} style={{ width: 36, height: 36 }}><link.icon size={16} /></div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>{link.label}</span>
                </div>
              </Link>
            ))}
          </div>

          {stats.streak > 0 && (
            <div className="streak-display" style={{ marginTop: 16 }}>
              <span className="streak-flame">🔥</span>
              <div>
                <span className="streak-count">{stats.streak}</span>
                <span className="streak-label"> day streak</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
