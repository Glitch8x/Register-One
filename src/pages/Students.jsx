import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportToExcel, readExcel } from '../utils/export';

const Students = () => {
  const { students, addStudent, updateStudent, deleteStudent, addBulkStudents, loading, showToast } = useApp();
  if (loading) return <div className="loading-screen"><div className="loading-spinner"></div><p>Loading students registry...</p></div>;
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    class: '',
    gender: 'Male',
    matricno: ''
  });

  const handleOpen = (s = null) => {
    if (s) {
      setFormData(s);
      setEditingId(s.id);
    } else {
      setFormData({ id: `STU${Math.floor(Math.random() * 900) + 100}`, name: '', class: '', gender: 'Male', matricno: '' });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (editingId) {
      await updateStudent(editingId, formData);
    } else {
      await addStudent(formData);
    }
    setIsSubmitting(false);
    setShowModal(false);
  };

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const data = await readExcel(file);
      await addBulkStudents(data);
      showToast(`${data.length} students uploaded successfully!`);
    } catch (err) {
      showToast('Error uploading file. Please check the format.', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-header-title">Students Registry</h1>
          <p className="page-header-sub">Manage student profiles and enrollment data.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <label className={`btn btn-secondary ${isUploading ? 'disabled' : ''}`} style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}>
            <span>{isUploading ? '⌛' : '📤'}</span> {isUploading ? 'Uploading...' : 'Bulk Upload'}
            {!isUploading && <input type="file" hidden accept=".xlsx, .xls, .csv" onChange={handleBulkUpload} />}
          </label>
          <button className="btn btn-secondary" onClick={() => exportToExcel(students, `Students_Registry`)}>
            <span>📁</span> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => handleOpen()}>
            <span>➕</span> Add Student
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--gray-100)' }}>
          <div className="search-wrap" style={{ maxWidth: '400px' }}>
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Search by name or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Class</th>
                <th>Gender</th>
                <th>Matric Number</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.class}</td>
                  <td>{s.gender}</td>
                  <td>{s.matricno || s.dob}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpen(s)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => { if(window.confirm('Delete student?')) { deleteStudent(s.id); showToast('Student deleted'); } }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <div className="empty-state-icon">👥</div>
                    <div className="empty-state-title">No students found</div>
                    <div className="empty-state-desc">Try a different search term or add a new student.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Edit Student' : 'New Student Registration'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Student ID</label>
                <input 
                  className="form-input" 
                  value={formData.id} 
                  onChange={e => setFormData({...formData, id: e.target.value})} 
                  required 
                  disabled={editingId}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  className="form-input" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="Enter full name"
                  required 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Class</label>
                  <select 
                    className="form-input" 
                    value={formData.class} 
                    onChange={e => setFormData({...formData, class: e.target.value})}
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
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select 
                    className="form-input" 
                    value={formData.gender} 
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Matric Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.matricno} 
                  onChange={e => setFormData({...formData, matricno: e.target.value})} 
                  placeholder="Enter matric number"
                  required 
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" disabled={isSubmitting} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : (editingId ? 'Save Changes' : 'Register Student')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
