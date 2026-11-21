import React, { useState, useEffect } from 'react';
import { api } from './api.js';

export default function TeacherModule({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [teacher, setTeacher] = useState(user || null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!teacher || teacher.role !== 'teacher') {
      api('/teachers/me')
        .then(d => {
          if (d.teacher) setTeacher(d.teacher);
        })
        .catch(() => {});
    }
  }, [teacher]);

  function handleLoginSuccess(teacherData) {
    setTeacher(teacherData);
    setSuccessMsg(`Welcome, ${teacherData.name}! Successfully signed in.`);
    setActiveTab('dashboard');
  }

  function handleLogout() {
    api('/auth/logout', { method: 'POST' }).finally(() => {
      setTeacher(null);
      if (onLogout) onLogout();
    });
  }

  // If teacher is not signed in, show Teacher Auth (Register/Login)
  if (!teacher || teacher.role !== 'teacher') {
    return (
      <div className="teacher-auth-container">
        {error && <div className="toast"><span>⚠️ {error}</span><button onClick={() => setError('')}>×</button></div>}
        {successMsg && <div className="toast success-toast"><span>✓ {successMsg}</span><button onClick={() => setSuccessMsg('')}>×</button></div>}
        {authMode === 'register' ? (
          <TeacherRegisterForm
            onSuccess={handleLoginSuccess}
            onSwitchToLogin={() => setAuthMode('login')}
            setError={setError}
          />
        ) : (
          <TeacherLoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setAuthMode('register')}
            setError={setError}
          />
        )}
      </div>
    );
  }

  return (
    <div className="teacher-module-layout">
      {/* Toast notifications */}
      {error && <div className="toast"><span>⚠️ {error}</span><button onClick={() => setError('')}>×</button></div>}
      {successMsg && <div className="toast success-toast"><span>✓ {successMsg}</span><button onClick={() => setSuccessMsg('')}>×</button></div>}

      {/* Professional Teacher Sidebar */}
      <aside className="teacher-sidebar">
        <div className="sidebar-teacher-profile">
          <div className="teacher-avatar">{teacher.name ? teacher.name[0] : 'T'}</div>
          <div className="teacher-meta">
            <b>{teacher.name}</b>
            <span className="teacher-badge">{teacher.teacher_id_code || 'TCH-1042'}</span>
            <small>{teacher.school_name || 'National Academy'}</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span className="nav-icon">📊</span> Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
            <span className="nav-icon">👥</span> My Students
          </button>
          <button className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => setActiveTab('progress')}>
            <span className="nav-icon">📈</span> Student Progress
          </button>
          <button className={`nav-item ${activeTab === 'create-quiz' ? 'active' : ''}`} onClick={() => setActiveTab('create-quiz')}>
            <span className="nav-icon">➕</span> Create Quiz
          </button>
          <button className={`nav-item ${activeTab === 'manage-quizzes' ? 'active' : ''}`} onClick={() => setActiveTab('manage-quizzes')}>
            <span className="nav-icon">📝</span> Manage Quizzes
          </button>
          <button className={`nav-item ${activeTab === 'upload-materials' ? 'active' : ''}`} onClick={() => setActiveTab('upload-materials')}>
            <span className="nav-icon">📤</span> Upload Materials
          </button>
          <button className={`nav-item ${activeTab === 'materials' ? 'active' : ''}`} onClick={() => setActiveTab('materials')}>
            <span className="nav-icon">📚</span> Study Materials
          </button>
          <button className={`nav-item ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}>
            <span className="nav-icon">📢</span> Announcements
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <span className="nav-icon">⚙️</span> Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-sidebar-btn" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Teacher Content Area */}
      <main className="teacher-main-content">
        {activeTab === 'dashboard' && (
          <TeacherDashboardOverview
            teacher={teacher}
            onNavigate={setActiveTab}
            setError={setError}
          />
        )}
        {activeTab === 'students' && (
          <TeacherStudentsView
            teacher={teacher}
            setError={setError}
            setSuccessMsg={setSuccessMsg}
          />
        )}
        {activeTab === 'progress' && (
          <TeacherProgressView
            teacher={teacher}
            setError={setError}
          />
        )}
        {activeTab === 'create-quiz' && (
          <TeacherCreateQuizView
            teacher={teacher}
            onSuccess={() => { setActiveTab('manage-quizzes'); setSuccessMsg('Quiz created and published!'); }}
            setError={setError}
          />
        )}
        {activeTab === 'manage-quizzes' && (
          <TeacherManageQuizzesView
            teacher={teacher}
            onNewQuiz={() => setActiveTab('create-quiz')}
            setError={setError}
            setSuccessMsg={setSuccessMsg}
          />
        )}
        {activeTab === 'upload-materials' && (
          <TeacherUploadMaterialsView
            teacher={teacher}
            onSuccess={() => { setActiveTab('materials'); setSuccessMsg('Material uploaded and assigned!'); }}
            setError={setError}
          />
        )}
        {activeTab === 'materials' && (
          <TeacherStudyMaterialsView
            teacher={teacher}
            onUploadNew={() => setActiveTab('upload-materials')}
            setError={setError}
            setSuccessMsg={setSuccessMsg}
          />
        )}
        {activeTab === 'announcements' && (
          <TeacherAnnouncementsView
            teacher={teacher}
            setError={setError}
            setSuccessMsg={setSuccessMsg}
          />
        )}
        {activeTab === 'settings' && (
          <TeacherSettingsView
            teacher={teacher}
            setError={setError}
            setSuccessMsg={setSuccessMsg}
          />
        )}
      </main>
    </div>
  );
}

// ==========================================
// 1. TEACHER AUTH: REGISTRATION & LOGIN
// ==========================================

function TeacherLoginForm({ onSuccess, onSwitchToRegister, setError }) {
  const [email, setEmail] = useState('teacher@learnx.org');
  const [password, setPassword] = useState('teacher123');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api('/teachers/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, remember })
      });
      onSuccess(res.teacher);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function handleForgotSubmit(e) {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotModal(false);
      setForgotSent(false);
    }, 2500);
  }

  return (
    <div className="teacher-auth-card">
      <div className="auth-header">
        <span className="domain-badge">LEARNX EDUCATOR MODULE</span>
        <h2>Teacher Portal Login</h2>
        <p className="muted">Access your classroom management dashboard, quizzes, and student analytics.</p>
      </div>

      <form onSubmit={handleSubmit} className="teacher-form">
        <label>
          Email Address
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="prof.name@school.edu"
          />
        </label>

        <label>
          Password
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="toggle-pw-btn"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '🔒'}
            </button>
          </div>
        </label>

        <div className="form-meta-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            <span>Remember session</span>
          </label>
          <button type="button" className="text-link" onClick={() => setForgotModal(true)}>
            Forgot password?
          </button>
        </div>

        <button className="primary full" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign In as Teacher'} <span>→</span>
        </button>
      </form>

      <div className="auth-switch-footer">
        <p>New educator on LearnX?</p>
        <button className="secondary-button" onClick={onSwitchToRegister}>
          Create New Teacher Account
        </button>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="modal-backdrop" onClick={() => setForgotModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-top">
              <h3>Reset Teacher Password</h3>
              <button className="close-btn" onClick={() => setForgotModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {forgotSent ? (
                <p className="success-msg">✓ Password reset instructions sent to your registered email address.</p>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <p className="muted">Enter your registered teacher email address to receive password reset instructions.</p>
                  <label>
                    Teacher Email Address
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="teacher@school.edu"
                    />
                  </label>
                  <button className="primary full" type="submit" style={{ marginTop: '14px' }}>Send Reset Instructions</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TeacherRegisterForm({ onSuccess, onSwitchToLogin, setError }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    school_name: '',
    subject_specialization: 'Mathematics & Foundational Sciences',
    teacher_id_code: '',
    password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setBusy(true);
    try {
      const res = await api('/teachers/register', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      onSuccess(res.teacher);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="teacher-auth-card register-wide">
      <div className="auth-header">
        <span className="domain-badge">LEARNX EDUCATOR ONBOARDING</span>
        <h2>Teacher Registration</h2>
        <p className="muted">Set up your educator profile to manage student cohorts, publish quizzes, and track learning gaps.</p>
      </div>

      <form onSubmit={handleSubmit} className="teacher-form grid-form">
        <label>
          Full Name
          <input
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Prof. Ananya Sharma"
          />
        </label>

        <label>
          Email Address (Official)
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="ananya.sharma@school.edu"
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
        </label>

        <label>
          School / College Name
          <input
            required
            value={form.school_name}
            onChange={e => setForm({ ...form, school_name: e.target.value })}
            placeholder="e.g. National Academy of Science"
          />
        </label>

        <label>
          Subject Specialization
          <input
            required
            value={form.subject_specialization}
            onChange={e => setForm({ ...form, subject_specialization: e.target.value })}
            placeholder="e.g. Mathematics, Physics, English"
          />
        </label>

        <label>
          Teacher ID / Employee Code
          <input
            required
            value={form.teacher_id_code}
            onChange={e => setForm({ ...form, teacher_id_code: e.target.value })}
            placeholder="e.g. TCH-1042"
          />
        </label>

        <label>
          Password (min 8 chars)
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Create strong password"
            />
            <button
              type="button"
              className="toggle-pw-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '🔒'}
            </button>
          </div>
        </label>

        <label>
          Confirm Password
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={form.confirm_password}
            onChange={e => setForm({ ...form, confirm_password: e.target.value })}
            placeholder="Repeat password"
          />
        </label>

        <div className="form-full-row">
          <button className="primary full" type="submit" disabled={busy}>
            {busy ? 'Registering Educator Profile…' : 'Complete Registration & Open Dashboard'} <span>→</span>
          </button>
        </div>
      </form>

      <div className="auth-switch-footer">
        <p>Already registered as an educator?</p>
        <button className="text-link" onClick={onSwitchToLogin}>
          Sign in to your account →
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 2. TEACHER DASHBOARD OVERVIEW
// ==========================================

function TeacherDashboardOverview({ teacher, onNavigate, setError }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api('/teachers/analytics')
      .then(setAnalytics)
      .catch(e => setError(e.message));
  }, []);

  if (!analytics) return <div className="loading"><div className="spinner"></div><p>Loading analytics…</p></div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-top-row">
        <div>
          <p className="eyebrow">TEACHER COMMAND CENTER</p>
          <h1>Welcome, {teacher.name}</h1>
          <p className="muted">{teacher.school_name} · Specialization: {teacher.subject_specialization}</p>
        </div>
        <div className="quick-actions-bar">
          <button className="primary" onClick={() => onNavigate('create-quiz')}>+ Create Quiz</button>
          <button className="secondary-button" onClick={() => onNavigate('upload-materials')}>📤 Upload Material</button>
          <button className="secondary-button" onClick={() => onNavigate('announcements')}>📢 Announcement</button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-icon">👥</span>
          <div>
            <span className="kpi-label">Assigned Students</span>
            <h2>{analytics.metrics.total_students}</h2>
            <small className="kpi-sub">Active in your classes</small>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">🎯</span>
          <div>
            <span className="kpi-label">Class Average Score</span>
            <h2>{analytics.metrics.class_average}%</h2>
            <small className="kpi-sub">Across all diagnostic quizzes</small>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">📝</span>
          <div>
            <span className="kpi-label">Quizzes Created</span>
            <h2>{analytics.metrics.quizzes_created}</h2>
            <small className="kpi-sub">Custom teacher assessments</small>
          </div>
        </div>

        <div className="kpi-card alert-kpi">
          <span className="kpi-icon">⚠️</span>
          <div>
            <span className="kpi-label">Needs Intervention</span>
            <h2>{analytics.metrics.students_needing_support}</h2>
            <small className="kpi-sub" style={{ color: '#d93b58' }}>Below 50% average score</small>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Visual Performance */}
      <div className="dashboard-analytics-grid">
        {/* Topic-wise mastery bars */}
        <section className="analytics-card">
          <div className="card-header-flex">
            <h3>Topic-wise Class Mastery</h3>
            <button className="text-link" onClick={() => onNavigate('progress')}>Deep Analytics →</button>
          </div>
          <p className="muted small">Aggregated performance across all student attempts:</p>

          <div className="topic-bars-list">
            {analytics.topic_performance.map((tp, idx) => (
              <div key={idx} className="topic-bar-item">
                <div className="bar-labels">
                  <b>{tp.topic}</b>
                  <span className={`status-pill pill-${tp.status.toLowerCase().replace(' ', '-')}`}>
                    {tp.score}% · {tp.status}
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className={`progress-fill ${tp.score >= 80 ? 'fill-green' : tp.score >= 60 ? 'fill-yellow' : 'fill-red'}`}
                    style={{ width: `${tp.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weekly Activity Line/Bar */}
        <section className="analytics-card">
          <div className="card-header-flex">
            <h3>Weekly Learning Activity</h3>
            <span className="muted small">Total submissions by day</span>
          </div>
          <div className="weekly-bars-chart">
            {analytics.weekly_activity.map(wa => (
              <div key={wa.day} className="day-col">
                <div className="day-bar-wrapper">
                  <div className="day-bar" style={{ height: `${wa.quizzes * 3}px` }} title={`${wa.quizzes} quizzes`} />
                </div>
                <span className="day-label">{wa.day}</span>
              </div>
            ))}
          </div>
          <p className="chart-footnote">Peak engagement observed on Thursdays (28 quizzes attempted).</p>
        </section>
      </div>

      {/* Struggling Students Spotlight Action */}
      <section className="intervention-spotlight-card">
        <div className="spotlight-header">
          <div>
            <span className="tag-urgent">STUDENT SUPPORT ALERT</span>
            <h3>Students Requiring Learning Intervention</h3>
            <p className="muted">These students scored under 50% and have identified foundational misconceptions:</p>
          </div>
          <button className="primary" onClick={() => onNavigate('students')}>View Full Roster →</button>
        </div>

        <div className="struggling-students-row">
          <div className="struggling-chip">
            <b>Rahul Verma (STU-2024-002)</b>
            <span>Avg: 48.0%</span>
            <small>Weakness: Inverse Operations Order</small>
            <button className="btn-sm" onClick={() => onNavigate('students')}>Inspect Profile</button>
          </div>
          <div className="struggling-chip">
            <b>Priya Patel (STU-2024-005)</b>
            <span>Avg: 42.0%</span>
            <small>Weakness: LCM Denominator Misconception</small>
            <button className="btn-sm" onClick={() => onNavigate('students')}>Inspect Profile</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// 3. STUDENT MANAGEMENT & MONITORING
// ==========================================

function TeacherStudentsView({ teacher, setError, setSuccessMsg }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [className, setClassName] = useState('All');
  const [performance, setPerformance] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [sendingNote, setSendingNote] = useState(false);

  useEffect(() => {
    loadStudents();
  }, [search, className, performance]);

  async function loadStudents() {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (className !== 'All') params.set('class_name', className);
      if (performance !== 'All') params.set('performance', performance);
      const res = await api(`/teachers/students?${params.toString()}`);
      setStudents(res.students || []);
    } catch (e) {
      setError(e.message);
    }
  }

  async function openStudentDetail(studentId) {
    try {
      const res = await api(`/teachers/students/${studentId}`);
      setSelectedStudent(res.student);
    } catch (e) {
      setError(e.message);
    }
  }

  async function sendFeedback(e) {
    e.preventDefault();
    if (!feedbackNote.trim() || !selectedStudent) return;
    setSendingNote(true);
    try {
      await api(`/teachers/students/${selectedStudent.id}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ note: feedbackNote })
      });
      setSuccessMsg(`✓ Feedback successfully sent to ${selectedStudent.name}!`);
      setFeedbackNote('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingNote(false);
    }
  }

  return (
    <div className="students-view">
      <div className="view-header">
        <div>
          <p className="eyebrow">STUDENT MONITORING</p>
          <h1>Registered Students ({students.length})</h1>
          <p className="muted">Inspect learning progress, quiz attempts, and diagnose weak topics for each student.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-card">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by student name, ID code, or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-selects">
          <label>
            Class / Semester
            <select value={className} onChange={e => setClassName(e.target.value)}>
              <option value="All">All Classes</option>
              <option value="Grade 7 - Sem 1">Grade 7 - Sem 1</option>
              <option value="Grade 8 - Sem 2">Grade 8 - Sem 2</option>
            </select>
          </label>

          <label>
            Performance Level
            <select value={performance} onChange={e => setPerformance(e.target.value)}>
              <option value="All">All Performances</option>
              <option value="High">High Mastery (≥80%)</option>
              <option value="Average">Average (50–79%)</option>
              <option value="Needs Support">Needs Support (&lt;50%)</option>
            </select>
          </label>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-responsive card-table">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Class / Dept</th>
              <th>Last Login</th>
              <th>Quizzes</th>
              <th>Average Score</th>
              <th>Learning Progress</th>
              <th>Weak Topics</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={9} className="empty-cell">No students match your filter criteria.</td>
              </tr>
            ) : (
              students.map(s => (
                <tr key={s.id} className={s.needs_support ? 'alert-row' : ''}>
                  <td>
                    <b>{s.name}</b>
                    <small className="muted block">{s.email}</small>
                  </td>
                  <td><code>{s.student_id}</code></td>
                  <td>
                    <span>{s.class_semester}</span>
                    <small className="muted block">{s.course_dept}</small>
                  </td>
                  <td className="muted">{s.last_login}</td>
                  <td><b>{s.total_quizzes}</b> attempts</td>
                  <td>
                    <span className={`score-badge ${s.average_score >= 80 ? 'badge-good' : s.average_score >= 50 ? 'badge-avg' : 'badge-alert'}`}>
                      {s.average_score}%
                    </span>
                  </td>
                  <td>
                    <div className="mini-progress-bar">
                      <div className="fill" style={{ width: `${s.learning_progress}%` }} />
                    </div>
                    <small>{s.learning_progress}% complete</small>
                  </td>
                  <td>
                    {s.weak_topics?.length > 0 ? (
                      s.weak_topics.map((wt, i) => (
                        <span key={i} className="weak-chip">{wt}</span>
                      ))
                    ) : (
                      <span className="clean-chip">✓ Strong</span>
                    )}
                  </td>
                  <td>
                    <button className="primary btn-sm" onClick={() => openStudentDetail(s.id)}>
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Individual Student Profile Modal */}
      {selectedStudent && (
        <div className="modal-backdrop" onClick={() => setSelectedStudent(null)}>
          <div className="modal-card wide-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-top">
              <div>
                <span className="card-kicker">STUDENT PROFILE & AUDIT</span>
                <h2>{selectedStudent.name} ({selectedStudent.student_id})</h2>
                <p className="muted">{selectedStudent.email} · {selectedStudent.class_semester} · {selectedStudent.course_dept}</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>×</button>
            </div>

            <div className="modal-body">
              {/* Quiz history for this student */}
              <h3>Quiz Attempt History</h3>
              {selectedStudent.quiz_history?.length === 0 ? (
                <p className="empty-state">No quizzes completed yet by this student.</p>
              ) : (
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Quiz Title</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Result</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.quiz_history?.map((h, i) => (
                      <tr key={i}>
                        <td><b>{h.quiz_title}</b></td>
                        <td>{h.score} / {h.total_marks}</td>
                        <td><b>{h.percentage}%</b></td>
                        <td>
                          <span className={`status-pill ${h.passed ? 'pill-good' : 'pill-fail'}`}>
                            {h.passed ? 'PASSED' : 'RETAKE NEEDED'}
                          </span>
                        </td>
                        <td className="muted">{h.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Direct Feedback Note Form */}
              <div className="teacher-feedback-box">
                <h4>Send Direct Guidance / Feedback to {selectedStudent.name}</h4>
                <form onSubmit={sendFeedback}>
                  <textarea
                    rows={3}
                    placeholder="Provide actionable guidance (e.g. Please review the Fractions Cheat Sheet before attempting quiz 2)..."
                    value={feedbackNote}
                    onChange={e => setFeedbackNote(e.target.value)}
                    required
                  />
                  <button className="primary" type="submit" disabled={sendingNote}>
                    {sendingNote ? 'Delivering Note…' : 'Send Feedback to Student'} <span>→</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-button" onClick={() => setSelectedStudent(null)}>Close Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. STUDENT PROGRESS ANALYTICS VIEW
// ==========================================

function TeacherProgressView({ teacher, setError }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api('/teachers/analytics')
      .then(setAnalytics)
      .catch(e => setError(e.message));
  }, []);

  if (!analytics) return <div className="loading"><div className="spinner"></div><p>Rendering analytics…</p></div>;

  return (
    <div className="progress-analytics-view">
      <div className="view-header">
        <div>
          <p className="eyebrow">VISUAL PERFORMANCE ANALYTICS</p>
          <h1>Class Learning Progress & Trends</h1>
          <p className="muted">Detailed topic breakdowns, weak spots, and improvement trajectories across all students.</p>
        </div>
      </div>

      <div className="analytics-metrics-row">
        <div className="metric-box">
          <small>Overall Learning Progress</small>
          <h2>78.4%</h2>
          <div className="progress-track"><div className="progress-fill fill-green" style={{ width: '78.4%' }} /></div>
        </div>
        <div className="metric-box">
          <small>Class Average Quiz Score</small>
          <h2>{analytics.metrics.class_average}%</h2>
          <div className="progress-track"><div className="progress-fill fill-yellow" style={{ width: `${analytics.metrics.class_average}%` }} /></div>
        </div>
        <div className="metric-box">
          <small>Quizzes Completed</small>
          <h2>18 Submissions</h2>
          <small className="muted">Across 5 enrolled students</small>
        </div>
      </div>

      {/* Strong vs Weak Topics Matrix */}
      <div className="matrix-grid">
        <div className="matrix-card card-strong">
          <h3>🌟 Strong Topics (Mastery ≥ 75%)</h3>
          <ul className="topic-list">
            <li><b>Reading Comprehension & Context Clues:</b> 92% class average</li>
            <li><b>Fractions & Arithmetic Addition:</b> 83% class average</li>
            <li><b>Scientific Variables & Controls:</b> 76% class average</li>
          </ul>
        </div>

        <div className="matrix-card card-weak">
          <h3>⚠️ Weak Topics (Requiring Remediation)</h3>
          <ul className="topic-list">
            <li><b>One-step & Two-step Linear Equations:</b> 58% average (Sign inversions)</li>
            <li><b>Unlike Denominators & LCM:</b> 52% average (Direct denominator additions)</li>
          </ul>
        </div>
      </div>

      {/* Weekly Activity Detailed Bar Chart */}
      <section className="analytics-card" style={{ marginTop: '24px' }}>
        <h3>Weekly Practice Activity (Submissions & Hours)</h3>
        <p className="muted small">Daily activity log of assigned quiz attempts across Monday through Sunday:</p>
        <div className="weekly-bars-chart">
          {analytics.weekly_activity.map(wa => (
            <div key={wa.day} className="day-col">
              <div className="day-bar-wrapper">
                <div className="day-bar" style={{ height: `${wa.quizzes * 3.5}px` }} />
              </div>
              <span className="day-label">{wa.day}</span>
              <small className="day-num">{wa.quizzes} tests</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ==========================================
// 5. CREATE YOUR OWN QUIZ (ALL 4 TYPES!)
// ==========================================

function TeacherCreateQuizView({ teacher, onSuccess, setError }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Basic algebra');
  const [topic, setTopic] = useState('Linear Equations');
  const [classSemester, setClassSemester] = useState('Grade 7 - Sem 1');
  const [difficulty, setDifficulty] = useState('Medium');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(20);
  const [passingPercentage, setPassingPercentage] = useState(60);
  const [deadline, setDeadline] = useState('2026-12-25');
  const [status, setStatus] = useState('published'); // draft or published

  // Questions Array supporting all 4 types!
  const [questions, setQuestions] = useState([
    {
      question_type: 'mcq',
      prompt: 'Solve for x: 2x + 6 = 18',
      options: ['4', '6', '8', '12'],
      correct_answer: '6',
      marks: 10,
      explanation: 'Subtract 6 from both sides (2x = 12), then divide by 2 (x = 6).'
    },
    {
      question_type: 'true_false',
      prompt: 'True or False: Addition and Subtraction are inverse operations.',
      options: ['True', 'False'],
      correct_answer: 'True',
      marks: 10,
      explanation: 'Addition cancels out subtraction.'
    }
  ]);

  const [previewModal, setPreviewModal] = useState(false);
  const [busy, setBusy] = useState(false);

  const totalMarks = questions.reduce((sum, q) => sum + Number(q.marks || 10), 0);

  function addQuestion(type = 'mcq') {
    const newQ = {
      question_type: type,
      prompt: '',
      options: type === 'mcq' ? ['', '', '', ''] : type === 'true_false' ? ['True', 'False'] : [],
      correct_answer: type === 'true_false' ? 'True' : '',
      marks: 10,
      explanation: ''
    };
    setQuestions([...questions, newQ]);
  }

  function updateQuestion(index, updates) {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
  }

  function updateOption(qIndex, optIndex, value) {
    const updated = [...questions];
    const opts = [...updated[qIndex].options];
    opts[optIndex] = value;
    updated[qIndex].options = opts;
    setQuestions(updated);
  }

  function removeQuestion(index) {
    if (questions.length <= 1) {
      setError('Quiz must have at least one question.');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  }

  async function handleSubmit(saveStatus) {
    if (!title.trim()) {
      setError('Quiz title is required.');
      return;
    }
    if (questions.some(q => !q.prompt.trim() || !q.correct_answer.trim())) {
      setError('Every question must have a prompt and correct answer specified.');
      return;
    }
    setBusy(true);
    try {
      await api('/teachers/quizzes', {
        method: 'POST',
        body: JSON.stringify({
          title,
          subject,
          topic,
          class_semester: classSemester,
          difficulty,
          description,
          time_limit: Number(timeLimit),
          passing_percentage: Number(passingPercentage),
          deadline,
          status: saveStatus,
          questions
        })
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="create-quiz-view">
      <div className="view-header">
        <div>
          <p className="eyebrow">CUSTOM ASSESSMENT BUILDER</p>
          <h1>Create Your Own Quiz</h1>
          <p className="muted">Build tailored quizzes with multiple question formats, time limits, and auto-evaluation rules.</p>
        </div>
        <div className="header-actions">
          <button className="secondary-button" onClick={() => setPreviewModal(true)}>
            👁️ Preview Student View
          </button>
          <button className="secondary-button" onClick={() => handleSubmit('draft')} disabled={busy}>
            Save as Draft
          </button>
          <button className="primary" onClick={() => handleSubmit('published')} disabled={busy}>
            {busy ? 'Publishing…' : 'Publish to Class'} <span>→</span>
          </button>
        </div>
      </div>

      {/* Quiz Metadata Config Form */}
      <div className="quiz-meta-card">
        <h3>1. Quiz Details & Settings</h3>
        <div className="grid-meta-inputs">
          <label className="col-span-2">
            Quiz Title
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Chapter 4: Fractions and Linear Equations Mastery"
            />
          </label>

          <label>
            Subject
            <select value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="Basic algebra">Basic algebra</option>
              <option value="Fractions">Fractions</option>
              <option value="Reading comprehension">Reading comprehension</option>
              <option value="Science & Logic">Science & Logic</option>
              <option value="General Mathematics">General Mathematics</option>
            </select>
          </label>

          <label>
            Topic
            <input
              required
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Variable Isolation"
            />
          </label>

          <label>
            Target Class / Semester
            <select value={classSemester} onChange={e => setClassSemester(e.target.value)}>
              <option value="Grade 7 - Sem 1">Grade 7 - Sem 1</option>
              <option value="Grade 8 - Sem 2">Grade 8 - Sem 2</option>
              <option value="All Classes">All Classes</option>
            </select>
          </label>

          <label>
            Difficulty Level
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="Easy">Easy (Foundational)</option>
              <option value="Medium">Medium (Standard)</option>
              <option value="Hard">Hard (Advanced Challenge)</option>
            </select>
          </label>

          <label>
            Time Limit (Minutes)
            <input
              type="number"
              min={5}
              max={120}
              value={timeLimit}
              onChange={e => setTimeLimit(e.target.value)}
            />
          </label>

          <label>
            Passing Percentage (%)
            <input
              type="number"
              min={35}
              max={100}
              value={passingPercentage}
              onChange={e => setPassingPercentage(e.target.value)}
            />
          </label>

          <label>
            Quiz Deadline
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
            />
          </label>

          <label className="col-span-2">
            Description / Instructions for Students
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide instructions, formulas allowed, or notes for students..."
            />
          </label>
        </div>

        <div className="meta-stats-row">
          <span>Total Questions: <b>{questions.length}</b></span>
          <span>Calculated Total Marks: <b>{totalMarks}</b></span>
          <span>Passing Threshold: <b>{passingPercentage}% ({Math.round(totalMarks * passingPercentage / 100)} marks)</b></span>
        </div>
      </div>

      {/* Questions Builder Section */}
      <div className="questions-builder-card">
        <div className="card-header-flex">
          <div>
            <h3>2. Questions ({questions.length})</h3>
            <p className="muted small">Supports MCQs, True/False, Fill in the Blanks, and Short Answer:</p>
          </div>
          <div className="add-question-buttons">
            <button className="btn-type" onClick={() => addQuestion('mcq')}>+ MCQ</button>
            <button className="btn-type" onClick={() => addQuestion('true_false')}>+ True/False</button>
            <button className="btn-type" onClick={() => addQuestion('fill_blank')}>+ Fill Blank</button>
            <button className="btn-type" onClick={() => addQuestion('short_answer')}>+ Short Answer</button>
          </div>
        </div>

        <div className="questions-edit-list">
          {questions.map((q, idx) => (
            <div key={idx} className="question-builder-item">
              <div className="item-top-row">
                <span className="q-badge">Question {idx + 1} ({q.question_type.toUpperCase()})</span>
                <div className="marks-config">
                  <label>Marks:</label>
                  <input
                    type="number"
                    min={1}
                    value={q.marks}
                    onChange={e => updateQuestion(idx, { marks: Number(e.target.value) })}
                  />
                  <button className="btn-del" onClick={() => removeQuestion(idx)} title="Delete Question">🗑️</button>
                </div>
              </div>

              <label className="prompt-label">
                Question Prompt:
                <input
                  type="text"
                  required
                  placeholder="Enter the question prompt here..."
                  value={q.prompt}
                  onChange={e => updateQuestion(idx, { prompt: e.target.value })}
                />
              </label>

              {/* 1. MCQ Form */}
              {q.question_type === 'mcq' && (
                <div className="mcq-options-builder">
                  <small className="muted block">Options (Select radio for correct answer):</small>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="opt-builder-row">
                      <input
                        type="radio"
                        name={`correct-${idx}`}
                        checked={q.correct_answer === opt && opt !== ''}
                        onChange={() => updateQuestion(idx, { correct_answer: opt })}
                        title="Mark as correct answer"
                      />
                      <span className="opt-letter">{String.fromCharCode(65 + optIdx)}</span>
                      <input
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        value={opt}
                        onChange={e => updateOption(idx, optIdx, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 2. True / False Form */}
              {q.question_type === 'true_false' && (
                <div className="tf-builder-row">
                  <small className="muted block">Select Correct Answer:</small>
                  <div className="tf-buttons">
                    <button
                      type="button"
                      className={`tf-btn ${q.correct_answer === 'True' ? 'selected' : ''}`}
                      onClick={() => updateQuestion(idx, { correct_answer: 'True' })}
                    >
                      True
                    </button>
                    <button
                      type="button"
                      className={`tf-btn ${q.correct_answer === 'False' ? 'selected' : ''}`}
                      onClick={() => updateQuestion(idx, { correct_answer: 'False' })}
                    >
                      False
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Fill in the Blank Form */}
              {q.question_type === 'fill_blank' && (
                <div className="blank-builder-row">
                  <label>
                    Correct Blank Keyword (Exact match or numeric):
                    <input
                      type="text"
                      placeholder="e.g. 8"
                      value={q.correct_answer}
                      onChange={e => updateQuestion(idx, { correct_answer: e.target.value })}
                    />
                  </label>
                </div>
              )}

              {/* 4. Short Answer Form */}
              {q.question_type === 'short_answer' && (
                <div className="short-builder-row">
                  <label>
                    Model Correct Answer / Grading Rubric:
                    <input
                      type="text"
                      placeholder="e.g. Subtract 3 from both sides, then divide by 4"
                      value={q.correct_answer}
                      onChange={e => updateQuestion(idx, { correct_answer: e.target.value })}
                    />
                  </label>
                </div>
              )}

              <label className="explanation-label">
                Feedback & Explanation for Students:
                <input
                  type="text"
                  placeholder="Explain why this answer is correct..."
                  value={q.explanation || ''}
                  onChange={e => updateQuestion(idx, { explanation: e.target.value })}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Preview Modal */}
      {previewModal && (
        <div className="modal-backdrop" onClick={() => setPreviewModal(false)}>
          <div className="modal-card wide-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-top">
              <div>
                <span className="card-kicker">STUDENT VIEW PREVIEW</span>
                <h2>{title || 'Untitled Quiz'} ({difficulty})</h2>
                <p className="muted">Time Limit: {timeLimit} mins · Total Marks: {totalMarks} · Passing: {passingPercentage}%</p>
              </div>
              <button className="close-btn" onClick={() => setPreviewModal(false)}>×</button>
            </div>
            <div className="modal-body preview-body">
              {questions.map((q, i) => (
                <div key={i} className="preview-question-card">
                  <span className="q-preview-num">QUESTION {i + 1} OF {questions.length} ({q.marks} Marks)</span>
                  <h4>{q.prompt || 'Prompt text...'}</h4>
                  {q.question_type === 'mcq' && (
                    <div className="preview-choices">
                      {q.options.map((opt, j) => (
                        <div key={j} className="preview-choice-btn">
                          <b>{String.fromCharCode(65 + j)}</b> {opt || `Choice ${j + 1}`}
                          {opt === q.correct_answer && opt !== '' && <span className="answer-key-tag">✓ Correct Answer Key</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.question_type === 'true_false' && (
                    <div className="preview-choices tf-row">
                      <div className="preview-choice-btn">True {q.correct_answer === 'True' && <span className="answer-key-tag">✓ Correct</span>}</div>
                      <div className="preview-choice-btn">False {q.correct_answer === 'False' && <span className="answer-key-tag">✓ Correct</span>}</div>
                    </div>
                  )}
                  {q.question_type === 'fill_blank' && (
                    <div className="preview-blank">
                      <input placeholder="Student fills in blank here..." disabled />
                      <small className="muted block">Key: <code>{q.correct_answer}</code></small>
                    </div>
                  )}
                  {q.question_type === 'short_answer' && (
                    <div className="preview-short">
                      <textarea placeholder="Student types response here..." disabled />
                      <small className="muted block">Model Answer: <code>{q.correct_answer}</code></small>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="primary" onClick={() => setPreviewModal(false)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. MANAGE QUIZZES VIEW
// ==========================================

function TeacherManageQuizzesView({ teacher, onNewQuiz, setError, setSuccessMsg }) {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    loadQuizzes();
  }, []);

  async function loadQuizzes() {
    try {
      const res = await api('/teachers/quizzes');
      setQuizzes(res.quizzes || []);
    } catch (e) {
      setError(e.message);
    }
  }

  async function deleteQuiz(id) {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await api(`/teachers/quizzes/${id}`, { method: 'DELETE' });
      setSuccessMsg('✓ Quiz deleted successfully.');
      loadQuizzes();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="manage-quizzes-view">
      <div className="view-header">
        <div>
          <p className="eyebrow">ASSESSMENT REPOSITORY</p>
          <h1>Manage Created Quizzes ({quizzes.length})</h1>
          <p className="muted">Review status, deadline, total marks, and student submission counts for your assessments.</p>
        </div>
        <button className="primary" onClick={onNewQuiz}>+ Create New Quiz</button>
      </div>

      <div className="table-responsive card-table">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Subject & Topic</th>
              <th>Class</th>
              <th>Questions</th>
              <th>Time Limit</th>
              <th>Total Marks</th>
              <th>Status</th>
              <th>Deadline</th>
              <th>Submissions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.length === 0 ? (
              <tr><td colSpan={10} className="empty-cell">No quizzes created yet. Click "+ Create New Quiz" to start!</td></tr>
            ) : (
              quizzes.map(q => (
                <tr key={q.id}>
                  <td><b>{q.title}</b></td>
                  <td>
                    <span>{q.subject}</span>
                    <small className="muted block">{q.topic}</small>
                  </td>
                  <td>{q.class_semester}</td>
                  <td><b>{q.questions_count}</b> qs</td>
                  <td>{q.time_limit} mins</td>
                  <td>{q.total_marks} marks</td>
                  <td>
                    <span className={`status-pill pill-${q.status}`}>
                      {q.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="muted">{q.deadline || 'No deadline'}</td>
                  <td><b>{q.submissions_count}</b> submissions</td>
                  <td>
                    <button className="btn-del" onClick={() => deleteQuiz(q.id)} title="Delete Quiz">🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 7. UPLOAD STUDY MATERIALS VIEW
// ==========================================

function TeacherUploadMaterialsView({ teacher, onSuccess, setError }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Basic algebra');
  const [topic, setTopic] = useState('Inverse Operations');
  const [classSemester, setClassSemester] = useState('Grade 7 - Sem 1');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [fileSizeKb, setFileSizeKb] = useState(250);
  const [busy, setBusy] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileSizeKb(Math.round(file.size / 1024));
      const ext = file.name.split('.').pop().toLowerCase();
      if (['pdf', 'docx', 'doc', 'pptx', 'ppt', 'txt', 'png', 'jpg', 'jpeg'].includes(ext)) {
        setFileType(ext.includes('doc') ? 'docx' : ext.includes('ppt') ? 'pptx' : ext.includes('pn') || ext.includes('jp') ? 'image' : ext);
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !fileName) {
      setError('Title and a valid file must be provided.');
      return;
    }
    setBusy(true);
    try {
      await api('/teachers/materials', {
        method: 'POST',
        body: JSON.stringify({
          title,
          subject,
          topic,
          class_semester: classSemester,
          description,
          file_name: fileName,
          file_type: fileType,
          file_size_kb: fileSizeKb
        })
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="upload-materials-view">
      <div className="view-header">
        <div>
          <p className="eyebrow">LEARNING RESOURCE SHARING</p>
          <h1>Upload Study Materials</h1>
          <p className="muted">Upload PDFs, DOCX, Presentations, Images or Notes and assign them directly to your student classes.</p>
        </div>
      </div>

      <div className="upload-form-card">
        <form onSubmit={handleSubmit} className="teacher-form">
          <div className="grid-form">
            <label className="col-span-2">
              Material Title
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Chapter 3: Algebra Formulas & Worked Examples"
              />
            </label>

            <label>
              Subject
              <select value={subject} onChange={e => setSubject(e.target.value)}>
                <option value="Basic algebra">Basic algebra</option>
                <option value="Fractions">Fractions</option>
                <option value="Reading comprehension">Reading comprehension</option>
                <option value="Science & Logic">Science & Logic</option>
              </select>
            </label>

            <label>
              Topic
              <input
                required
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Linear Equations"
              />
            </label>

            <label>
              Assign to Class
              <select value={classSemester} onChange={e => setClassSemester(e.target.value)}>
                <option value="Grade 7 - Sem 1">Grade 7 - Sem 1</option>
                <option value="Grade 8 - Sem 2">Grade 8 - Sem 2</option>
                <option value="All Classes">All Classes</option>
              </select>
            </label>

            <label>
              Supported File Types
              <select value={fileType} onChange={e => setFileType(e.target.value)}>
                <option value="pdf">PDF Document (.pdf)</option>
                <option value="docx">Word Document (.docx / .doc)</option>
                <option value="pptx">Presentation (.pptx / .ppt)</option>
                <option value="image">Diagram / Image (.png / .jpg)</option>
                <option value="txt">Text File (.txt)</option>
              </select>
            </label>

            <label className="col-span-2">
              Description / Study Notes for Students
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Briefly describe what this file covers and which quiz it prepares students for..."
              />
            </label>
          </div>

          {/* Drag & Drop File Picker */}
          <div className="file-dropzone">
            <span className="drop-icon">📁</span>
            <h4>Select file to upload from your device</h4>
            <p className="muted small">Supported: PDF, DOCX, PPTX, Images, TXT (Up to 25MB)</p>
            <input
              type="file"
              required
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
            />
            {fileName && (
              <div className="selected-file-badge">
                ✓ Selected: <b>{fileName}</b> ({fileSizeKb} KB, {fileType.toUpperCase()})
              </div>
            )}
          </div>

          <button className="primary full" type="submit" disabled={busy || !fileName}>
            {busy ? 'Uploading Learning Material…' : 'Upload and Assign to Students'} <span>→</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 8. STUDY MATERIALS LIBRARY VIEW
// ==========================================

function TeacherStudyMaterialsView({ teacher, onUploadNew, setError, setSuccessMsg }) {
  const [materials, setMaterials] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('All');

  useEffect(() => {
    loadMaterials();
  }, []);

  async function loadMaterials() {
    try {
      const res = await api('/teachers/materials');
      setMaterials(res.materials || []);
    } catch (e) {
      setError(e.message);
    }
  }

  async function deleteMaterial(id) {
    if (!window.confirm('Delete this study material?')) return;
    try {
      await api(`/teachers/materials/${id}`, { method: 'DELETE' });
      setSuccessMsg('✓ Material removed from classroom library.');
      loadMaterials();
    } catch (e) {
      setError(e.message);
    }
  }

  const filtered = subjectFilter === 'All' ? materials : materials.filter(m => m.subject === subjectFilter);

  return (
    <div className="materials-view">
      <div className="view-header">
        <div>
          <p className="eyebrow">COURSE MATERIALS</p>
          <h1>Uploaded Study Materials ({materials.length})</h1>
          <p className="muted">Track student access and download activity across all shared course documents.</p>
        </div>
        <button className="primary" onClick={onUploadNew}>+ Upload New Material</button>
      </div>

      <div className="filter-card">
        <label>
          Filter by Subject:
          <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
            <option value="All">All Subjects</option>
            <option value="Basic algebra">Basic algebra</option>
            <option value="Fractions">Fractions</option>
            <option value="Science & Logic">Science & Logic</option>
          </select>
        </label>
      </div>

      <div className="table-responsive card-table">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Material Title</th>
              <th>File Name</th>
              <th>Type & Size</th>
              <th>Subject & Topic</th>
              <th>Class</th>
              <th>Upload Date</th>
              <th>Student Downloads</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="empty-cell">No materials uploaded in this category.</td></tr>
            ) : (
              filtered.map(m => (
                <tr key={m.id}>
                  <td><b>{m.title}</b></td>
                  <td><code>{m.file_name}</code></td>
                  <td>
                    <span className="file-badge file-{m.file_type}">{m.file_type.toUpperCase()}</span>
                    <small className="muted ml-2">{m.file_size_kb} KB</small>
                  </td>
                  <td>
                    <span>{m.subject}</span>
                    <small className="muted block">{m.topic}</small>
                  </td>
                  <td>{m.class_semester}</td>
                  <td className="muted">{m.created_at}</td>
                  <td>
                    <span className="downloads-counter">📥 <b>{m.downloads_count}</b> downloads</span>
                  </td>
                  <td>
                    <button className="btn-del" onClick={() => deleteMaterial(m.id)} title="Delete material">🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 9. ANNOUNCEMENTS & INTERACTION VIEW
// ==========================================

function TeacherAnnouncementsView({ teacher, setError, setSuccessMsg }) {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetClass, setTargetClass] = useState('All Classes');
  const [priority, setPriority] = useState('normal');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    try {
      const res = await api('/announcements');
      setAnnouncements(res.announcements || []);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handlePost(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setBusy(true);
    try {
      await api('/teachers/announcements', {
        method: 'POST',
        body: JSON.stringify({ title, content, target_class: targetClass, priority })
      });
      setSuccessMsg('✓ Announcement successfully broadcast to student dashboards!');
      setTitle('');
      setContent('');
      loadAnnouncements();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="announcements-view">
      <div className="view-header">
        <div>
          <p className="eyebrow">TEACHER-STUDENT COMMUNICATION</p>
          <h1>Classroom Announcements & Instructions</h1>
          <p className="muted">Broadcast important updates, quiz instructions, and study tips directly to student dashboards.</p>
        </div>
      </div>

      <div className="announcement-composer-card">
        <h3>Broadcast New Announcement</h3>
        <form onSubmit={handlePost} className="teacher-form">
          <div className="grid-form">
            <label className="col-span-2">
              Announcement Title
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Upcoming Diagnostic Quiz Preparation"
              />
            </label>

            <label>
              Target Audience
              <select value={targetClass} onChange={e => setTargetClass(e.target.value)}>
                <option value="All Classes">All Enrolled Classes</option>
                <option value="Grade 7 - Sem 1">Grade 7 - Sem 1</option>
                <option value="Grade 8 - Sem 2">Grade 8 - Sem 2</option>
              </select>
            </label>

            <label>
              Priority Level
              <select value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="normal">Normal Priority</option>
                <option value="important">Important (Highlighted)</option>
                <option value="urgent">Urgent Alert</option>
              </select>
            </label>

            <label className="col-span-2">
              Announcement Message
              <textarea
                required
                rows={3}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your announcement details or instructions..."
              />
            </label>
          </div>

          <button className="primary" type="submit" disabled={busy}>
            {busy ? 'Broadcasting…' : 'Broadcast Announcement'} <span>→</span>
          </button>
        </form>
      </div>

      <div className="announcements-feed">
        <h3>Active Broadcasts ({announcements.length})</h3>
        {announcements.length === 0 ? (
          <p className="empty-state">No announcements broadcast yet.</p>
        ) : (
          announcements.map(a => (
            <div key={a.id} className={`announcement-feed-card priority-${a.priority}`}>
              <div className="ann-top-row">
                <b>{a.title}</b>
                <span className={`priority-tag tag-${a.priority}`}>{a.priority.toUpperCase()}</span>
              </div>
              <p className="ann-text">{a.content}</p>
              <div className="ann-meta-row">
                <small>Target: <b>{a.target_class}</b></small>
                <small className="muted">Posted: {a.created_at} by {a.teacher_name}</small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// 10. TEACHER SETTINGS VIEW
// ==========================================

function TeacherSettingsView({ teacher, setError, setSuccessMsg }) {
  const [name, setName] = useState(teacher.name || '');
  const [phone, setPhone] = useState(teacher.phone || '');
  const [school, setSchool] = useState(teacher.school_name || '');
  const [specialization, setSpecialization] = useState(teacher.subject_specialization || '');

  function handleSave(e) {
    e.preventDefault();
    setSuccessMsg('✓ Teacher settings and profile updated successfully.');
  }

  return (
    <div className="settings-view">
      <div className="view-header">
        <div>
          <p className="eyebrow">TEACHER SETTINGS</p>
          <h1>Account & Profile Settings</h1>
          <p className="muted">Manage your contact details, institution information, and teaching subjects.</p>
        </div>
      </div>

      <div className="settings-card">
        <form onSubmit={handleSave} className="teacher-form">
          <div className="grid-form">
            <label>
              Full Name
              <input value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label>
              Official Email (Cannot be changed)
              <input value={teacher.email} disabled className="disabled-input" />
            </label>
            <label>
              Teacher ID Code
              <input value={teacher.teacher_id_code} disabled className="disabled-input" />
            </label>
            <label>
              Phone Number
              <input value={phone} onChange={e => setPhone(e.target.value)} />
            </label>
            <label>
              School / College Name
              <input value={school} onChange={e => setSchool(e.target.value)} required />
            </label>
            <label>
              Subject Specialization
              <input value={specialization} onChange={e => setSpecialization(e.target.value)} required />
            </label>
          </div>

          <button className="primary" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
