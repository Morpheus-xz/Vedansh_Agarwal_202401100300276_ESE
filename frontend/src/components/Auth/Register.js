import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import { Users } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h2 className="auth-panel-headline">Start managing your<br />team smarter</h2>
          <p className="auth-panel-sub">
            Set up your HR workspace in minutes. Add employees, monitor performance, and let AI surface the insights that matter.
          </p>
          <div className="auth-features">
            <div className="auth-feature"><span className="auth-feature-dot" />Free to get started</div>
            <div className="auth-feature"><span className="auth-feature-dot" />Full employee lifecycle management</div>
            <div className="auth-feature"><span className="auth-feature-dot" />Promotion & training recommendations</div>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-box">
          <h2>Create your account</h2>
          <p className="auth-subtitle">Set up your HR administrator profile</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Full name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                placeholder="Jane Smith"
                autoComplete="name"
              />
            </div>
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
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
