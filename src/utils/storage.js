/* ============================================
   Storage Utility
   ============================================ */

const KEYS = {
  STUDENTS: 'srs_students',
  RESULTS: 'srs_results',
  USER: 'srs_active_user'
};

export const storage = {
  getStudents: () => JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]'),
  setStudents: (students) => localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students)),
  
  getResults: () => JSON.parse(localStorage.getItem(KEYS.RESULTS) || '[]'),
  setResults: (results) => localStorage.setItem(KEYS.RESULTS, JSON.stringify(results)),

  getActiveUser: () => JSON.parse(localStorage.getItem(KEYS.USER) || 'null'),
  setActiveUser: (user) => localStorage.setItem(KEYS.USER, JSON.stringify(user)),
  logout: () => localStorage.removeItem(KEYS.USER)
};

// Seed initial data if empty
export const seedInitialData = () => {
  if (storage.getStudents().length === 0) {
    const initialStudents = [
      { id: 'STU001', name: 'John Doe', class: 'Year 5', gender: 'Male', dob: '2008-05-15' },
      { id: 'STU002', name: 'Jane Smith', class: 'Year 5', gender: 'Female', dob: '2008-08-22' }
    ];
    storage.setStudents(initialStudents);
  }

  if (storage.getResults().length === 0) {
    const initialResults = [
      { id: 1, studentId: 'STU001', subject: 'Mathematics', score: 85, term: 'First', year: '2025' },
      { id: 2, studentId: 'STU001', subject: 'English', score: 72, term: 'First', year: '2025' },
      { id: 3, studentId: 'STU002', subject: 'Mathematics', score: 92, term: 'First', year: '2025' },
      { id: 4, studentId: 'STU002', subject: 'Physics', score: 88, term: 'First', year: '2025' }
    ];
    storage.setResults(initialResults);
  }
};
