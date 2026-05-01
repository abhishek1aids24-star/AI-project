import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (!isLogin && !name) { setError('Please enter your name'); return; }

    const result = isLogin ? login(email, password) : signup(name, email, password);
    if (!result.success) setError(result.error);
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-in">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div className="sidebar-logo-icon" style={{ margin: '0 auto 16px', width: 56, height: 56, fontSize: 28 }}>📚</div>
          <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
          <p className="auth-subtitle">{isLogin ? 'Sign in to continue learning' : 'Start your learning journey'}</p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 8 }}>
            {isLogin ? <><LogIn size={16} /> Sign In</> : <><UserPlus size={16} /> Create Account</>}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <a href="#" onClick={e => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </a>
        </div>
      </div>
    </div>
  );
}
