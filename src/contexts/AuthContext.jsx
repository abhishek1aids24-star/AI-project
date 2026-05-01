import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.get('user', null));

  useEffect(() => {
    if (user) storage.set('user', user);
    else storage.remove('user');
  }, [user]);

  const login = (email, password) => {
    const users = storage.get('users', []);
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const userData = { id: found.id, name: found.name, email: found.email };
      setUser(userData);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (name, email, password) => {
    const users = storage.get('users', []);
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }
    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    storage.set('users', users);
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(userData);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    storage.remove('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
