import React, { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { api } from './api.js';
import TeacherModule from './TeacherModule.jsx';

// Multi-language strings
const words = {
  en: {
    home: 'Home',
    gapFinder: 'Gap Finder',
    practice: 'Practice & AI',
    progress: 'My Progress',
    studyPlan: 'Study Planner',
    classrooms: 'Classrooms',
    childView: 'Child Overview',
    adminPanel: 'Admin & Audit',
    welcome: 'Welcome back',
    tagline: 'Smart, inclusive, and personalized learning for every pace.',
    startPractice: 'Start Practice',
    weakTopics: 'Topics to Strengthen',
    freeHours: 'Free Study Hours Today',
    generatePlan: 'Generate Study Plan',
    submit: 'Check My Answers',
    next: 'Next Practice',
    signOut: 'Sign Out',
    signIn: 'Sign In',
    createAccount: 'Create Account',
    autoQuestion: 'Auto-Made Question',
    speechAudio: 'Read Aloud',
    exportData: 'Export My Data',
    privacy: 'Privacy & Security',
    educatorVerified: 'Educator Verified',
    flagReview: 'Flag for Review',
    strugglingAlert: 'Needs Support'
  },
  hi: {
    home: 'होम',
    gapFinder: 'गैप फाइंडर',
    practice: 'अभ्यास और एआई',
    progress: 'मेरी प्रगति',
    studyPlan: 'अध्ययन योजना',
    classrooms: 'कक्षाएं',
    childView: 'बच्चे की प्रगति',
    adminPanel: 'प्रशासन व ऑडिट',
    welcome: 'वापस स्वागत है',
    tagline: 'हर छात्र की अपनी गति के लिए स्मार्ट, समावेशी और व्यक्तिगत शिक्षा।',
    startPractice: 'अभ्यास शुरू करें',
    weakTopics: 'कमजोर विषय जिन्हें सुधारें',
    freeHours: 'आज पढ़ाई का खाली समय',
    generatePlan: 'मेरी योजना बनाएं',
    submit: 'उत्तर जांचें',
    next: 'अगला अभ्यास',
    signOut: 'साइन आउट',
    signIn: 'साइन इन',
    createAccount: 'खाता बनाएं',
    autoQuestion: 'एआई निर्मित प्रश्न',
    speechAudio: 'बोलकर सुनाएं',
    exportData: 'डेटा डाउनलोड करें',
    privacy: 'डेटा और गोपनीयता',
    educatorVerified: 'शिक्षक सत्यापित',
    flagReview: 'समीक्षा के लिए भेजें',
    strugglingAlert: 'सहयोग की आवश्यकता'
  },
  kn: {
    home: 'ಮುಖಪುಟ',
    gapFinder: 'ಗ್ಯಾಪ್ ಫೈಂಡರ್',
    practice: 'ಅಭ್ಯಾಸ & ಎಐ',
    progress: 'ನನ್ನ ಪ್ರಗತಿ',
    studyPlan: 'ಕಲಿಕಾ ಯೋಜನೆ',
    classrooms: 'ತರಗತಿಗಳು',
    childView: 'ಮಗುವಿನ ಪ್ರಗತಿ',
    adminPanel: 'ಆಡಳಿತ ಮಂಡಳಿ',
    welcome: 'ಮತ್ತೆ ಸ್ವಾಗತ',
    tagline: 'ಪ್ರತಿಯೊಬ್ಬರ ವೇಗಕ್ಕೆ ತಕ್ಕಂತೆ ಸ್ಮಾರ್ಟ್ ಮತ್ತು ವೈಯಕ್ತಿಕ ಶಿಕ್ಷಣ.',
    startPractice: 'ಅಭ್ಯಾಸ ಪ್ರಾರಂಭಿಸಿ',
    weakTopics: 'ಸುಧಾರಿಸಬೇಕಾದ ವಿಷಯಗಳು',
    freeHours: 'ಇಂದು ಓದಲು ಲಭ್ಯವಿರುವ ಸಮಯ',
    generatePlan: 'ಯೋಜನೆ ರಚಿಸಿ',
    submit: 'ಉತ್ತರ ಪರಿಶೀಲಿಸಿ',
    next: 'ಮುಂದಿನ ಅಭ್ಯಾಸ',
    signOut: 'ಸೈನ್ ಔಟ್',
    signIn: 'ಸೈನ್ ಇನ್',
    createAccount: 'ಖಾತೆ ತೆರೆಯಿರಿ',
    autoQuestion: 'ಎಐ ಪ್ರಶ್ನೆ ರಚನೆ',
    speechAudio: 'ಧ್ವನಿ ಆಲಿಸಿ',
    exportData: 'ಡೇಟಾ ಡೌನ್‌ಲೋಡ್',
    privacy: 'ಗೌಪ್ಯತೆ ಮತ್ತು ರಕ್ಷಣೆ',
    educatorVerified: 'ಶಿಕ್ಷಕರಿಂದ ಪರಿಶೀಲಿತ',
    flagReview: 'ಪರಿಶೀಲನೆಗೆ ವರದಿ ಮಾಡಿ',
    strugglingAlert: 'ಸಹಾಯ ಬೇಕಾಗಿದೆ'
  }
};

// Text-to-Speech Helper
function playTTS(text, lang = 'en') {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  if (lang === 'hi') utterance.lang = 'hi-IN';
  else if (lang === 'kn') utterance.lang = 'kn-IN';
  else utterance.lang = 'en-US';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api('/auth/me')
      .then(d => setUser(d.user))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const t = words[user?.language || 'en'] || words.en;

  async function signOut() {
    await api('/auth/logout', { method: 'POST' });
    setUser(null);
    navigate('/');
  }

  async function switchDemoRole(role) {
    try {
      const res = await api('/auth/demo-switch', {
        method: 'POST',
        body: JSON.stringify({ role })
      });
      setUser(res.user);
      navigate(
        role === 'teacher' ? '/teacher' :
        role === 'parent' ? '/child-view' :
        role === 'admin' ? '/admin' : '/dashboard'
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function changeLanguage(newLang) {
    if (!user) return;
    try {
      const res = await api('/profile/language', {
        method: 'PUT',
        body: JSON.stringify({ language: newLang })
      });
      setUser(res.user);
    } catch (err) {
      setError(err.message);
    }
  }

  if (checking) return <div className="loading"><div className="spinner"></div><p>Opening your personalized learning space…</p></div>;

  return (
    <div className="app-shell">
      {/* Top Bar Navigation */}
      <header className="topbar">
        <div className="topbar-left">
          <Link className="brand" to={user ? (user.role === 'teacher' ? '/teacher' : user.role === 'parent' ? '/child-view' : user.role === 'admin' ? '/admin' : '/dashboard') : '/'}>
            <span className="brand-mark">L</span>
            <span className="brand-name">Learn<span className="brand-accent">X</span></span>
          </Link>
          <span className="edutech-badge" onClick={() => setShowSpecModal(true)} title="View EduTech Architecture Goals">
            Domain 2 · EduTech ✦
          </span>
        </div>

        {/* Dynamic Nav based on role */}
        {user && (
          <nav className="role-nav">
            {user.role === 'student' && (
              <>
                <Link to="/dashboard">{t.home}</Link>
                <Link to="/gap-finder">{t.gapFinder}</Link>
                <Link to="/practice">{t.practice}</Link>
                <Link to="/study-plan">{t.studyPlan}</Link>
                <Link to="/progress">{t.progress}</Link>
              </>
            )}
            {user.role === 'teacher' && (
              <>
                <Link to="/teacher">📊 Teacher Dashboard & Quizzes</Link>
                <Link to="/gap-finder">{t.gapFinder} Radar</Link>
                <Link to="/practice">Test Practice</Link>
              </>
            )}
            {user.role === 'parent' && (
              <>
                <Link to="/child-view">{t.childView}</Link>
                <Link to="/practice">Preview Practice</Link>
              </>
            )}
            {user.role === 'admin' && (
              <>
                <Link to="/admin">{t.adminPanel}</Link>
                <Link to="/teacher">Teacher Module</Link>
                <Link to="/dashboard">Learner View</Link>
              </>
            )}
          </nav>
        )}

        {/* Top Right Controls & Role Switcher */}
        <div className="top-actions">
          {/* Demo fast role switcher */}
          <div className="demo-role-switcher" title="Switch view to evaluate all 4 user personas">
            <span className="switcher-label">View As:</span>
            <button className={`role-pill ${user?.role === 'student' ? 'active' : ''}`} onClick={() => switchDemoRole('student')}>🎓 Student</button>
            <button className={`role-pill ${user?.role === 'teacher' ? 'active' : ''}`} onClick={() => switchDemoRole('teacher')}>👩‍🏫 Teacher</button>
            <button className={`role-pill ${user?.role === 'parent' ? 'active' : ''}`} onClick={() => switchDemoRole('parent')}>👨‍👩‍👧 Parent</button>
            <button className={`role-pill ${user?.role === 'admin' ? 'active' : ''}`} onClick={() => switchDemoRole('admin')}>🏛️ Admin</button>
          </div>

          {/* Language Selector */}
          <select
            className="lang-select"
            aria-label="Choose language"
            value={user?.language || 'en'}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">English (EN)</option>
            <option value="hi">हिन्दी (HI)</option>
            <option value="kn">ಕನ್ನಡ (KN)</option>
          </select>

          {user ? (
            <div className="user-profile-controls">
              <button className="icon-btn" onClick={() => setShowPrivacyModal(true)} title="Privacy & Data Control">🛡️</button>
              <button className="text-button" onClick={signOut}>{t.signOut}</button>
            </div>
          ) : (
            <button className="primary nav-cta" onClick={() => navigate('/')}>{t.signIn}</button>
          )}
        </div>
      </header>

      {/* Global Error Banner */}
      {error && (
        <div className="toast" role="alert">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* App Routes */}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthPage onLogin={setUser} onOpenSpec={() => setShowSpecModal(true)} />} />
        <Route path="/dashboard" element={user ? <StudentDashboard user={user} t={t} setError={setError} /> : <Navigate to="/" />} />
        <Route path="/gap-finder" element={user ? <GapFinderView user={user} t={t} setError={setError} /> : <Navigate to="/" />} />
        <Route path="/practice" element={user ? <PracticeView user={user} t={t} setError={setError} /> : <Navigate to="/" />} />
        <Route path="/study-plan" element={user ? <StudyPlanView user={user} t={t} setError={setError} /> : <Navigate to="/" />} />
        <Route path="/progress" element={user ? <ProgressView user={user} t={t} setError={setError} /> : <Navigate to="/" />} />
        <Route path="/teacher/*" element={<TeacherModule user={user} onLogout={signOut} />} />
        <Route path="/teacher" element={<TeacherModule user={user} onLogout={signOut} />} />
        <Route path="/classrooms" element={<TeacherModule user={user} onLogout={signOut} />} />
        <Route path="/child-view" element={user ? <ParentDashboard user={user} t={t} setError={setError} /> : <Navigate to="/" />} />
        <Route path="/admin" element={user ? <AdminDashboard user={user} t={t} setError={setError} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} />} />
      </Routes>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div>
            <b>LearnX</b> · Smart, Inclusive & Personalized Education.
            <span>Built for Students, Teachers, Parents, Schools & Colleges.</span>
          </div>
          <div className="footer-links">
            <button className="link-text" onClick={() => setShowSpecModal(true)}>📋 6 Mandatory Features Spec</button>
            <button className="link-text" onClick={() => setShowPrivacyModal(true)}>🔒 Data Privacy & Zero-Track Guarantee</button>
          </div>
        </div>
      </footer>

      {/* Specification Modal (Visual Breakdown of the User's Uploaded Slide) */}
      {showSpecModal && <EduTechSpecModal onClose={() => setShowSpecModal(false)} />}

      {/* Data & Privacy Compliance Modal (Mandatory Feature 4) */}
      {showPrivacyModal && <DataPrivacyModal user={user} onClose={() => setShowPrivacyModal(false)} setError={setError} />}
    </div>
  );
}

// ==========================================
// AUTH & WELCOME PAGE (Problem & Users Showcase)
// ==========================================

function AuthPage({ onLogin, onOpenSpec }) {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: 'student@learnx.org', password: 'student123' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = await api(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify({ ...form, role })
      });
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function fillDemo(r) {
    setRole(r);
    setMode('login');
    if (r === 'student') setForm({ name: 'Asha Rao', email: 'student@learnx.org', password: 'student123' });
    if (r === 'teacher') setForm({ name: 'Prof. Ananya', email: 'teacher@learnx.org', password: 'teacher123' });
    if (r === 'parent') setForm({ name: 'Kiran Rao', email: 'parent@learnx.org', password: 'parent123' });
    if (r === 'admin') setForm({ name: 'Dr. Ramesh', email: 'admin@learnx.org', password: 'admin123' });
  }

  return (
    <main className="auth-layout">
      {/* Left Hero: The Problem & Audience Showcase */}
      <section className="hero-copy">
        <div className="domain-tag">DOMAIN 2 OF 4 · EDUTECH</div>
        <h1>Smart, Inclusive &<br /><span>Personalized Education</span></h1>
        
        <div className="problem-box">
          <span className="problem-badge">THE REAL LEARNING PROBLEM</span>
          <p>Students learn at different speeds, face language barriers, and lack 1-on-1 personal guidance when gaps in foundational math and reading go unnoticed.</p>
        </div>

        <div className="audience-pills">
          <span className="pill-title">BUILT FOR:</span>
          <span>🎓 Students</span>
          <span>👩‍🏫 Teachers</span>
          <span>👨‍👩‍👧 Parents</span>
          <span>🏫 Schools & Colleges</span>
        </div>

        <div className="mandatory-features-preview" onClick={onOpenSpec}>
          <div className="preview-header">
            <b>6 MANDATORY FEATURES EMBEDDED:</b>
            <span className="click-hint">Click to inspect →</span>
          </div>
          <div className="feature-checklist">
            <div>✓ 1. Problem & Multi-User Architecture</div>
            <div>✓ 2. Core Gap Finder & Free-Hours Planner</div>
            <div>✓ 3. Easy Mobile UI & Local Languages</div>
            <div>✓ 4. Strict Data & Privacy RBAC</div>
            <div>✓ 5. Progress Charts & Mastery Tracking</div>
            <div>✓ 6. Safe & Responsible AI with Teacher Reviews</div>
          </div>
        </div>

        <div className="quote-card">
          <span className="quote-icon">✦</span>
          <p>Every learner is unique. <b>We trace weak topics to their root causes</b> and schedule bite-sized study blocks around real free hours.</p>
        </div>
      </section>

      {/* Right Form: Login, Register & Quick Demo Switch */}
      <section className="auth-card">
        <div className="auth-header">
          <span className="card-kicker">WELCOME TO LEARNX</span>
          <h2>{mode === 'register' ? 'Join as a Learner or Educator' : 'Sign in to your space'}</h2>
          <p className="muted">Pick a persona below for instant 1-click evaluation:</p>
        </div>

        {/* 1-Click Demo Buttons */}
        <div className="quick-demo-buttons">
          <button type="button" className={`demo-btn ${role === 'student' ? 'selected' : ''}`} onClick={() => fillDemo('student')}>
            🎓 Student
          </button>
          <button type="button" className={`demo-btn ${role === 'teacher' ? 'selected' : ''}`} onClick={() => fillDemo('teacher')}>
            👩‍🏫 Teacher
          </button>
          <button type="button" className={`demo-btn ${role === 'parent' ? 'selected' : ''}`} onClick={() => fillDemo('parent')}>
            👨‍👩‍👧 Parent
          </button>
          <button type="button" className={`demo-btn ${role === 'admin' ? 'selected' : ''}`} onClick={() => fillDemo('admin')}>
            🏛️ Admin
          </button>
        </div>

        <form onSubmit={submit}>
          {mode === 'register' && (
            <>
              <label>
                Full Name
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Asha Rao"
                />
              </label>
              <label>
                Account Role
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="student">Student (Learner)</option>
                  <option value="teacher">Teacher (Classroom Creator)</option>
                  <option value="parent">Parent (Child Guardian)</option>
                  <option value="admin">School Administrator</option>
                </select>
              </label>
            </>
          )}

          <label>
            Email Address
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Your password"
            />
          </label>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="primary full" disabled={busy}>
            {busy ? 'Verifying…' : mode === 'register' ? `Create ${role} account` : `Sign in as ${role}`} <span>→</span>
          </button>
        </form>

        <p className="switch-mode">
          {mode === 'register' ? 'Already have an account?' : 'New to LearnX?'}
          <button type="button" onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }}>
            {mode === 'register' ? 'Sign in' : 'Register new account'}
          </button>
        </p>

        <p className="privacy-note">🔒 Private by design. Students, teachers, and admins see only their own data.</p>
      </section>
    </main>
  );
}

