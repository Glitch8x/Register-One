import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    // 1. Check current auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) fetchData();
      setLoading(false);
    });

    // 2. Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchData();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    const { data: stds, error: stdError } = await supabase.from('students').select('*');
    const { data: res, error: resError } = await supabase.from('results').select('*');
    
    if (stdError || resError) {
      if ((stdError?.code === '42P01') || (resError?.code === '42P01')) {
        showToast('Database tables missing. Please run schema.sql in Supabase SQL Editor.', 'error');
      } else {
        showToast('Error fetching data. Check your Supabase connection.', 'error');
      }
      return;
    }

    if (stds) setStudents(stds);
    if (res) {
      // Map database snake_case to frontend camelCase if necessary
      const mappedResults = res.map(r => ({
        ...r,
        studentId: r.student_id,
        semester: r.term
      }));
      setResults(mappedResults);
    }
  };

  const login = async (id, password) => {
    // In Supabase, usually we use email. For this prototype, maybe we use `id@school.com`?
    // Let's stick to conventional Supabase Auth for now.
    const { data, error } = await supabase.auth.signInWithPassword({
      email: id.includes('@') ? id : `${id}@school.com`, 
      password
    });

    if (error) {
      console.error('Login error:', error.message);
      return false;
    }
    return true;
  };

  const register = async (student) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `${student.id}@school.com`,
      password: student.password,
    });

    if (authError) {
      console.error('Registration error:', authError.message);
      showToast(authError.message, 'error');
      return false;
    }

    // Save profile to students table
    const { error: dbError } = await supabase.from('students').insert([{
      id: student.id,
      name: student.name,
      class: student.class,
      gender: student.gender,
      matricno: student.matricno
    }]);

    if (dbError) {
      console.error('Database error:', dbError.message);
      showToast(dbError.message, 'error');
      return false;
    }

    fetchData();
    showToast('Registration successful!');
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setStudents([]);
    setResults([]);
  };

  const addStudent = async (student) => {
    const { error } = await supabase.from('students').insert([student]);
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Student added successfully');
      fetchData();
    }
  };

  const addBulkStudents = async (dataArray) => {
    const { error } = await supabase.from('students').insert(dataArray);
    if (error) {
      showToast(error.message, 'error');
    } else {
      fetchData();
    }
  };

  const updateStudent = async (id, data) => {
    const { error } = await supabase.from('students').update(data).eq('id', id);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Student updated');
      fetchData();
    }
  };

  const deleteStudent = async (id) => {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else fetchData();
  };

  const addResult = async (result) => {
    // Map frontend camelCase to database snake_case
    const dbResult = {
      student_id: result.studentId || result.student_id,
      subject: result.subject,
      score: parseInt(result.score),
      term: result.semester || result.term || 'First',
      year: result.year,
      level: result.level || '100L'
    };
    
    const { error } = await supabase.from('results').insert([dbResult]);
    if (error) {
      console.error("Supabase insert error:", error);
      showToast(error.message, 'error');
    } else {
      showToast('Result recorded successfully!');
      fetchData();
    }
  };

  const deleteResult = async (id) => {
    const { error } = await supabase.from('results').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else fetchData();
  }

  return (
    <AppContext.Provider value={{
      students, results, user, loading, showToast,
      login, logout, register,
      addStudent, updateStudent, deleteStudent, addBulkStudents,
      addResult, deleteResult
    }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' ? '✅' : '❌'} {t.message}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
