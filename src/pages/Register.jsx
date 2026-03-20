import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import futLogo from '../assets/fut_minna_logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    id: `STU${Math.floor(Math.random() * 900) + 100}`,
    name: '',
    class: '',
    gender: 'Male',
    matricno: '',
    password: ''
  });
  const { register, showToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Registering student:', formData);
    
    // Ensure all mandatory fields are present
    if (!formData.name || !formData.class || !formData.matricno) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const success = await register(formData);
    if (success) {
      navigate('/dashboard');
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
        maxWidth: '480px',
        width: '100%',
        padding: '40px',
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
          Student Registration Portal
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Student ID</label>
              <input
                type="text"
                className="form-input"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Class</label>
              <select
                className="form-input"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                required
              >
                <option value="">Select Class</option>
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
                <option value="Year 5">Year 5</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-input"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Matric Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. MAT/2021/001"
                value={formData.matricno}
                onChange={(e) => setFormData({ ...formData, matricno: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Create Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '12px' }}>
            Register Now
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--orange-500)', fontWeight: 600 }}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