// ==========================================
// STUDENT DASHBOARD
// ==========================================

function StudentDashboard({ user, t, setError }) {
  const [data, setData] = useState(null);
  const [gapData, setGapData] = useState(null);
  const [classCode, setClassCode] = useState('');
  const [enrollMsg, setEnrollMsg] = useState('');
  const [freeHours, setFreeHours] = useState(30);

  // Teacher Module integrations
  const [announcements, setAnnouncements] = useState([]);
  const [assignedQuizzes, setAssignedQuizzes] = useState([]);
  const [assignedMaterials, setAssignedMaterials] = useState([]);
  const [takingQuiz, setTakingQuiz] = useState(null);
  const [quizTimer, setQuizTimer] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  useEffect(() => {
    Promise.all([
      api('/progress'),
      api('/topics'),
      api('/gap-finder/analysis'),
      api('/announcements').catch(() => ({ announcements: [] })),
      api('/students/quizzes').catch(() => ({ quizzes: [] })),
      api('/students/materials').catch(() => ({ materials: [] }))
    ])
      .then(([progress, topicData, gapAnalysis, annData, qData, matData]) => {
        setData({ ...progress, topics: topicData.topics, metadata: topicData.metadata });
        setGapData(gapAnalysis);
        setAnnouncements(annData.announcements || []);
        setAssignedQuizzes(qData.quizzes || []);
        setAssignedMaterials(matData.materials || []);
      })
      .catch(e => setError(e.message));
  }, []);

  // Timer countdown for active quiz
  useEffect(() => {
    if (!takingQuiz || quizResult || quizTimer <= 0) return;
    const interval = setInterval(() => {
      setQuizTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          submitQuizAttempt();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [takingQuiz, quizResult, quizTimer]);

  async function startQuiz(quizSummary) {
    try {
      const res = await api(`/teachers/quizzes/${quizSummary.id}`);
      setTakingQuiz(res.quiz || quizSummary);
      setQuizTimer((res.quiz?.time_limit || 20) * 60);
      setQuizAnswers({});
      setQuizResult(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function submitQuizAttempt() {
    if (!takingQuiz) return;
    setSubmittingQuiz(true);
    try {
      const answersArray = (takingQuiz.questions || []).map((q, idx) => quizAnswers[idx] || '');
      const res = await api(`/students/quizzes/${takingQuiz.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers: answersArray })
      });
      setQuizResult(res);
      api('/progress').then(p => setData(prev => ({ ...prev, ...p }))).catch(() => {});
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmittingQuiz(false);
    }
  }

  async function downloadMaterial(m) {
    await api(`/materials/${m.id}/download`, { method: 'POST' }).catch(() => {});
    alert(`Downloading "${m.file_name}" (${m.file_size_kb} KB).\nInstructor: ${m.teacher_name}\nSubject: ${m.subject}`);
  }

  async function joinClassroom(e) {
    e.preventDefault();
    if (!classCode.trim()) return;
    try {
      const res = await api('/student/enroll', {
        method: 'POST',
        body: JSON.stringify({ code: classCode })
      });
      setEnrollMsg(`✓ Successfully enrolled in ${res.classroom.name}!`);
      setClassCode('');
    } catch (err) {
      setError(err.message);
    }
  }

  if (!data) return <div className="loading"><div className="spinner"></div><p>Synthesizing your learning snapshot…</p></div>;

  const byTopic = new Map(data.summary.map(x => [x.topic, x]));
  const weakest = data.topics.map(topic => ({
    topic,
    ...(byTopic.get(topic) || { percent: null, tries: 0 })
  })).sort((a, b) => (a.percent ?? 0) - (b.percent ?? 0));

  const focusTopic = weakest[0]?.topic || data.topics[0];

  return (
    <main className="page">
      {/* Welcome & Motivational Stats */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <p className="eyebrow">SMART · INCLUSIVE · PERSONALIZED</p>
          <h1>{t.welcome}, {user.name.split(' ')[0]} <span className="sparkle">✦</span></h1>
          <p className="muted">{t.tagline}</p>
        </div>
        <div className="gamification-pills">
          <div className="pill-stat">
            <span className="stat-icon">🔥</span>
            <div><b>{data.stats.streakDays} Day</b><small>Learning Streak</small></div>
          </div>
          <div className="pill-stat">
            <span className="stat-icon">🌟</span>
            <div><b>{data.stats.xpPoints} XP</b><small>Total Knowledge XP</small></div>
          </div>
          <div className="pill-stat">
            <span className="stat-icon">🎯</span>
            <div><b>{data.stats.overallAccuracy}%</b><small>Overall Accuracy</small></div>
          </div>
        </div>
      </div>

      {/* CORE CHALLENGE 1: The Gap Finder Spotlight Card */}
      <section className="gap-spotlight-card">
        <div className="gap-info">
          <span className="feature-tag">MANDATORY FEATURE 2 · CORE CHALLENGE</span>
          <h2>Root-Cause Gap Finder</h2>
          <p>We trace learning struggle back to underlying prerequisite misconceptions rather than just memorizing formulas.</p>
          
          {gapData?.knowledgeTree?.find(k => k.status === 'gap_detected') ? (
            <div className="detected-gap-alert">
              <span className="pulse-dot">●</span>
              <div>
                <b>Root Cause Detected:</b> {gapData.knowledgeTree.find(k => k.status === 'gap_detected').title}
                <p>{gapData.knowledgeTree.find(k => k.status === 'gap_detected').advice}</p>
              </div>
            </div>
          ) : (
            <div className="no-gaps-badge">✓ Foundational prerequisite checks look strong! Keep up the practice.</div>
          )}

          <div className="action-buttons">
            <Link className="primary link-button" to="/gap-finder">
              Open Prerequisite Gap Map <span>→</span>
            </Link>
            <Link className="secondary-button" to={`/practice?topic=${encodeURIComponent(focusTopic)}`}>
              Start Targeted Practice
            </Link>
          </div>
        </div>

        <div className="free-hours-planner-box">
          <span className="box-title">⏱️ PLAN AROUND FREE HOURS</span>
          <p className="small-text">How much time do you have to learn today?</p>
          <div className="time-select-row">
            {[15, 30, 45, 60].map(mins => (
              <button
                key={mins}
                type="button"
                className={`time-pill ${freeHours === mins ? 'selected' : ''}`}
                onClick={() => setFreeHours(mins)}
              >
                {mins} mins
              </button>
            ))}
          </div>
          <Link
            to={`/study-plan?time=${freeHours}&topic=${encodeURIComponent(focusTopic)}`}
            className="full-plan-btn"
          >
            Generate {freeHours}-Min Micro-Plan →
          </Link>
        </div>
      </section>

      {/* Topics & Mastery Snapshot */}
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR KNOWLEDGE FOUNDATIONS</p>
          <h2>{t.weakTopics}</h2>
        </div>
        <Link to="/progress" className="subtle-link">View Full Visual Charts →</Link>
      </div>

      <div className="topic-grid">
        {weakest.map((item, i) => {
          const score = item.percent ?? 0;
          const statusColor = score >= 80 ? 'green' : score >= 50 ? 'yellow' : 'red';
          return (
            <div className={`topic-card status-${statusColor}`} key={item.topic}>
              <div className="card-top">
                <span className={`topic-icon color-${i % 4}`}>
                  {['½', 'x²', 'Aa', '⚗️'][i % 4]}
                </span>
                <span className="level-badge">Grade 7-8</span>
              </div>
              <div className="topic-title">{item.topic}</div>
              <div className="progress-line">
                <i style={{ width: `${score}%` }} className={`bar-${statusColor}`} />
              </div>
              <div className="topic-meta">
                <span>{item.tries > 0 ? `${score}% average (${item.tries} sets)` : 'Not practised yet'}</span>
                <Link to={`/practice?topic=${encodeURIComponent(item.topic)}`}>Practise →</Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bonus Features Quick Strip */}
      <div className="bonus-features-strip">
        <div className="bonus-item">
          <span className="bonus-icon">✨</span>
          <div>
            <b>Auto-Made Questions</b>
            <p>Generate endless AI practice questions targeting your exact weak spot.</p>
            <Link to="/practice?mode=ai">Try AI Generator →</Link>
          </div>
        </div>
        <div className="bonus-item">
          <span className="bonus-icon">🔊</span>
          <div>
            <b>Audio Read-Aloud</b>
            <p>Multilingual Text-to-Speech helps overcome language barriers.</p>
            <span className="tag">En, Hi, Kn Supported</span>
          </div>
        </div>
        <div className="bonus-item">
          <span className="bonus-icon">🏫</span>
          <div>
            <b>Teacher Classroom Join</b>
            <form onSubmit={joinClassroom} className="inline-enroll-form">
              <input
                placeholder="Class Code (e.g. MATH7A)"
                value={classCode}
                onChange={e => setClassCode(e.target.value)}
              />
              <button type="submit">Join</button>
            </form>
            {enrollMsg && <small className="success-msg">{enrollMsg}</small>}
          </div>
        </div>
      </div>

      {/* Recent Practice History */}
      <section className="recent-card">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">YOUR AUDITABLE PROGRESS</p>
            <h2>Recent Practice Sessions</h2>
          </div>
          <Link to="/progress" className="subtle-link">See all →</Link>
        </div>
        {data.attempts.length === 0 ? (
          <div className="empty-state">No practice attempts yet. Start your first 3-minute quiz above!</div>
        ) : (
          data.attempts.slice(0, 4).map(a => (
            <div className="recent-row" key={a.id}>
              <span className="result-check">✓</span>
              <div>
                <b>{a.topic}</b>
                {a.rootCauses?.length > 0 && <span className="root-cause-tag">{a.rootCauses[0].replace(/_/g, ' ')}</span>}
              </div>
              <span className="recent-score">{a.score}/{a.total} correct ({Math.round((a.score / a.total) * 100)}%)</span>
              <span className="muted">{new Date(a.createdAt).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

// ==========================================
// 2. CORE CHALLENGE: GAP FINDER & ROOT CAUSE MAP
// ==========================================

function GapFinderView({ user, t, setError }) {
  const [data, setData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [freeMins, setFreeMins] = useState(30);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/gap-finder/analysis')
      .then(d => {
        setData(d);
        if (d.knowledgeTree && d.knowledgeTree.length > 0) {
          const firstGap = d.knowledgeTree.find(n => n.status === 'gap_detected') || d.knowledgeTree[0];
          setSelectedNode(firstGap);
        }
      })
      .catch(e => setError(e.message));
  }, []);

  async function generateCustomPlan() {
    if (!selectedNode) return;
    setBusy(true);
    try {
      const res = await api('/study-plan/generate', {
        method: 'POST',
        body: JSON.stringify({
          topic: selectedNode.domain,
          rootCauseKey: selectedNode.rootCauseKey,
          freeMinutes: freeMins
        })
      });
      setGeneratedPlan(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!data) return <div className="loading"><div className="spinner"></div><p>Tracing knowledge prerequisites…</p></div>;

  return (
    <main className="page">
      <div className="page-header">
        <p className="eyebrow">MANDATORY FEATURE 2 · CORE CHALLENGE</p>
        <h1>Prerequisite Gap Finder & Knowledge Tree</h1>
        <p className="muted">
          Unlike ordinary quizzes that just say "wrong", the Gap Finder maps your answers back to foundational cognitive causes.
        </p>
      </div>

      <div className="gap-finder-grid">
        {/* Knowledge Tree Nodes */}
        <section className="tree-card">
          <h3>Prerequisite Foundations Map</h3>
          <p className="card-sub">Click a node to inspect root causes and targeted remedies:</p>
          <div className="nodes-flow">
            {data.knowledgeTree.map((node, i) => {
              const isGap = node.status === 'gap_detected';
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  className={`node-pill ${isGap ? 'node-gap' : 'node-ok'} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="node-indicator">{isGap ? '⚠️' : '✓'}</div>
                  <div className="node-details">
                    <span className="node-domain">{node.domain}</span>
                    <b>{node.title}</b>
                    <small>Prerequisite: {node.prerequisiteNode}</small>
                  </div>
                  {isGap && <span className="root-alert-badge">Root Gap</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Selected Node Remediation Inspector */}
        {selectedNode && (
          <section className="node-inspector-card">
            <div className="inspector-header">
              <span className="status-label">{selectedNode.status === 'gap_detected' ? '⚠️ Root Cause Identified' : '✓ Foundation Verified'}</span>
              <h2>{selectedNode.title}</h2>
              <p className="domain-label">Subject: {selectedNode.domain}</p>
            </div>

            <div className="cause-explanation-box">
              <b>Core Misconception:</b>
              <p>{selectedNode.advice}</p>
            </div>

            <div className="prereq-box">
              <b>Prerequisite Skill Required:</b>
              <p>✦ {selectedNode.prerequisiteNode}</p>
            </div>

            {/* Micro-Session Study Planner */}
            <div className="study-planner-section">
              <h3>Plan Study Around Free Hours</h3>
              <p className="small-text">Select your available time to build a personalized study session:</p>

              <div className="free-hours-row">
                {[15, 30, 45, 60, 90].map(m => (
                  <button
                    key={m}
                    className={`time-chip ${freeMins === m ? 'active' : ''}`}
                    onClick={() => setFreeMins(m)}
                  >
                    {m} min
                  </button>
                ))}
              </div>

              <button className="primary full" onClick={generateCustomPlan} disabled={busy}>
                {busy ? 'Synthesizing Plan…' : `Build ${freeMins}-Minute Remediation Plan`} <span>→</span>
              </button>
            </div>

            {generatedPlan && (
              <div className="generated-plan-results">
                <h4>✓ Custom {freeMins}-Minute Remediation Schedule:</h4>
                <div className="plan-blocks-list">
                  {generatedPlan.blocks.map((b, idx) => (
                    <div className="plan-block-row" key={idx}>
                      <span className="block-time">{b.time}</span>
                      <div>
                        <b>{b.phase}</b>
                        <p>{b.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/study-plan" className="open-full-plan-btn">Save to Active Daily Planner →</Link>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

// ==========================================
// 3. EASY TO USE & PRACTICE (Curriculum & AI Auto-Questions)
// ==========================================

function PracticeView({ user, t, setError }) {
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState('Fractions');
  const [difficulty, setDifficulty] = useState('standard');
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState('curriculum'); // 'curriculum' or 'ai_auto'
  const [aiQuestion, setAiQuestion] = useState(null);
  const [aiSelectedChoice, setAiSelectedChoice] = useState(-1);
  const [aiSubmitted, setAiSubmitted] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [flaggingQuestionId, setFlaggingQuestionId] = useState(null);
  const [flagSuccessMsg, setFlagSuccessMsg] = useState('');

  const lang = user?.language || 'en';

  useEffect(() => {
    api('/topics')
      .then(d => {
        setTopics(d.topics);
        const urlParams = new URLSearchParams(window.location.search);
        const queryTopic = urlParams.get('topic');
        const queryMode = urlParams.get('mode');
        if (queryTopic && d.topics.includes(queryTopic)) setTopic(queryTopic);
        if (queryMode === 'ai') setMode('ai_auto');
      })
      .catch(e => setError(e.message));
  }, []);

  // Fetch standard curriculum quiz
  useEffect(() => {
    if (mode === 'curriculum' && topic) {
      api(`/quiz/${encodeURIComponent(topic)}?lang=${lang}&level=${difficulty}`)
        .then(d => {
          setQuiz(d.questions);
          setAnswers(Array(d.questions.length).fill(-1));
          setResult(null);
        })
        .catch(e => setError(e.message));
    }
  }, [topic, difficulty, lang, mode]);

  // Generate AI auto question
  async function generateAiQuestion() {
    setBusy(true);
    setAiSubmitted(false);
    setAiSelectedChoice(-1);
    try {
      const res = await api('/ai/generate-question', {
        method: 'POST',
        body: JSON.stringify({ topic, difficulty })
      });
      setAiQuestion(res.question);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (mode === 'ai_auto') generateAiQuestion();
  }, [mode, topic, difficulty]);

  async function submitQuiz() {
    if (answers.some(a => a < 0)) {
      setError('Please select an answer for every question before submitting.');
      return;
    }
    setBusy(true);
    try {
      const res = await api(`/quiz/${encodeURIComponent(topic)}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          answers,
          questionIds: quiz.map(q => q.id)
        })
      });
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitFlag(qId, qText, expl) {
    if (!flagReason.trim()) return;
    try {
      await api('/ai/flag-explanation', {
        method: 'POST',
        body: JSON.stringify({
          questionId: qId,
          questionText: qText,
          aiExplanation: expl,
          reason: flagReason
        })
      });
      setFlagSuccessMsg('✓ Flag submitted! A teacher will review and verify this explanation.');
      setFlagReason('');
      setTimeout(() => {
        setFlaggingQuestionId(null);
        setFlagSuccessMsg('');
      }, 3000);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="page narrow">
      <div className="practice-header">
        <p className="eyebrow">SMART & INCLUSIVE PRACTICE</p>
        <h1>One Step at a Time</h1>
        <p className="muted">Learn through scaffolded practice, audio read-alouds, and root-cause feedback.</p>
      </div>

      {/* Controls: Mode, Topic, Difficulty */}
      <div className="practice-controls-card">
        <div className="control-group">
          <label>Practice Mode</label>
          <div className="pill-toggle">
            <button
              className={mode === 'curriculum' ? 'active' : ''}
              onClick={() => { setMode('curriculum'); setResult(null); }}
            >
              📖 Curriculum Diagnostic
            </button>
            <button
              className={mode === 'ai_auto' ? 'active' : ''}
              onClick={() => { setMode('ai_auto'); setResult(null); }}
            >
              ✨ Bonus: Auto-Made AI Question
            </button>
          </div>
        </div>

        <div className="filter-row">
          <label>
            Topic
            <select value={topic} onChange={e => setTopic(e.target.value)}>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>

          <label>
            Learning Level
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="foundational">Level 1: Foundational (Scaffolded)</option>
              <option value="standard">Level 2: Standard Grade Level</option>
              <option value="advanced">Level 3: Multi-Step Advanced</option>
            </select>
          </label>
        </div>
      </div>

      {/* MODE 1: Standard Curriculum Diagnostic Quiz */}
      {mode === 'curriculum' && (
        <>
          {result ? (
            /* Results View */
            <section className="result-card">
              <div className="result-header">
                <div className="medal-icon">{result.score === result.total ? '🌟' : '✓'}</div>
                <h2>Score: {result.score} out of {result.total} ({result.percent}%)</h2>
                <p className="muted">Feedback is designed for growth. Inspect the root-cause notes below:</p>
              </div>

              {/* Diagnosed Gaps Summary */}
              {result.diagnosedGaps?.length > 0 && (
                <div className="gaps-summary-banner">
                  <b>⚠️ Detected Root-Cause Gaps:</b>
                  {result.diagnosedGaps.map(g => (
                    <div key={g.key} className="gap-item-advice">
                      <strong>{g.details.title}:</strong> {g.details.description}
                      <p>💡 Remedy: {g.details.drillExample}</p>
                    </div>
                  ))}
                  <Link to="/gap-finder" className="plan-link-highlight">Go to Root-Cause Prerequisite Map →</Link>
                </div>
              )}

              {/* Feedback per question */}
              <div className="feedback-list">
                {result.feedback.map((f, i) => (
                  <div className={`feedback-card ${f.correct ? 'is-correct' : 'is-wrong'}`} key={i}>
                    <div className="feedback-top">
                      <b>{f.correct ? '✓ Correct' : '↻ Concept Review'} · Question {i + 1}</b>
                      <span className="verified-pill">🛡️ {t.educatorVerified}</span>
                      <button
                        className="tts-btn"
                        onClick={() => playTTS(f.explanation, lang)}
                        title="Listen to Explanation"
                      >
                        🔊 Listen
                      </button>
                    </div>
                    <p className="expl-text">{f.explanation}</p>
                    {f.rootCauseNote && (
                      <div className="root-cause-explanation">
                        <small>🔍 ROOT CAUSE INSIGHT:</small>
                        <p>{f.rootCauseNote}</p>
                      </div>
                    )}

                    {/* Teacher review flag trigger */}
                    <button
                      className="flag-btn"
                      onClick={() => setFlaggingQuestionId(f.questionId)}
                    >
                      🚩 {t.flagReview}
                    </button>

                    {flaggingQuestionId === f.questionId && (
                      <div className="flag-form-inline">
                        <input
                          placeholder="Why should this be reviewed? (e.g. confusing wording)"
                          value={flagReason}
                          onChange={e => setFlagReason(e.target.value)}
                        />
                        <button onClick={() => submitFlag(f.questionId, `Question ${i + 1}`, f.explanation)}>Submit Flag</button>
                        {flagSuccessMsg && <p className="success-text">{flagSuccessMsg}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button className="primary" onClick={() => { setResult(null); setAnswers(Array(quiz.length).fill(-1)); }}>
                {t.next} →
              </button>
            </section>
          ) : (
            /* Questions View */
            <div className="questions-container">
              {quiz.map((q, i) => (
                <section className="question-card" key={q.id}>
                  <div className="question-header">
                    <span className="question-index">QUESTION {i + 1} OF {quiz.length}</span>
                    <button
                      className="tts-btn"
                      onClick={() => playTTS(q.question, lang)}
                      title="Read question aloud"
                    >
                      🔊 {t.speechAudio}
                    </button>
                  </div>
                  <h2 className="question-prompt">{q.question}</h2>
                  <div className="choices-grid">
                    {q.choices.map((choice, j) => (
                      <button
                        key={j}
                        type="button"
                        className={`choice-button ${answers[i] === j ? 'selected' : ''}`}
                        onClick={() => setAnswers(answers.map((a, k) => k === i ? j : a))}
                      >
                        <span className="choice-label">{String.fromCharCode(65 + j)}</span>
                        <span className="choice-text">{choice}</span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}

              <button className="primary full submit-cta" disabled={busy} onClick={submitQuiz}>
                {busy ? 'Checking Answers…' : t.submit} <span>→</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* MODE 2: Bonus Auto-Made AI Practice Question */}
      {mode === 'ai_auto' && (
        <section className="ai-question-card">
          <div className="ai-badge-row">
            <span className="ai-spark-tag">✨ BONUS FEATURE: ON-DEMAND AI QUESTION</span>
            <span className="verified-pill">🛡️ {t.educatorVerified}</span>
          </div>

          {busy ? (
            <div className="loading"><div className="spinner"></div><p>Generating targeted practice question…</p></div>
          ) : aiQuestion ? (
            <div>
              <div className="question-header">
                <span className="subtopic-tag">{aiQuestion.topic} · {aiQuestion.difficulty}</span>
                <button
                  className="tts-btn"
                  onClick={() => playTTS(aiQuestion.question, lang)}
                  title="Read aloud"
                >
                  🔊 {t.speechAudio}
                </button>
              </div>

              <h2 className="ai-prompt-text">{aiQuestion.question}</h2>

              <div className="choices-grid">
                {aiQuestion.choices.map((choice, j) => (
                  <button
                    key={j}
                    type="button"
                    disabled={aiSubmitted}
                    className={`choice-button ${aiSelectedChoice === j ? 'selected' : ''} ${aiSubmitted ? (j === aiQuestion.answer ? 'correct-choice' : aiSelectedChoice === j ? 'wrong-choice' : '') : ''}`}
                    onClick={() => setAiSelectedChoice(j)}
                  >
                    <span className="choice-label">{String.fromCharCode(65 + j)}</span>
                    <span className="choice-text">{choice}</span>
                  </button>
                ))}
              </div>

              {!aiSubmitted ? (
                <button
                  className="primary full submit-cta"
                  disabled={aiSelectedChoice < 0}
                  onClick={() => setAiSubmitted(true)}
                >
                  Check AI Question Answer <span>→</span>
                </button>
              ) : (
                <div className="ai-feedback-box">
                  <div className="feedback-status">
                    {aiSelectedChoice === aiQuestion.answer ? (
                      <span className="correct-tag">✓ Spot on! Correct answer.</span>
                    ) : (
                      <span className="wrong-tag">↻ Incorrect. Review explanation:</span>
                    )}
                  </div>
                  <p className="expl-text">{aiQuestion.explain}</p>
                  <div className="ai-actions-row">
                    <button className="primary" onClick={generateAiQuestion}>
                      Generate Another AI Question ✨
                    </button>
                    <button
                      className="flag-btn"
                      onClick={() => setFlaggingQuestionId(aiQuestion.id)}
                    >
                      🚩 Flag for Educator Review
                    </button>
                  </div>

                  {flaggingQuestionId === aiQuestion.id && (
                    <div className="flag-form-inline">
                      <input
                        placeholder="Reason to review (e.g. ambiguous answer)"
                        value={flagReason}
                        onChange={e => setFlagReason(e.target.value)}
                      />
                      <button onClick={() => submitFlag(aiQuestion.id, aiQuestion.question, aiQuestion.explain)}>Submit</button>
                      {flagSuccessMsg && <p className="success-text">{flagSuccessMsg}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p>Ready to generate an AI practice question.</p>
          )}
        </section>
      )}
    </main>
  );
}

// ==========================================
// 4. STUDY PLANNER (Around Free Hours)
// ==========================================

function StudyPlanView({ user, t, setError }) {
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [freeHours, setFreeHours] = useState(30);
  const [topic, setTopic] = useState('Fractions');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/study-plan')
      .then(d => {
        setPlans(d.plans);
        setActivePlan(d.activePlan);
      })
      .catch(e => setError(e.message));
  }, []);

  async function generatePlan() {
    setBusy(true);
    try {
      const res = await api('/study-plan/generate', {
        method: 'POST',
        body: JSON.stringify({
          topic,
          freeMinutes: freeHours
        })
      });
      setActivePlan({ ...res.plan, blocks: res.blocks });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleBlock(planId, blockIndex) {
    try {
      const res = await api(`/study-plan/${planId}/toggle-block`, {
        method: 'POST',
        body: JSON.stringify({ blockIndex })
      });
      setActivePlan({ ...activePlan, completed_blocks: res.plan.completed_blocks });
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="page narrow">
      <div className="page-header">
        <p className="eyebrow">CORE CHALLENGE · TIME MANAGEMENT</p>
        <h1>Smart Study Planner</h1>
        <p className="muted">Build realistic, bite-sized study blocks strictly matching your daily free time.</p>
      </div>

      {/* Free Hours Input Card */}
      <section className="create-plan-card">
        <h3>Design Today's Learning Session</h3>
        <div className="plan-input-grid">
          <div>
            <label>Available Free Minutes Today</label>
            <div className="time-select-row">
              {[15, 30, 45, 60, 90].map(m => (
                <button
                  key={m}
                  type="button"
                  className={`time-pill ${freeHours === m ? 'selected' : ''}`}
                  onClick={() => setFreeHours(m)}
                >
                  {m} mins
                </button>
              ))}
            </div>
          </div>

          <div>
            <label>Focus Topic</label>
            <select value={topic} onChange={e => setTopic(e.target.value)}>
              <option value="Fractions">Fractions</option>
              <option value="Basic algebra">Basic Algebra</option>
              <option value="Reading comprehension">Reading Comprehension</option>
              <option value="Science & Logic">Science & Logic</option>
            </select>
          </div>
        </div>

        <button className="primary" onClick={generatePlan} disabled={busy}>
          {busy ? 'Organizing schedule…' : `Generate ${freeHours}-Minute Micro-Plan`} <span>→</span>
        </button>
      </section>

      {/* Active Schedule with Interactive Checkboxes */}
      {activePlan && (
        <section className="active-schedule-card">
          <div className="schedule-header">
            <div>
              <span className="card-kicker">TODAY'S ACTIVE SCHEDULE</span>
              <h2>{activePlan.topic} · {activePlan.daily_minutes} Minutes</h2>
              <small>Targeting: {activePlan.root_cause}</small>
            </div>
            <span className="completion-badge">
              {activePlan.completed_blocks?.length || 0} / {activePlan.blocks?.length || 0} Completed
            </span>
          </div>

          <div className="blocks-checklist">
            {activePlan.blocks?.map((block, idx) => {
              const isChecked = activePlan.completed_blocks?.includes(idx);
              return (
                <div
                  key={idx}
                  className={`block-item ${isChecked ? 'completed' : ''}`}
                  onClick={() => toggleBlock(activePlan.id, idx)}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                  />
                  <div className="block-time-tag">{block.time}</div>
                  <div className="block-text">
                    <b>{block.phase}</b>
                    <p>{block.task}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="schedule-cta-row">
            <Link to={`/practice?topic=${encodeURIComponent(activePlan.topic)}`} className="primary link-button">
              Launch Associated Practice Sets →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

// ==========================================
// 5. PROGRESS TRACKING & VISUAL CHARTS
// ==========================================

function ProgressView({ user, t, setError }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api('/progress')
      .then(setData)
      .catch(e => setError(e.message));
  }, []);

  if (!data) return <div className="loading"><div className="spinner"></div><p>Rendering progress charts…</p></div>;

  const summary = new Map(data.summary.map(x => [x.topic, x]));

  return (
    <main className="page">
      <div className="page-header">
        <p className="eyebrow">MANDATORY FEATURE 5 · TRACK PROGRESS</p>
        <h1>Your Learning Mastery & Progress</h1>
        <p className="muted">Track quiz scores, feedback trends, and resolved root causes over time.</p>
      </div>

      {/* Visual SVG Progress Bar / Radar Chart Card */}
      <section className="charts-card">
        <div className="chart-header">
          <h3>Topic Mastery Distribution</h3>
          <span className="chart-legend">
            <span className="dot green"></span> Mastery (≥80%)
            <span className="dot yellow"></span> In Progress (50-79%)
            <span className="dot red"></span> Root Gap (&lt;50%)
          </span>
        </div>

        {/* SVG Interactive Bar Chart */}
        <div className="svg-chart-container">
          <svg viewBox="0 0 700 240" className="mastery-svg">
            {/* Grid lines */}
            <line x1="120" y1="20" x2="680" y2="20" stroke="#f0edf7" strokeDasharray="4" />
            <line x1="120" y1="70" x2="680" y2="70" stroke="#f0edf7" strokeDasharray="4" />
            <line x1="120" y1="120" x2="680" y2="120" stroke="#f0edf7" strokeDasharray="4" />
            <line x1="120" y1="170" x2="680" y2="170" stroke="#f0edf7" strokeDasharray="4" />

            {/* Bars */}
            {data.topics.map((tName, i) => {
              const item = summary.get(tName);
              const score = item?.percent ?? 0;
              const barWidth = Math.max(10, (score / 100) * 520);
              const y = 35 + i * 50;
              const barFill = score >= 80 ? '#27a075' : score >= 50 ? '#d9971e' : '#be3855';

              return (
                <g key={tName}>
                  <text x="110" y={y + 16} textAnchor="end" fontSize="12" fill="#444158" fontWeight="600">
                    {tName.length > 15 ? tName.substring(0, 14) + '…' : tName}
                  </text>
                  <rect x="120" y={y} width="520" height="24" rx="6" fill="#f4f3f9" />
                  <rect x="120" y={y} width={barWidth} height="24" rx="6" fill={barFill} className="animated-bar" />
                  <text x={130 + barWidth} y={y + 16} fontSize="11" fill="#444158" fontWeight="700">
                    {score}% ({item?.tries || 0} tries)
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      {/* Motivational Badges Showcase */}
      <section className="badges-card">
        <h3>Earned Badges & Milestones</h3>
        <div className="badges-grid">
          {data.badges.map(b => (
            <div key={b.id} className={`badge-pill ${b.unlocked ? 'unlocked' : 'locked'}`}>
              <span className="badge-icon">{b.unlocked ? '🏅' : '🔒'}</span>
              <div>
                <b>{b.name}</b>
                <p>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full Auditable History Table */}
      <section className="recent-card">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">PRACTICE LOG</p>
            <h2>Auditable Attempts History</h2>
          </div>
        </div>

        {data.attempts.length === 0 ? (
          <div className="empty-state">No past attempts. Complete a practice quiz to view history!</div>
        ) : (
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>Root Causes Analyzed</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.attempts.map(a => (
                  <tr key={a.id}>
                    <td><b>{a.topic}</b></td>
                    <td>{a.score} / {a.total}</td>
                    <td>
                      <span className={`pill-score ${a.score / a.total >= 0.7 ? 'good' : 'warning'}`}>
                        {Math.round((a.score / a.total) * 100)}%
                      </span>
                    </td>
                    <td>
                      {a.rootCauses?.length > 0 ? (
                        a.rootCauses.map(rc => <span key={rc} className="small-gap-tag">{rc.replace(/_/g, ' ')}</span>)
                      ) : (
                        <span className="clean-tag">✓ Clean</span>
                      )}
                    </td>
                    <td className="muted">{new Date(a.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

// ==========================================
// 6. BONUS: TEACHER CLASS DASHBOARD
// ==========================================

function TeacherDashboard({ user, t, setError }) {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [aiFlags, setAiFlags] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [newClassSubject, setNewClassSubject] = useState('Foundational Math & Reading');
  const [correctionText, setCorrectionText] = useState({});

  useEffect(() => {
    loadClassrooms();
    loadAiFlags();
  }, []);

  async function loadClassrooms() {
    try {
      const res = await api('/teacher/classrooms');
      setClassrooms(res.classrooms);
      if (res.classrooms.length > 0) {
        loadClassDetails(res.classrooms[0].id);
      }
    } catch (e) {
      setError(e.message);
    }
  }

  async function loadClassDetails(id) {
    try {
      const res = await api(`/teacher/classrooms/${id}`);
      setSelectedClass(classrooms.find(c => c.id === Number(id)) || res);
      setStudents(res.students);
    } catch (e) {
      setError(e.message);
    }
  }

  async function loadAiFlags() {
    try {
      const res = await api('/teacher/ai-flags');
      setAiFlags(res.flags);
    } catch (e) {
      setError(e.message);
    }
  }

  async function createClass(e) {
    e.preventDefault();
    if (!newClassName.trim()) return;
    try {
      const res = await api('/teacher/classrooms', {
        method: 'POST',
        body: JSON.stringify({ name: newClassName, subject: newClassSubject })
      });
      setClassrooms([...classrooms, res.classroom]);
      setNewClassName('');
      loadClassDetails(res.classroom.id);
    } catch (e) {
      setError(e.message);
    }
  }

  async function resolveFlag(flagId) {
    try {
      await api(`/teacher/ai-flags/${flagId}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ teacherCorrection: correctionText[flagId] || 'Verified and approved by teacher.' })
      });
      loadAiFlags();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="page">
      <div className="page-header">
        <p className="eyebrow">BONUS FEATURE · TEACHER CLASS DASHBOARD</p>
        <h1>Educator Command Center</h1>
        <p className="muted">Manage student cohorts, track class gap heatmaps, and review AI explanations.</p>
      </div>

      <div className="teacher-grid">
        {/* Classrooms sidebar */}
        <section className="classrooms-panel">
          <div className="panel-title-row">
            <h3>My Classrooms</h3>
          </div>

          <div className="class-cards-list">
            {classrooms.map(c => (
              <div
                key={c.id}
                className={`class-card-item ${selectedClass?.id === c.id ? 'active' : ''}`}
                onClick={() => loadClassDetails(c.id)}
              >
                <b>{c.name}</b>
                <span className="join-code">Code: <code>{c.code}</code></span>
                <small>{c.subject}</small>
              </div>
            ))}
          </div>

          <form onSubmit={createClass} className="create-class-form">
            <h4>+ Create New Classroom</h4>
            <input
              placeholder="e.g. Grade 7 Math Section B"
              value={newClassName}
              onChange={e => setNewClassName(e.target.value)}
              required
            />
            <button className="primary full" type="submit">Create Class</button>
          </form>
        </section>

        {/* Selected Class Roster & Gap Radar */}
        <section className="roster-panel">
          <div className="roster-header">
            <div>
              <h2>{selectedClass?.name || 'Classroom Overview'}</h2>
              <p className="code-instruction">Share join code <b>{selectedClass?.code}</b> with students to enroll.</p>
            </div>
            <span className="student-count-badge">{students.length} Enrolled</span>
          </div>

          {/* Student gap radar table */}
          <h3>Student Gap Diagnostic Roster</h3>
          {students.length === 0 ? (
            <div className="empty-state">No students have joined this classroom code yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="roster-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Average Score</th>
                    <th>Detected Cognitive Gaps</th>
                    <th>Intervention Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>
                        <b>{s.name}</b>
                        <br />
                        <small className="muted">{s.email}</small>
                      </td>
                      <td>
                        <span className={`pill-score ${s.averageScore >= 70 ? 'good' : 'warning'}`}>
                          {s.averageScore !== null ? `${s.averageScore}%` : 'No data'}
                        </span>
                      </td>
                      <td>
                        {s.detectedGaps?.length > 0 ? (
                          s.detectedGaps.map(g => <span key={g} className="small-gap-tag">{g.replace(/_/g, ' ')}</span>)
                        ) : (
                          <span className="clean-tag">✓ Strong</span>
                        )}
                      </td>
                      <td>
                        {s.needsIntervention ? (
                          <span className="alert-pill">⚠️ {t.strugglingAlert}</span>
                        ) : (
                          <span className="ok-pill">On Track</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* AI Explanation Review Queue (Mandatory Feature 6) */}
          <div className="ai-review-queue-card">
            <h3>🛡️ Safe & Responsible AI: Explanation Review Queue</h3>
            <p className="card-sub">Review explanations flagged by students or parents for ambiguity:</p>

            {aiFlags.filter(f => f.status === 'pending').length === 0 ? (
              <div className="empty-state">✓ All AI explanations are verified. No pending flags.</div>
            ) : (
              aiFlags.filter(f => f.status === 'pending').map(flag => (
                <div key={flag.id} className="flag-review-item">
                  <div className="flag-meta">
                    <b>Question ID: {flag.question_id}</b>
                    <span className="flag-reason">Reported issue: "{flag.feedback_reason}"</span>
                  </div>
                  <blockquote className="ai-quote">{flag.ai_explanation}</blockquote>
                  <div className="correction-input-row">
                    <input
                      placeholder="Enter teacher correction or leave empty to approve..."
                      value={correctionText[flag.id] || ''}
                      onChange={e => setCorrectionText({ ...correctionText, [flag.id]: e.target.value })}
                    />
                    <button className="primary" onClick={() => resolveFlag(flag.id)}>Verify & Resolve</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

// ==========================================
// 7. PARENT DASHBOARD (Child Progress & Support)
// ==========================================

function ParentDashboard({ user, t, setError }) {
  const [data, setData] = useState(null);
  const [linkEmail, setLinkEmail] = useState('');
  const [linkMsg, setLinkMsg] = useState('');

  useEffect(() => {
    loadChild();
  }, []);

  async function loadChild() {
    try {
      const res = await api('/parent/child');
      setData(res);
    } catch (e) {
      setError(e.message);
    }
  }

  async function linkChild(e) {
    e.preventDefault();
    if (!linkEmail.trim()) return;
    try {
      const res = await api('/parent/link-student', {
        method: 'POST',
        body: JSON.stringify({ studentEmail: linkEmail })
      });
      setLinkMsg(`✓ Linked successfully with ${res.student.name}!`);
      loadChild();
    } catch (e) {
      setError(e.message);
    }
  }

  if (!data) return <div className="loading"><div className="spinner"></div><p>Loading family portal…</p></div>;

  return (
    <main className="page">
      <div className="page-header">
        <p className="eyebrow">FAMILY LEARNING PARTNERSHIP</p>
        <h1>Parent & Guardian Overview</h1>
        <p className="muted">Understand your child's learning journey without confusing educational jargon.</p>
      </div>

      {!data.linked ? (
        <section className="link-child-card">
          <h3>Link to Your Child's Student Account</h3>
          <p>Enter the email address your child used to sign up for LearnX:</p>
          <form onSubmit={linkChild} className="link-form">
            <input
              type="email"
              placeholder="student@learnx.org"
              value={linkEmail}
              onChange={e => setLinkEmail(e.target.value)}
              required
            />
            <button className="primary" type="submit">Link Account</button>
          </form>
          {linkMsg && <p className="success-msg">{linkMsg}</p>}
        </section>
      ) : (
        <div className="parent-grid">
          {/* Child profile card */}
          <section className="child-card">
            <span className="card-kicker">LINKED LEARNER</span>
            <h2>{data.student.name}</h2>
            <p className="student-grade">{data.student.grade_level || 'Grade 7'}</p>

            <div className="parent-advice-bubble">
              <span className="bubble-icon">💡</span>
              <div>
                <b>How you can support at home:</b>
                <p>{data.parentGuidance}</p>
              </div>
            </div>

            {/* Topic Mastery Summary for Parents */}
            <h4>Subject Foundations</h4>
            <div className="parent-topics-list">
              {data.summary.map(s => (
                <div key={s.topic} className="parent-topic-row">
                  <span>{s.topic}</span>
                  <b>{s.percent}%</b>
                </div>
              ))}
            </div>
          </section>

          {/* Child's Study Plan Status */}
          <section className="child-schedule-status">
            <h3>Active Study Habit</h3>
            {data.activePlan ? (
              <div className="parent-plan-view">
                <b>Currently Practicing: {data.activePlan.topic}</b>
                <p>Root focus: {data.activePlan.root_cause}</p>
                <div className="habit-stat">
                  <span className="stat-number">{data.activePlan.daily_minutes}</span>
                  <small>Minutes committed today</small>
                </div>
              </div>
            ) : (
              <p className="muted">Your child has not scheduled a daily practice block for today yet.</p>
            )}

            <h3>Recent Sessions</h3>
            <div className="recent-list">
              {data.recentPractices.map(p => (
                <div key={p.id} className="recent-item">
                  <span>{p.topic}</span>
                  <b>{p.score} / {p.total} correct</b>
                  <small className="muted">{new Date(p.created_at).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

// ==========================================
// 8. ADMIN & INSTITUTIONAL DASHBOARD
// ==========================================

function AdminDashboard({ user, t, setError }) {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    api('/admin/overview')
      .then(setOverview)
      .catch(e => setError(e.message));
  }, []);

  if (!overview) return <div className="loading"><div className="spinner"></div><p>Fetching institutional analytics…</p></div>;

  return (
    <main className="page">
      <div className="page-header">
        <p className="eyebrow">INSTITUTIONAL GOVERNANCE</p>
        <h1>Schools & Colleges Administration</h1>
        <p className="muted">Real-time platform metrics, role distribution, and immutable audit logging.</p>
      </div>

      {/* Metrics Row */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <small>Total Learners & Educators</small>
          <h2>{overview.metrics.totalUsers}</h2>
        </div>
        <div className="admin-stat-card">
          <small>Total Practice Sets Completed</small>
          <h2>{overview.metrics.totalAttempts}</h2>
        </div>
        <div className="admin-stat-card">
          <small>Active School Classrooms</small>
          <h2>{overview.metrics.totalClassrooms}</h2>
        </div>
      </div>

      {/* Role Breakdown */}
      <section className="role-distribution-card">
        <h3>User Distribution</h3>
        <div className="role-bars">
          <div className="role-item">🎓 Students: <b>{overview.roleDistribution.students}</b></div>
          <div className="role-item">👩‍🏫 Teachers: <b>{overview.roleDistribution.teachers}</b></div>
          <div className="role-item">👨‍👩‍👧 Parents: <b>{overview.roleDistribution.parents}</b></div>
          <div className="role-item">🏛️ Admins: <b>{overview.roleDistribution.admins}</b></div>
        </div>
      </section>

      {/* Audit Logs */}
      <section className="audit-card">
        <h3>Auditable Activity Log (Security & Privacy Compliance)</h3>
        <div className="table-responsive">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User ID</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {overview.auditLogs.map(log => (
                <tr key={log.id}>
                  <td className="muted">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td>User #{log.user_id}</td>
                  <td><code>{log.action}</code></td>
                  <td className="small-text">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

// ==========================================
// 9. MODALS: EDUTECH SPEC & DATA PRIVACY
// ==========================================

function EduTechSpecModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card spec-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-top">
          <div>
            <span className="spec-badge">DOMAIN 2 OF 4 · EDUTECH</span>
            <h2>Smart, Inclusive & Personalized Education</h2>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="spec-section">
            <h4>THE PROBLEM</h4>
            <p>Students learn at different speeds, face language barriers and get little personal guidance.</p>
            <h4>BUILD FOR</h4>
            <p>Students, Teachers, Parents, Schools & Colleges.</p>
          </div>

          <h4>6 MANDATORY FEATURES IMPLEMENTATION STATUS</h4>
          <div className="features-status-grid">
            <div className="feature-status-box">
              <span className="num">1</span>
              <div>
                <b>Problem & Users</b>
                <p>Addresses foundational math & language misconceptions. Built with 4 distinct user roles: Student, Teacher, Parent, Admin.</p>
              </div>
            </div>
            <div className="feature-status-box">
              <span className="num">2</span>
              <div>
                <b>Core Challenge (Gap Finder)</b>
                <p>Live Prerequisite Knowledge Tree traces wrong answers to root causes. Smart scheduler distributes study blocks strictly within free hours.</p>
              </div>
            </div>
            <div className="feature-status-box">
              <span className="num">3</span>
              <div>
                <b>Easy to Use & Inclusive</b>
                <p>Responsive mobile UI, full translations in English, Hindi, and Kannada, plus Audio Read-Aloud (TTS) for accessibility.</p>
              </div>
            </div>
            <div className="feature-status-box">
              <span className="num">4</span>
              <div>
                <b>Data & Privacy Protection</b>
                <p>Rigorous input sanitization, strict RBAC isolation (students see only their data), data export & delete account controls.</p>
              </div>
            </div>
            <div className="feature-status-box">
              <span className="num">5</span>
              <div>
                <b>Track Progress</b>
                <p>Visual SVG topic mastery charts, streak counters, XP points, earned badges, and auditable attempt logs.</p>
              </div>
            </div>
            <div className="feature-status-box">
              <span className="num">6</span>
              <div>
                <b>Safe & Responsible AI</b>
                <p>Curriculum-verified explanations, educator-verified badges, and an AI Review Queue where teachers inspect and correct flagged items.</p>
              </div>
            </div>
          </div>

          <h4>BONUS FEATURES INCLUDED</h4>
          <div className="bonus-status-list">
            <span>✨ Auto-Made Practice Questions</span>
            <span>🏫 Teacher Class Dashboard</span>
            <span>🌐 Local-Language Content</span>
            <span>📊 Interactive SVG Progress Charts</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="primary" onClick={onClose}>Close Spec Inspector</button>
        </div>
      </div>
    </div>
  );
}

function DataPrivacyModal({ user, onClose, setError }) {
  async function downloadData() {
    window.open('/api/privacy/export', '_blank');
  }

  async function deleteAccount() {
    if (!window.confirm('Are you absolutely sure you want to delete your account? All learning history will be permanently erased.')) {
      return;
    }
    try {
      await api('/privacy/delete-account', { method: 'DELETE' });
      window.location.href = '/';
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card privacy-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-top">
          <div>
            <span className="spec-badge">MANDATORY FEATURE 4 · PRIVACY</span>
            <h2>Data & Privacy Center</h2>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="privacy-intro">
            LearnX adheres to strict privacy-by-design standards. You maintain 100% ownership of your learning data.
          </p>

          <div className="privacy-promises">
            <div>🔒 <b>Role-Based Isolation:</b> Students, teachers, and admins see only their own data.</div>
            <div>🛡️ <b>Zero Third-Party Trackers:</b> No advertising cookies or analytics telemetry.</div>
            <div>🔑 <b>Encrypted Credentials:</b> Passwords securely salted and hashed via bcrypt.</div>
          </div>

          <div className="privacy-actions-block">
            <h4>Your Data Rights</h4>
            <button className="secondary-button full-btn" onClick={downloadData}>
              📥 Download / Export Complete Learning Record (JSON)
            </button>
            <button className="danger-button full-btn" onClick={deleteAccount}>
              🗑️ Delete My Account & Purge All History
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
