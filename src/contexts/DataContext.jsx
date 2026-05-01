import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage, generateId } from '../utils/storage';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.id || 'guest';

  const key = useCallback((k) => `${uid}_${k}`, [uid]);

  // === TASKS / EVENTS (Agent 1: Planner) ===
  const [tasks, setTasks] = useState([]);

  useEffect(() => { setTasks(storage.get(key('tasks'), [])); }, [key]);
  useEffect(() => { storage.set(key('tasks'), tasks); }, [tasks, key]);

  const addTask = (task) => {
    const newTask = { id: generateId(), createdAt: new Date().toISOString(), completed: false, ...task };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };
  const updateTask = (id, updates) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  // === STUDY RECORDS (Agent 2: Analytics) ===
  const [studyRecords, setStudyRecords] = useState([]);

  useEffect(() => { setStudyRecords(storage.get(key('studyRecords'), [])); }, [key]);
  useEffect(() => { storage.set(key('studyRecords'), studyRecords); }, [studyRecords, key]);

  const addStudyRecord = (record) => {
    const newRecord = { id: generateId(), date: new Date().toISOString(), ...record };
    setStudyRecords(prev => [newRecord, ...prev]);
    return newRecord;
  };

  const deleteStudyRecord = (id) => setStudyRecords(prev => prev.filter(r => r.id !== id));

  // === DAILY LOGS (Agent 3: Daily Monitor) ===
  const [dailyLogs, setDailyLogs] = useState([]);

  useEffect(() => { setDailyLogs(storage.get(key('dailyLogs'), [])); }, [key]);
  useEffect(() => { storage.set(key('dailyLogs'), dailyLogs); }, [dailyLogs, key]);

  const addDailyLog = (log) => {
    const today = new Date().toDateString();
    const existing = dailyLogs.find(l => new Date(l.date).toDateString() === today);
    if (existing) {
      setDailyLogs(prev => prev.map(l => l.id === existing.id ? { ...l, ...log } : l));
      return existing;
    }
    const newLog = { id: generateId(), date: new Date().toISOString(), ...log };
    setDailyLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  // === CHAT HISTORY (Agent 4: Chatbot) ===
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => { setChatHistory(storage.get(key('chatHistory'), [])); }, [key]);
  useEffect(() => { storage.set(key('chatHistory'), chatHistory); }, [chatHistory, key]);

  const addChatMessage = (msg) => {
    const newMsg = { id: generateId(), timestamp: new Date().toISOString(), ...msg };
    setChatHistory(prev => [...prev, newMsg]);
    return newMsg;
  };

  const clearChat = () => setChatHistory([]);

  // === COMPUTED STATS ===
  const getStats = useCallback(() => {
    const today = new Date().toDateString();
    const todayTasks = tasks.filter(t => t.date && new Date(t.date).toDateString() === today);
    const completedToday = todayTasks.filter(t => t.completed).length;
    const totalStudyHours = studyRecords.reduce((sum, r) => sum + (parseFloat(r.hours) || 0), 0);
    const avgScore = studyRecords.length > 0
      ? Math.round(studyRecords.filter(r => r.score).reduce((sum, r) => sum + r.score, 0) / studyRecords.filter(r => r.score).length)
      : 0;

    // Streak calculation
    let streak = 0;
    const sortedLogs = [...dailyLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
    const checkDate = new Date();
    for (const log of sortedLogs) {
      if (new Date(log.date).toDateString() === checkDate.toDateString()) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else break;
    }

    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      todayTasks: todayTasks.length,
      completedToday,
      totalStudyHours: Math.round(totalStudyHours * 10) / 10,
      avgScore,
      streak,
      totalLogs: dailyLogs.length,
    };
  }, [tasks, studyRecords, dailyLogs]);

  return (
    <DataContext.Provider value={{
      tasks, addTask, updateTask, deleteTask, toggleTask,
      studyRecords, addStudyRecord, deleteStudyRecord,
      dailyLogs, addDailyLog,
      chatHistory, addChatMessage, clearChat,
      getStats,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
