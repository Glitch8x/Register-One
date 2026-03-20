/* ============================================
   Grading & Computation Utility
   ============================================ */

export const calculateGrade = (score) => {
  if (score >= 90) return { grade: 'A+', point: 4.0, status: 'Distinction' };
  if (score >= 80) return { grade: 'A',  point: 3.7, status: 'Excellent' };
  if (score >= 70) return { grade: 'B',  point: 3.0, status: 'Very Good' };
  if (score >= 60) return { grade: 'C',  point: 2.0, status: 'Good' };
  if (score >= 50) return { grade: 'D',  point: 1.0, status: 'Pass' };
  return { grade: 'F', point: 0.0, status: 'Fail' };
};

export const getStatusBadgeClass = (grade) => {
  switch (grade) {
    case 'A+':
    case 'A':  return 'badge-a';
    case 'B':  return 'badge-b';
    case 'C':  return 'badge-c';
    case 'D':  return 'badge-d';
    case 'F':  return 'badge-f';
    default:   return 'badge-gray';
  }
};

export const calculateGPA = (results) => {
  if (!results || results.length === 0) return 0;
  const totalPoints = results.reduce((sum, r) => sum + calculateGrade(r.score).point, 0);
  return (totalPoints / results.length).toFixed(2);
};

export const calculateAverage = (results) => {
  if (!results || results.length === 0) return 0;
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  return (totalScore / results.length).toFixed(2);
};

export const getAcademicStats = (students, results) => {
  const totalStudents = students.length;
  if (totalStudents === 0) return { avgScore: 0, passRate: 0, topScorer: 'N/A' };

  const allScores = results.map(r => r.score);
  const avgScore = allScores.length ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1) : 0;
  
  const passCount = results.filter(r => r.score >= 50).length;
  const passRate = results.length ? ((passCount / results.length) * 100).toFixed(1) : 0;

  // Group results by student to find top scorer
  const studentTotals = results.reduce((acc, r) => {
    if (!acc[r.studentId]) acc[r.studentId] = { total: 0, count: 0 };
    acc[r.studentId].total += r.score;
    acc[r.studentId].count += 1;
    return acc;
  }, {});

  let topStudentId = null;
  let maxAvg = -1;

  Object.keys(studentTotals).forEach(id => {
    const avg = studentTotals[id].total / studentTotals[id].count;
    if (avg > maxAvg) {
      maxAvg = avg;
      topStudentId = id;
    }
  });

  const topStudent = students.find(s => s.id === topStudentId);
  const topScorerName = topStudent ? topStudent.name : 'N/A';

  return { avgScore, passRate, topScorer: topScorerName };
};
