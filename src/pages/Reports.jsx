import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { calculateGrade, getStatusBadgeClass, calculateAverage, calculateGPA } from '../utils/grading';
import { exportToExcel, exportToPDF } from '../utils/export';
import { logoBase64 } from '../assets/logoData';

const Reports = () => {
  const { students, results, loading } = useApp();
  if (loading) return <div className="loading-screen"><div className="loading-spinner"></div><p>Preparing reports database...</p></div>;
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('First');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  
  // New template fields
  const [schoolName, setSchoolName] = useState('FEDERAL UNIVERSITY OF TECHNOLOGY MINNA');
  const [teacherName, setTeacherName] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportNotes, setReportNotes] = useState('');

  const studentData = students.find(s => s.id === selectedStudent);
  const studentResults = results.filter(r => 
    r.studentId === selectedStudent && 
    (r.semester === selectedSemester || r.term === selectedSemester) && 
    r.year === selectedYear
  );

  const avg = calculateAverage(studentResults);
  const gpa = calculateGPA(studentResults);

  // Group by level
  const resultsByLevel = studentResults.reduce((acc, r) => {
    const level = r.level || '100L';
    if (!acc[level]) acc[level] = [];
    acc[level].push(r);
    return acc;
  }, {});

  const levels = ['100L', '200L', '300L', '400L', '500L', 'CCMASS'];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const dataByLevel = {};
    levels.forEach(level => {
      if (resultsByLevel[level]) {
        dataByLevel[level] = resultsByLevel[level].map(r => {
          const { grade, status } = calculateGrade(r.score);
          return [r.subject, r.score, grade, status];
        });
      }
    });

    exportToPDF({
      fileName: `${studentData?.name}_Result_${selectedSemester}`,
      title: 'Student Progress Report',
      school: schoolName,
      teacher: teacherName,
      date: reportDate,
      selectedSemester: selectedSemester,
      dataByLevel: dataByLevel,
      notes: reportNotes,
      studentName: studentData?.name,
      logo: logoBase64
    });
  };

  return (
    <div>
      <div className="section-header no-print">
        <div>
          <h1 className="page-header-title">Student Report Cards</h1>
          <p className="page-header-sub">Generate and export printable reports.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input 
              className="form-input" 
              placeholder="Search Student..." 
              style={{ width: '150px' }}
              value={studentSearch} 
              onChange={e => setStudentSearch(e.target.value)} 
            />
          </div>
          <select 
            className="form-input" 
            style={{ width: '180px' }}
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
          >
            <option value="">Choose Student</option>
            {students.filter(s => 
              s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
              s.id.toLowerCase().includes(studentSearch.toLowerCase())
            ).map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
          </select>
          <select 
             className="form-input" 
             style={{ width: '130px' }}
             value={selectedSemester}
             onChange={e => setSelectedSemester(e.target.value)}
          >
            <option value="First">First Semester</option>
            <option value="Second">Second Semester</option>
          </select>
          <button className="btn btn-secondary" disabled={!selectedStudent || studentResults.length === 0} onClick={handleDownload}>
             <span>💾</span> Download PDF
          </button>
          <button className="btn btn-primary" disabled={!selectedStudent} onClick={handlePrint}>
             <span>🖨️</span> Print Report
          </button>
        </div>
      </div>

      {selectedStudent && (
        <div className="card no-print" style={{ marginTop: '20px', padding: '20px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>Template Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">School Name</label>
              <input className="form-input" value={schoolName} onChange={e => setSchoolName(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Level Adviser</label>
              <input className="form-input" value={teacherName} onChange={e => setTeacherName(e.target.value)} placeholder="Enter name" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Report Date</label>
              <input type="date" className="form-input" value={reportDate} onChange={e => setReportDate(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '32px' }}>
        {selectedStudent ? (
          studentResults.length > 0 ? (
            <div className="report-card">
              <div className="report-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <img src={logoBase64} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                <div style={{ textAlign: 'center' }}>
                  <div className="report-school-name" style={{ fontSize: '1.4rem' }}>{schoolName.toUpperCase()}</div>
                  <div className="report-subtitle">Student Progress Report</div>
                </div>
              </div>

              <div className="report-info-grid">
                <div>
                  <span className="report-info-label">Student's Name: </span>
                  <span className="report-info-value">{studentData?.name}</span>
                </div>
                <div>
                  <span className="report-info-label">Date: </span>
                  <span className="report-info-value">{reportDate}</span>
                </div>
                <div>
                  <span className="report-info-label">Level Adviser's Name: </span>
                  <span className="report-info-value">{teacherName || '____________________'}</span>
                </div>
                <div>
                  <span className="report-info-label">SEMESTER / YEAR: </span>
                  <span className="report-info-value">{selectedSemester} Semester, {selectedYear}</span>
                </div>
              </div>

              {levels.map(level => resultsByLevel[level] && (
                <div key={level} style={{ marginTop: '20px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--orange-600)', borderBottom: '2px solid var(--orange-100)', display: 'inline-block', paddingRight: '12px' }}>
                    {level === 'CCMASS' ? 'CCMASS CURRICULUM' : `${level} LEVEL`}
                  </div>
                  <div className="table-wrapper">
                    <table style={{ border: '1.5px solid var(--orange-100)' }}>
                      <thead>
                        <tr>
                          <th style={{ background: 'var(--orange-50)', width: '40%' }}>SUBJECT</th>
                          <th style={{ background: 'var(--orange-50)' }}>SCORE</th>
                          <th style={{ background: 'var(--orange-50)' }}>GRADE</th>
                          <th style={{ background: 'var(--orange-50)' }}>REMARK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultsByLevel[level].map(r => {
                          const { grade, status } = calculateGrade(r.score);
                          return (
                            <tr key={r.id}>
                              <td>{r.subject}</td>
                              <td>{r.score}</td>
                              <td><b>{grade}</b></td>
                              <td>{status}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}





              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
                <div style={{ textAlign: 'center', width: '250px' }}>
                  <div style={{ borderTop: '1.5px solid #333', paddingTop: '6px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>Level Adviser's Signature</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
               <div className="empty-state-icon">📄</div>
               <div className="empty-state-title">No Results Found</div>
               <div className="empty-state-desc">No academic records available for this student in the selected semester.</div>
            </div>
          )
        ) : (
          <div className="empty-state">
             <div className="empty-state-icon">👤</div>
             <div className="empty-state-title">Select a Student</div>
             <div className="empty-state-desc">Choose a student from the dropdown to view their report card.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
