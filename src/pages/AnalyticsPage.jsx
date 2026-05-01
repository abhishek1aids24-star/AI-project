import { useState, useMemo } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Plus, Trash2, X, TrendingUp, BookOpen, Award, Clock } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { format, subDays } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6a6a80', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6a6a80', font: { size: 11 } } },
  },
};

function AddRecordModal({ onSave, onClose }) {
  const [subject, setSubject] = useState('');
  const [hours, setHours] = useState('');
  const [topics, setTopics] = useState('');
  const [score, setScore] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !hours) return;
    onSave({ subject: subject.trim(), hours: parseFloat(hours), topics: topics.trim(), score: score ? parseInt(score) : null });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Log Study Session</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input className="form-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Mathematics" autoFocus />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Hours Studied</label>
              <input className="form-input" type="number" step="0.5" min="0.5" value={hours} onChange={e => setHours(e.target.value)} placeholder="2.5" />
            </div>
            <div className="form-group">
              <label className="form-label">Test Score (%)</label>
              <input className="form-input" type="number" min="0" max="100" value={score} onChange={e => setScore(e.target.value)} placeholder="Optional" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Topics Covered</label>
            <input className="form-input" value={topics} onChange={e => setTopics(e.target.value)} placeholder="e.g., Calculus, Derivatives" />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Record</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { studyRecords, addStudyRecord, deleteStudyRecord, getStats } = useData();
  const [showModal, setShowModal] = useState(false);
  const stats = getStats();

  // Weekly study hours for line chart
  const weeklyData = useMemo(() => {
    const labels = [];
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(new Date(), i);
      labels.push(format(d, 'EEE'));
      const dayHours = studyRecords
        .filter(r => new Date(r.date).toDateString() === d.toDateString())
        .reduce((sum, r) => sum + (parseFloat(r.hours) || 0), 0);
      data.push(dayHours);
    }
    return {
      labels,
      datasets: [{
        data,
        borderColor: '#7c5cfc',
        backgroundColor: 'rgba(124, 92, 252, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#7c5cfc',
        pointRadius: 4,
      }],
    };
  }, [studyRecords]);

  // Subject distribution for doughnut
  const subjectData = useMemo(() => {
    const subjects = {};
    studyRecords.forEach(r => {
      subjects[r.subject] = (subjects[r.subject] || 0) + (parseFloat(r.hours) || 0);
    });
    const colors = ['#7c5cfc', '#5c9cfc', '#4ade80', '#fbbf24', '#f87171', '#a78bfa'];
    return {
      labels: Object.keys(subjects),
      datasets: [{
        data: Object.values(subjects),
        backgroundColor: colors.slice(0, Object.keys(subjects).length),
        borderWidth: 0,
      }],
    };
  }, [studyRecords]);

  // Score trend bar chart
  const scoreData = useMemo(() => {
    const withScores = studyRecords.filter(r => r.score != null).slice(0, 10).reverse();
    return {
      labels: withScores.map(r => r.subject?.substring(0, 8) || 'N/A'),
      datasets: [{
        data: withScores.map(r => r.score),
        backgroundColor: withScores.map(r => r.score >= 80 ? 'rgba(74,222,128,0.6)' : r.score >= 60 ? 'rgba(251,191,36,0.6)' : 'rgba(248,113,113,0.6)'),
        borderRadius: 6,
      }],
    };
  }, [studyRecords]);

  // Identify weak areas
  const weakAreas = useMemo(() => {
    const subjectScores = {};
    studyRecords.filter(r => r.score != null).forEach(r => {
      if (!subjectScores[r.subject]) subjectScores[r.subject] = [];
      subjectScores[r.subject].push(r.score);
    });
    return Object.entries(subjectScores)
      .map(([subject, scores]) => ({ subject, avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) }))
      .filter(s => s.avg < 70)
      .sort((a, b) => a.avg - b.avg);
  }, [studyRecords]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Performance Analytics</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={14} /> Log Session</button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Clock size={20} /></div>
          <div className="stat-info"><h4>Total Hours</h4><div className="stat-value">{stats.totalStudyHours}h</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><BookOpen size={20} /></div>
          <div className="stat-info"><h4>Sessions</h4><div className="stat-value">{studyRecords.length}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Award size={20} /></div>
          <div className="stat-info"><h4>Avg Score</h4><div className="stat-value">{stats.avgScore}%</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><TrendingUp size={20} /></div>
          <div className="stat-info"><h4>Weak Areas</h4><div className="stat-value">{weakAreas.length}</div></div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><h3>📈 Weekly Study Hours</h3></div>
          <div className="chart-wrapper">{studyRecords.length > 0 ? <Line data={weeklyData} options={chartOpts} /> : <div className="empty-state"><p>Log study sessions to see trends</p></div>}</div>
        </div>
        <div className="card">
          <div className="card-header"><h3>📊 Score Trend</h3></div>
          <div className="chart-wrapper">{scoreData.labels.length > 0 ? <Bar data={scoreData} options={chartOpts} /> : <div className="empty-state"><p>Add test scores to see performance</p></div>}</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><h3>📚 Subject Distribution</h3></div>
          <div className="chart-wrapper" style={{ height: 240, display: 'flex', justifyContent: 'center' }}>
            {subjectData.labels.length > 0 ? <Doughnut data={subjectData} options={{ ...chartOpts, scales: undefined, plugins: { legend: { position: 'bottom', labels: { color: '#9a9ab0', padding: 12, font: { size: 11 } } } } }} /> : <div className="empty-state"><p>No data yet</p></div>}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>⚠️ Areas to Improve</h3></div>
          {weakAreas.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px 0' }}><p>No weak areas identified — great job! 🎉</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {weakAreas.map(w => (
                <div key={w.subject} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>{w.subject}</span>
                  <span style={{ fontSize: '0.85rem', color: w.avg < 50 ? 'var(--danger)' : 'var(--warning)', fontWeight: 600 }}>{w.avg}%</span>
                  <div className="progress-bar" style={{ width: 100 }}><div className="progress-fill" style={{ width: `${w.avg}%`, background: w.avg < 50 ? 'var(--danger)' : 'var(--warning)' }} /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent records */}
      <div className="card">
        <div className="card-header"><h3>📝 Recent Sessions</h3></div>
        {studyRecords.length === 0 ? (
          <div className="empty-state"><p>No study sessions logged yet</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {studyRecords.slice(0, 10).map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: 70 }}>{format(new Date(r.date), 'MMM d')}</span>
                <span style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>{r.subject}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>{r.hours}h</span>
                {r.score != null && <span className={`badge ${r.score >= 80 ? 'badge-personal' : r.score >= 60 ? 'badge-revision' : 'badge-exam'}`}>{r.score}%</span>}
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => deleteStudyRecord(r.id)}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <AddRecordModal onSave={(data) => { addStudyRecord(data); setShowModal(false); }} onClose={() => setShowModal(false)} />}
    </div>
  );
}
