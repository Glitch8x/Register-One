import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import futLogo from '../assets/fut_minna_logo.png';

const Login = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(studentId, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
      padding: '24px'
    }}>
      <div className="card" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '48px',
        textAlign: 'center',
        background: 'white',
        boxShadow: '0 12px 60px rgba(249, 115, 22, 0.15)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <img src={futLogo} alt="FUT Minna Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', textTransform: 'uppercase' }}>
          Federal University of Technology Minna
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Enter your ID and Password to sign in
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Student ID / Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. STU123"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ padding: '10px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>
               Invalid credentials. Try again.
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }}>
            Login to Account
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--orange-500)', fontWeight: 600 }}>Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
