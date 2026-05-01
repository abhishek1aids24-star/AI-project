import { useState, useMemo } from 'react';
import { Plus, Flame, Target, TrendingUp, CheckCircle, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { format, subDays } from 'date-fns';

function LogModal({ onSave, onClose }) {
  const [hoursStudied, setHours] = useState('');
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [mood, setMood] = useState('good');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hoursStudied) return;
    onSave({ hoursStudied: parseFloat(hoursStudied), tasksCompleted: parseInt(tasksCompleted) || 0, mood, notes });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Log Today's Activity</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Hours Studied</label>
              <input className="form-input" type="number" step="0.5" min="0" value={hoursStudied} onChange={e => setHours(e.target.value)} placeholder="3.5" autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Tasks Completed</label>
              <input className="form-input" type="number" min="0" value={tasksCompleted} onChange={e => setTasksCompleted(e.target.value)} placeholder="5" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">How was your day?</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { val: 'great', emoji: '🤩', label: 'Great' },
                { val: 'good', emoji: '😊', label: 'Good' },
                { val: 'okay', emoji: '😐', label: 'Okay' },
                { val: 'bad', emoji: '😞', label: 'Bad' },
              ].map(m => (
                <button key={m.val} type="button"
                  className={`btn ${mood === m.val ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, flexDirection: 'column', gap: 4, padding: '10px 8px' }}
                  onClick={() => setMood(m.val)}>
                  <span style={{ fontSize: '1.2rem' }}>{m.emoji}</span>
                  <span style={{ fontSize: '0.7rem' }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes & Reflections</label>
            <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="What did you learn today? Any challenges?" rows={3} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Log</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DailyMonitorPage() {
  const { dailyLogs, addDailyLog, getStats } = useData();
  const [showModal, setShowModal] = useState(false);
  const stats = getStats();

  const todayLog = dailyLogs.find(l => new Date(l.date).toDateString() === new Date().toDateString());

  // Last 7 days
  const weekData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const log = dailyLogs.find(l => new Date(l.date).toDateString() === d.toDateString());
      return { date: d, log, dayName: format(d, 'EEE'), dayNum: format(d, 'd') };
    });
  }, [dailyLogs]);

  const weeklyHours = weekData.reduce((sum, d) => sum + (d.log?.hoursStudied || 0), 0);
  const weeklyTasks = weekData.reduce((sum, d) => sum + (d.log?.tasksCompleted || 0), 0);
  const completionRate = weekData.filter(d => d.log).length;
  const maxHours = Math.max(...weekData.map(d => d.log?.hoursStudied || 0), 1);

  const moodEmoji = { great: '🤩', good: '😊', okay: '😐', bad: '😞' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Daily Monitoring</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          <Plus size={14} /> {todayLog ? 'Update Today' : 'Log Today'}
        </button>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon orange"><Flame size={20} /></div>
          <div className="stat-info"><h4>Current Streak</h4><div className="stat-value">{stats.streak} 🔥</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><TrendingUp size={20} /></div>
          <div className="stat-info"><h4>This Week</h4><div className="stat-value">{weeklyHours}h</div><div className="stat-change up">{weeklyTasks} tasks done</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle size={20} /></div>
          <div className="stat-info"><h4>Consistency</h4><div className="stat-value">{completionRate}/7</div><div className="stat-change up">days logged</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Target size={20} /></div>
          <div className="stat-info"><h4>Today</h4><div className="stat-value">{todayLog ? `${todayLog.hoursStudied}h` : '—'}</div><div className="stat-change">{todayLog ? moodEmoji[todayLog.mood] : 'Not logged'}</div></div>
        </div>
      </div>

      {/* Week at a glance */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><h3>📅 Week at a Glance</h3></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {weekData.map((d, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6 }}>{d.dayName}</div>
              {/* Bar */}
              <div style={{ height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 6 }}>
                <div style={{
                  width: '60%',
                  height: `${d.log ? Math.max((d.log.hoursStudied / maxHours) * 100, 10) : 5}%`,
                  background: d.log ? 'var(--accent-gradient)' : 'var(--bg-input)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.6s ease',
                  minHeight: 4,
                }} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{d.dayNum}</div>
              {d.log && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d.log.hoursStudied}h</div>}
              {d.log && <div style={{ fontSize: '0.85rem', marginTop: 2 }}>{moodEmoji[d.log.mood] || '—'}</div>}
            </div>
          ))}
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Weekly completion</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{Math.round((completionRate / 7) * 100)}%</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${(completionRate / 7) * 100}%` }} /></div>
        </div>
      </div>

      {/* Log history */}
      <div className="card">
        <div className="card-header"><h3>📝 Activity History</h3></div>
        {dailyLogs.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📓</div><h4>No daily logs yet</h4><p>Start tracking your daily progress!</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dailyLogs.slice(0, 14).map(log => (
              <div key={log.id} className="daily-log-entry">
                <div className="log-date">{format(new Date(log.date), 'EEEE, MMMM d')} {moodEmoji[log.mood] || ''}</div>
                <div className="log-content">
                  <div className="log-stat"><label>Hours</label><span>{log.hoursStudied}h</span></div>
                  <div className="log-stat"><label>Tasks</label><span>{log.tasksCompleted}</span></div>
                  <div className="log-stat"><label>Mood</label><span>{log.mood}</span></div>
                </div>
                {log.notes && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 10, fontStyle: 'italic' }}>"{log.notes}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <LogModal onSave={(data) => { addDailyLog(data); setShowModal(false); }} onClose={() => setShowModal(false)} />}
    </div>
  );
}
