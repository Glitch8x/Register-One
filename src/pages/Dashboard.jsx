import React from 'react';
import { useApp } from '../context/AppContext';
import { getAcademicStats, calculateGrade, getStatusBadgeClass } from '../utils/grading';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const { students, results, user, loading } = useApp();
  if (loading) return <div className="loading-screen"><div className="loading-spinner"></div><p>Fetching dashboard data...</p></div>;
  const stats = getAcademicStats(students, results);

  // Prepare chart data: Grade Distribution
  const gradeCounts = results.reduce((acc, r) => {
    const { grade } = calculateGrade(r.score);
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(gradeCounts).map(g => ({ name: g, value: gradeCounts[g] }));
  const COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#fbbf24'];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header-title">Welcome back, {user?.name || 'Admin'}</h1>
        <p className="page-header-sub">Here's what's happening in your school today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', border: 'none' }}>
          <div className="stat-card-icon" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>👥</div>
          <div className="stat-card-value" style={{ color: '#fff' }}>{students.length}</div>
          <div className="stat-card-label" style={{ color: 'rgba(255,255,255,0.85)' }}>Total Students</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', border: 'none' }}>
          <div className="stat-card-icon" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>📈</div>
          <div className="stat-card-value" style={{ color: '#fff' }}>{stats.avgScore}%</div>
          <div className="stat-card-label" style={{ color: 'rgba(255,255,255,0.85)' }}>Average Score</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', border: 'none' }}>
          <div className="stat-card-icon" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>✅</div>
          <div className="stat-card-value" style={{ color: '#fff' }}>{stats.passRate}%</div>
          <div className="stat-card-label" style={{ color: 'rgba(255,255,255,0.85)' }}>Pass Rate</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', border: 'none' }}>
          <div className="stat-card-icon" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>🏆</div>
          <div className="stat-card-value" style={{ fontSize: '1.2rem', paddingTop: '8px', color: '#fff' }}>{stats.topScorer}</div>
          <div className="stat-card-label" style={{ color: 'rgba(255,255,255,0.85)' }}>Top Performer</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Grade Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
           <div className="section-header">
             <h3 className="section-title">Recent Result Entries</h3>
           </div>
           <div className="table-wrapper">
             <table>
               <thead>
                 <tr>
                   <th>Student</th>
                   <th>Subject</th>
                   <th>Score</th>
                   <th>Grade</th>
                 </tr>
               </thead>
               <tbody>
                 {results.slice(-5).reverse().map(r => {
                   const student = students.find(s => s.id === r.studentId);
                   const { grade } = calculateGrade(r.score);
                   return (
                     <tr key={r.id}>
                       <td>{student?.name || r.studentId}</td>
                       <td>{r.subject}</td>
                       <td>{r.score}</td>
                       <td>
                         <span className={`badge ${getStatusBadgeClass(grade)}`}>{grade}</span>
                       </td>
                     </tr>
                   );
                 })}
                 {results.length === 0 && (
                   <tr>
                     <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No results recorded yet.</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
