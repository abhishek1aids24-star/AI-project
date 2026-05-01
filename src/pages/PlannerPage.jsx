import { useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight, Edit2, Trash2, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, format, isSameMonth, isSameDay, addWeeks, subWeeks } from 'date-fns';

const CATEGORIES = ['study', 'exam', 'revision', 'personal'];

function TaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || '');
  const [date, setDate] = useState(task?.date ? format(new Date(task.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(task?.time || '09:00');
  const [category, setCategory] = useState(task?.category || 'study');
  const [description, setDescription] = useState(task?.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), date, time, category, description });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{task ? 'Edit Task' : 'New Task'}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Study Chapter 5" autoFocus />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input className="form-input" type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Notes..." rows={3} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PlannerPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();

  // Month view calendar days
  const calendarDays = useMemo(() => {
    if (view !== 'month') return [];
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    const days = [];
    let day = calStart;
    while (day <= calEnd) { days.push(new Date(day)); day = addDays(day, 1); }
    return days;
  }, [currentDate, view]);

  // Week view days
  const weekDays = useMemo(() => {
    if (view !== 'week') return [];
    const weekStart = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [currentDate, view]);

  const getTasksForDate = (date) => tasks.filter(t => t.date && isSameDay(new Date(t.date), date));

  const handleNav = (dir) => {
    if (view === 'month') setCurrentDate(dir === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(dir === 1 ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, dir));
  };

  const handleAddTask = (data) => {
    if (editingTask) { updateTask(editingTask.id, data); }
    else { addTask(data); }
    setShowModal(false);
    setEditingTask(null);
  };

  const dayTasks = selectedDate ? getTasksForDate(selectedDate) : view === 'day' ? getTasksForDate(currentDate) : [];
  const categoryColors = { study: 'var(--accent-primary)', exam: 'var(--danger)', revision: 'var(--warning)', personal: 'var(--success)' };

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-icon" onClick={() => handleNav(-1)}><ChevronLeft size={18} /></button>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, minWidth: 180, textAlign: 'center' }}>
            {view === 'month' ? format(currentDate, 'MMMM yyyy') : view === 'week' ? `Week of ${format(startOfWeek(currentDate), 'MMM d')}` : format(currentDate, 'EEEE, MMM d, yyyy')}
          </h3>
          <button className="btn btn-ghost btn-icon" onClick={() => handleNav(1)}><ChevronRight size={18} /></button>
          <button className="btn btn-ghost btn-sm" onClick={() => setCurrentDate(new Date())}>Today</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {['day', 'week', 'month'].map(v => (
              <button key={v} className={`tab-btn ${view === v ? 'active' : ''}`} onClick={() => { setView(v); setSelectedDate(null); }}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => { setEditingTask(null); setShowModal(true); }}>
            <Plus size={14} /> Add Task
          </button>
        </div>
      </div>

      {/* Month View */}
      {view === 'month' && (
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="calendar-header-cell">{d}</div>
          ))}
          {calendarDays.map((day, i) => {
            const dayTaskList = getTasksForDate(day);
            return (
              <div key={i} className={`calendar-cell ${isSameDay(day, today) ? 'today' : ''} ${!isSameMonth(day, currentDate) ? 'other-month' : ''}`}
                onClick={() => { setSelectedDate(day); setView('day'); setCurrentDate(day); }}>
                <div className="day-num">{format(day, 'd')}</div>
                {dayTaskList.slice(0, 3).map(t => (
                  <div key={t.id} className="calendar-event" style={{ background: `${categoryColors[t.category] || categoryColors.study}22`, color: categoryColors[t.category] || categoryColors.study }}>
                    {t.title}
                  </div>
                ))}
                {dayTaskList.length > 3 && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>+{dayTaskList.length - 3} more</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* Week View */}
      {view === 'week' && (
        <div className="calendar-grid">
          {weekDays.map((day, i) => (
            <div key={i} className="calendar-header-cell">{format(day, 'EEE d')}</div>
          ))}
          {weekDays.map((day, i) => {
            const dayTaskList = getTasksForDate(day);
            return (
              <div key={i} className={`calendar-cell ${isSameDay(day, today) ? 'today' : ''}`} style={{ minHeight: 140 }}
                onClick={() => { setView('day'); setCurrentDate(day); }}>
                {dayTaskList.map(t => (
                  <div key={t.id} className="calendar-event" style={{ background: `${categoryColors[t.category] || categoryColors.study}22`, color: categoryColors[t.category] || categoryColors.study, marginBottom: 4 }}>
                    {t.time && <span style={{ fontWeight: 600 }}>{t.time} </span>}
                    {t.title}
                  </div>
                ))}
                {dayTaskList.length === 0 && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 20 }}>No tasks</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* Day View */}
      {view === 'day' && (
        <div>
          {dayTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h4>No tasks for this day</h4>
              <p>Click "Add Task" to schedule something</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {dayTasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className={`task-checkbox ${task.completed ? 'checked' : ''}`} onClick={() => toggleTask(task.id)}>
                    {task.completed && <span style={{ color: 'white', fontSize: '0.7rem' }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="task-title">{task.title}</div>
                    {task.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{task.description}</p>}
                  </div>
                  <div className="task-meta">
                    {task.time && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{task.time}</span>}
                    <span className={`badge badge-${task.category || 'study'}`}>{task.category || 'study'}</span>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { setEditingTask(task); setShowModal(true); }}><Edit2 size={14} /></button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => deleteTask(task.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <TaskModal
          task={editingTask}
          onSave={handleAddTask}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
}
