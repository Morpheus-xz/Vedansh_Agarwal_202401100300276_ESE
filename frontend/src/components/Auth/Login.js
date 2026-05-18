import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import { Users } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-panel-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Users size={20} color="#fff" />
            </div>
          </div>
          <h2 className="auth-panel-headline">People Operations,<br />Powered by AI</h2>
          <p className="auth-panel-sub">
            Centralize your workforce data, track performance, and get intelligent recommendations — all in one place.
          </p>
          <div className="auth-features">
            <div className="auth-feature"><span className="auth-feature-dot" />Employee management & directory</div>
            <div className="auth-feature"><span className="auth-feature-dot" />Performance tracking & analytics</div>
            <div className="auth-feature"><span className="auth-feature-dot" />AI-powered HR insights</div>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-box">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
