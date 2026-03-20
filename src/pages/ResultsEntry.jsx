import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateGrade, getStatusBadgeClass } from '../utils/grading';

const ResultsEntry = () => {
  const { students, results, addResult, deleteResult, loading, showToast } = useApp();
  if (loading) return <div className="loading-screen"><div className="loading-spinner"></div><p>Synchronizing exam records...</p></div>;
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    score: '',
    semester: 'First',
    level: '100L',
    year: new Date().getFullYear().toString()
  });
  const [studentSearch, setStudentSearch] = useState('');

  const subjectsByLevel = {
    '100L': ['GNS 101', 'MTH 101', 'MTH 102', 'PHY 101', 'PHY 102', 'CHM 101', 'CHM 102', 'GST 111', 'Workshop Practice I'],
    '200L': ['Engineering Maths I', 'Engineering Maths II', 'Thermodynamics', 'Fluid Mechanics', 'Strength of Materials', 'Electrical Engineering I', 'Computer Programming'],
    '300L': ['Engineering Maths III', 'Control Systems', 'Machine Design I', 'Heat Transfer', 'Manufacturing Technology', 'Electrical Machines'],
    '400L': ['Industrial Training (SIWES)', 'Machine Design II', 'Theory of Machines', 'Internal Combustion Engines'],
    '500L': ['Final Year Project', 'Power Plant Engineering', 'Mechatronics', 'Engineering Management', 'Refrigeration & AC'],
    'CCMASS': ['Core Engineering Standards', 'Professional Ethics', 'Entrepreneurship', 'Research Methodology']
  };

  const levels = ['100L', '200L', '300L', '400L', '500L', 'CCMASS'];
  const currentSubjects = subjectsByLevel[formData.level] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const score = parseInt(formData.score);
    if (isNaN(score) || score < 0 || score > 100) {
      showToast('Invalid score. Must be between 0 and 100.', 'error');
      return;
    }

    await addResult({ ...formData, score });
    showToast('Result recorded successfully!');
    setFormData({ ...formData, studentId: '', score: '' });
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-header-title">Enter Exam Results</h1>
          <p className="page-header-sub">Record marks for individual students and subjects.</p>
        </div>
      </div>

      <div className="charts-grid" style={{ marginTop: '24px', gridTemplateColumns: 'minmax(300px, 400px) 1fr' }}>
        <div className="card" style={{ padding: '32px', height: 'fit-content' }}>
          <h2 className="section-title" style={{ marginBottom: '24px' }}>Result Details</h2>
          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-group">
              <label className="form-label">Student</label>
              <div style={{ position: 'relative' }}>
                <input 
                   className="form-input" 
                   placeholder="Search student by name or ID..." 
                   value={studentSearch}
                   onChange={e => setStudentSearch(e.target.value)}
                   style={{ marginBottom: '8px' }}
                />
                <select 
                  className="form-input" 
                  value={formData.studentId} 
                  onChange={e => setFormData({...formData, studentId: e.target.value})}
                  required
                >
                  <option value="">Select Student</option>
                  {students.filter(s => 
                    s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                    s.id.toLowerCase().includes(studentSearch.toLowerCase())
                  ).slice(0, 100).map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                </select>
                {studentSearch && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Showing results for "{studentSearch}"
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Academic Level</label>
                <select 
                  className="form-input" 
                  value={formData.level} 
                  onChange={e => setFormData({...formData, level: e.target.value})}
                  required
                >
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select 
                  className="form-input" 
                  value={formData.subject} 
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  required
                >
                  <option value="">Select Subject</option>
                  {currentSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Semester</label>
                <select 
                  className="form-input" 
                  value={formData.semester} 
                  onChange={e => setFormData({...formData, semester: e.target.value})}
                  required
                >
                  <option value="First">First Semester</option>
                  <option value="Second">Second Semester</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <input 
                  className="form-input" 
                  value={formData.year} 
                  onChange={e => setFormData({...formData, year: e.target.value})}
                  placeholder="2025"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Marks Obtained (0-100)</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number"
                  className="form-input" 
                  value={formData.score} 
                  onChange={e => setFormData({...formData, score: e.target.value})} 
                  placeholder="85"
                  required 
                  min="0"
                  max="100"
                />
                {formData.score && (
                   <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange-600)' }}>
                     Grade: {calculateGrade(formData.score).grade}
                   </span>
                )}
              </div>
            </div>



            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>Save Result</button>
          </form>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div className="section-header">
            <h3 className="section-title">Recent Records</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Score</th>
                  <th>Semester</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.slice().reverse().map(r => {
                  const s = students.find(stu => stu.id === r.studentId);
                  return (
                    <tr key={r.id}>
                      <td>{s?.name || r.studentId}</td>
                      <td>{r.subject}</td>
                      <td>{r.score}</td>
                      <td>{r.semester || r.term}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => deleteResult(r.id)}>🗑️</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsEntry;
