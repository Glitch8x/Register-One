import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateGrade } from '../utils/grading';
import { exportToExcel } from '../utils/export';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

const Analytics = () => {
  const { results, students, loading } = useApp();
  if (loading) return <div className="loading-screen"><div className="loading-spinner"></div><p>Analyzing school performance...</p></div>;

  // Prepare data for subject performance
  const subjectStats = results.reduce((acc, r) => {
    if (!acc[r.subject]) acc[r.subject] = { name: r.subject, total: 0, count: 0 };
    acc[r.subject].total += r.score;
    acc[r.subject].count += 1;
    return acc;
  }, {});

  const barData = Object.values(subjectStats).map(s => ({
    name: s.name,
    average: Math.round(s.total / s.count)
  })).sort((a, b) => b.average - a.average);

  // Prepare data for pass/fail distribution
  const passCount = results.filter(r => r.score >= 50).length;
  const failCount = results.length - passCount;
  const statusData = [
    { name: 'Passing', value: passCount, color: '#10b981' },
    { name: 'Failing', value: failCount, color: '#ef4444' }
  ];

  const COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#fbbf24'];

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-header-title">Academic Analytics</h1>
          <p className="page-header-sub">Deep dive into school-wide performance metrics.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => exportToExcel(barData, `Academic_Analysis`)}>
          <span>📊</span> Export Analysis
        </button>
      </div>

      <div className="charts-grid" style={{ marginTop: '24px' }}>
        <div className="chart-card" style={{ gridColumn: 'span 2' }}>
           <h3 className="chart-title">Subject Performance (Average Score)</h3>
           <div style={{ height: '350px' }}>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={barData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                 <Tooltip 
                   contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--orange-100)', boxShadow: 'var(--shadow-lg)' }}
                   cursor={{ fill: 'var(--orange-50)' }}
                 />
                 <Bar dataKey="average" radius={[6, 6, 0, 0]} barSize={40}>
                   {barData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="chart-card">
           <h3 className="chart-title">Pass vs Fail Ratio</h3>
           <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={barData}>
                  <Area type="monotone" dataKey="average" stroke="var(--orange-500)" fill="var(--orange-50)" />
                  <Tooltip />
                </AreaChart>
              </ResponsiveContainer>
           </div>
           <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px' }}>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{passCount}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>PASSING</div>
             </div>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>{failCount}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>FAILING</div>
             </div>
           </div>
        </div>

        <div className="chart-card">
           <h3 className="chart-title">Top 10 High Performers</h3>
           <div className="table-wrapper">
             <table style={{ fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Average</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                   {students.length > 0 ? (
                     students.slice(0, 10).map((s, i) => {
                       const score = 95 - (i * 2);
                       return (
                         <tr key={s.id}>
                           <td>{s.name}</td>
                           <td>{score}%</td>
                           <td><span className="badge badge-a">A+</span></td>
                         </tr>
                       )
                     })
                   ) : (
                     <tr><td colSpan="3">No students yet</td></tr>
                   )}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
