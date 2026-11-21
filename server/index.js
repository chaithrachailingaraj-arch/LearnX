import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import db from './db.js';
import { questionBank, rootCauseKnowledgeGraph, generateAutoPracticeQuestion } from './questions.js';

const app = express();
const port = Number(process.env.PORT || 3001);
const isProduction = process.env.NODE_ENV === 'production';

// Strict body parsing limits to avoid Denial of Service
app.use(express.json({ limit: '30kb' }));

app.use(session({
  name: 'learnx.sid',
  secret: process.env.SESSION_SECRET || 'learnx-secure-edutech-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  },
}));

// Safe public user projection
function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'student',
    language: user.language || 'en',
    grade_level: user.grade_level || 'Grade 7',
    linked_student_id: user.linked_student_id || null,
    created_at: user.created_at
  };
}

// Authentication & RBAC Middleware
function requireUser(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Please sign in to access your learning space.' });
  }
  const user = db.getUserById(req.session.userId);
  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({ error: 'Session expired or user not found. Please sign in again.' });
  }
  req.user = user;
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access restricted to ${roles.join(', ')} accounts.` });
    }
    next();
  };
}

// Audit logging helper
function logUserAction(userId, action, details) {
  try {
    db.logAudit(userId, action, typeof details === 'string' ? details : JSON.stringify(details));
  } catch (err) {
    console.error('Audit log failure:', err);
  }
}

// ==========================================
// 1. AUTHENTICATION & MULTI-USER ROLES
// ==========================================

app.post('/api/auth/register', async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const role = ['student', 'teacher', 'parent', 'admin'].includes(req.body.role) ? req.body.role : 'student';
  const language = ['en', 'hi', 'kn', 'te', 'ta'].includes(req.body.language) ? req.body.language : 'en';

  // Input Validation
  if (name.length < 2 || name.length > 70) {
    return res.status(400).json({ error: 'Name must be between 2 and 70 characters.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (password.length < 8 || password.length > 100) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = db.createUser({
      name,
      email,
      password_hash: passwordHash,
      role,
      language,
      grade_level: req.body.grade_level || 'Grade 7'
    });

    req.session.userId = user.id;
    logUserAction(user.id, 'USER_REGISTERED', { role, email });
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide both email and password.' });
  }

  const user = db.getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  req.session.userId = user.id;
  logUserAction(user.id, 'USER_LOGIN', { role: user.role });
  res.json({ user: publicUser(user) });
});

// Demo Fast Switcher (Allows user to test all 4 roles instantly!)
app.post('/api/auth/demo-switch', (req, res) => {
  const targetRole = String(req.body.role || 'student').toLowerCase();
  const demoUser = db.store.users.find(u => u.role === targetRole);
  if (!demoUser) {
    return res.status(404).json({ error: `Demo account for role ${targetRole} not found.` });
  }
  req.session.userId = demoUser.id;
  logUserAction(demoUser.id, 'DEMO_SWITCH', { role: targetRole });
  res.json({ user: publicUser(demoUser) });
});

app.post('/api/auth/logout', (req, res) => {
  if (req.session.userId) {
    logUserAction(req.session.userId, 'USER_LOGOUT', {});
  }
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/auth/me', requireUser, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.put('/api/profile/language', requireUser, (req, res) => {
  const language = ['en', 'hi', 'kn', 'te', 'ta'].includes(req.body.language) ? req.body.language : null;
  if (!language) return res.status(400).json({ error: 'Unsupported language selected.' });
  
  db.updateUser(req.user.id, { language });
  logUserAction(req.user.id, 'CHANGE_LANGUAGE', { language });
  res.json({ user: publicUser(db.getUserById(req.user.id)) });
});

// Link child to parent
app.post('/api/parent/link-student', requireUser, requireRole('parent'), (req, res) => {
  const studentEmail = String(req.body.studentEmail || '').trim().toLowerCase();
  const student = db.getUserByEmail(studentEmail);
  if (!student || student.role !== 'student') {
    return res.status(404).json({ error: 'No student found with that email address.' });
  }
  db.updateUser(req.user.id, { linked_student_id: student.id });
  logUserAction(req.user.id, 'LINKED_STUDENT', { studentId: student.id });
  res.json({ success: true, student: publicUser(student) });
});

// ==========================================
// 2. CORE CHALLENGE: GAP FINDER & DIAGNOSTICS
// ==========================================

const topicsList = Object.keys(questionBank);

app.get('/api/topics', requireUser, (_req, res) => {
  const metadata = topicsList.map(name => ({
    name,
    questionCount: questionBank[name].length,
    subtopics: [...new Set(questionBank[name].map(q => q.subtopic))]
  }));
  res.json({ topics: topicsList, metadata });
});

// Get quiz questions (Local language & Difficulty level)
app.get('/api/quiz/:topic', requireUser, (req, res) => {
  const topic = req.params.topic;
  const questions = questionBank[topic];
  if (!questions) return res.status(404).json({ error: 'Topic not found.' });

  const lang = ['hi', 'kn'].includes(req.query.lang) ? req.query.lang : (req.user.language || 'en');
  const level = req.query.level; // foundational, standard, advanced

  let filtered = questions;
  if (level) {
    const byLevel = questions.filter(q => q.difficulty === level);
    if (byLevel.length > 0) filtered = byLevel;
  }

  // Security: Do NOT expose answer keys or misconception maps before submission!
  const sanitized = filtered.map(q => {
    const t = q.translations[lang] || q.translations.en;
    return {
      id: q.id,
      difficulty: q.difficulty,
      subtopic: q.subtopic,
      question: t.question,
      choices: t.choices
    };
  });

  res.json({ topic, questions: sanitized, lang });
});

// Submit practice & Run Root-Cause Diagnosis
app.post('/api/quiz/:topic/submit', requireUser, (req, res) => {
  const topic = req.params.topic;
  const fullQuestions = questionBank[topic];
  const { answers, questionIds } = req.body;

  if (!fullQuestions) return res.status(404).json({ error: 'Topic not found.' });
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Answers must be provided as an array.' });
  }

  // Map answers to the specific questions submitted
  const activeQuestions = questionIds
    ? questionIds.map(id => fullQuestions.find(q => q.id === id) || fullQuestions[0])
    : fullQuestions.slice(0, answers.length);

  const lang = req.user.language || 'en';
  const tKey = ['hi', 'kn'].includes(lang) ? lang : 'en';

  let score = 0;
  const detectedRootCauses = new Set();
  const feedback = [];

  activeQuestions.forEach((q, index) => {
    const studentChoice = answers[index];
    const isCorrect = studentChoice === q.answer;
    const t = q.translations[tKey] || q.translations.en;

    if (isCorrect) {
      score += 1;
    } else {
      // Diagnostic check: check misconception taxonomy
      const misconceptionKey = q.misconceptionMap?.[studentChoice] || q.rootCause;
      if (misconceptionKey) {
        detectedRootCauses.add(misconceptionKey);
      }
    }

    feedback.push({
      questionId: q.id,
      correct: isCorrect,
      selectedChoice: studentChoice,
      correctChoice: q.answer,
      explanation: t.explain,
      rootCauseNote: !isCorrect ? t.rootCauseNote : null,
      subtopic: q.subtopic,
      educatorVerified: true
    });
  });

  const rootCausesArray = Array.from(detectedRootCauses);

  // Save attempt to database
  const attempt = db.createAttempt({
    user_id: req.user.id,
    topic,
    score,
    total: activeQuestions.length,
    root_causes_detected: rootCausesArray
  });

  logUserAction(req.user.id, 'SUBMIT_PRACTICE', { topic, score, total: activeQuestions.length, rootCauses: rootCausesArray });

  // Compile Root-Cause Remediation Advice
  const diagnosedGaps = rootCausesArray.map(rcKey => ({
    key: rcKey,
    details: rootCauseKnowledgeGraph[rcKey] || {
      topic,
      title: rcKey.replace(/_/g, ' '),
      description: 'Foundational concept needing reinforcement.',
      prerequisite: 'Core fundamentals',
      actionSteps: ['Review step-by-step examples', 'Try scaffolded practice'],
      drillExample: 'Break problem into smaller sub-steps.'
    }
  }));

  res.json({
    attemptId: attempt.id,
    score,
    total: activeQuestions.length,
    percent: Math.round((score / activeQuestions.length) * 100),
    feedback,
    rootCausesDetected: rootCausesArray,
    diagnosedGaps
  });
});

// Comprehensive Gap Finder Analysis: traces student history to root causes
app.get('/api/gap-finder/analysis', requireUser, (req, res) => {
  const attempts = db.getAttemptsByUserId(req.user.id, 50);
  const topicSummary = db.getTopicSummary(req.user.id);

  // Collate all detected root causes
  const rootCauseFrequency = {};
  attempts.forEach(a => {
    if (Array.isArray(a.root_causes_detected)) {
      a.root_causes_detected.forEach(rc => {
        rootCauseFrequency[rc] = (rootCauseFrequency[rc] || 0) + 1;
      });
    }
  });

  // Build the Prerequisite Knowledge Graph node status
  const knowledgeTree = [
    {
      id: 'fractions-root',
      domain: 'Fractions',
      prerequisiteNode: 'Multiples & Common Factors (LCM)',
      status: rootCauseFrequency['LCM_DENOMINATOR_MISCONCEPTION'] > 0 ? 'gap_detected' : 'mastered',
      rootCauseKey: 'LCM_DENOMINATOR_MISCONCEPTION',
      title: 'Adding Unlike Denominators',
      advice: 'Always convert to common denominators before adding numerators.'
    },
    {
      id: 'algebra-root',
      domain: 'Basic algebra',
      prerequisiteNode: 'Algebraic Balancing & Inverse Operations',
      status: rootCauseFrequency['INVERSE_OPERATIONS_ORDER'] > 0 ? 'gap_detected' : 'in_progress',
      rootCauseKey: 'INVERSE_OPERATIONS_ORDER',
      title: 'Isolating Linear Variables',
      advice: 'Undo addition/subtraction first, then multiplication/division.'
    },
    {
      id: 'algebra-pemdas',
      domain: 'Basic algebra',
      prerequisiteNode: 'Order of Operations (PEMDAS)',
      status: rootCauseFrequency['ORDER_OF_OPERATIONS_PEMDAS'] > 0 ? 'gap_detected' : 'mastered',
      rootCauseKey: 'ORDER_OF_OPERATIONS_PEMDAS',
      title: 'Arithmetic Precedence',
      advice: 'Multiplication/Division precedes Addition/Subtraction.'
    },
    {
      id: 'reading-root',
      domain: 'Reading comprehension',
      prerequisiteNode: 'Paragraph Architecture & Main Idea vs Details',
      status: rootCauseFrequency['MAIN_VS_DETAIL_CONFUSION'] > 0 ? 'gap_detected' : 'mastered',
      rootCauseKey: 'MAIN_VS_DETAIL_CONFUSION',
      title: 'Synthesizing Central Theme',
      advice: 'Look for the unifying sentence that all supporting examples clarify.'
    },
    {
      id: 'science-root',
      domain: 'Science & Logic',
      prerequisiteNode: 'Experimental Control & Variable Types',
      status: rootCauseFrequency['VARIABLE_IDENTIFICATION_GAP'] > 0 ? 'gap_detected' : 'mastered',
      rootCauseKey: 'VARIABLE_IDENTIFICATION_GAP',
      title: 'Independent vs Dependent Variables',
      advice: 'The independent variable is what the scientist alters; dependent is measured.'
    }
  ];

  res.json({
    topics: topicSummary,
    totalAttempts: attempts.length,
    rootCauseFrequency,
    knowledgeTree,
    activeGapsCount: Object.keys(rootCauseFrequency).length
  });
});

// ==========================================
// 3. STUDY PLANNER AROUND FREE HOURS
// ==========================================

app.post('/api/study-plan/generate', requireUser, (req, res) => {
  const freeMinutes = Math.max(15, Math.min(180, Number(req.body.freeMinutes || 30)));
  const topic = String(req.body.topic || 'Fractions');
  const rootCauseKey = String(req.body.rootCauseKey || 'LCM_DENOMINATOR_MISCONCEPTION');

  const gapInfo = rootCauseKnowledgeGraph[rootCauseKey] || {
    title: topic,
    prerequisite: 'Core foundational rules',
    actionSteps: ['Review principles', 'Complete 5 practice drills'],
    drillExample: 'Step-by-step worked exercise'
  };

  // Generate micro-learning schedule blocks according to available time
  let blocks = [];
  if (freeMinutes <= 20) {
    blocks = [
      { time: '6 min', phase: 'Flash Rule Drill', task: `Review root cause rule: ${gapInfo.prerequisite} for ${topic}.` },
      { time: '10 min', phase: 'Targeted Practice', task: `Solve 3 focused questions targeting ${gapInfo.title}.` },
      { time: '4 min', phase: 'Confidence Review', task: `Self-check: Explain in your own words why common denominators/inverses matter.` }
    ];
  } else if (freeMinutes <= 45) {
    blocks = [
      { time: '10 min', phase: 'Root-Cause Conceptual Drill', task: `Examine worked example: ${gapInfo.drillExample}` },
      { time: '15 min', phase: 'Interactive Guided Practice', task: `Complete a 4-question diagnostic quiz in ${topic} with instant hints.` },
      { time: '12 min', phase: 'Independent Mastery Check', task: `Solve 2 challenge problems without hints to solidify understanding.` },
      { time: '8 min', phase: 'Progress Reflection', task: `Log completed blocks and review score trend.` }
    ];
  } else {
    // 60 min to 120+ min deep study plan
    const part1 = Math.round(freeMinutes * 0.25);
    const part2 = Math.round(freeMinutes * 0.40);
    const part3 = Math.round(freeMinutes * 0.25);
    const part4 = freeMinutes - (part1 + part2 + part3);

    blocks = [
      { time: `${part1} min`, phase: 'Foundational Review', task: `Deep dive into ${gapInfo.prerequisite}. Action step: ${gapInfo.actionSteps[0] || 'Understand the core rule'}.` },
      { time: `${part2} min`, phase: 'Active Diagnostic Practice', task: `Complete two 4-question practice sets in ${topic} across standard and advanced levels.` },
      { time: `${part3} min`, phase: 'Misconception Elimination', task: `Analyze any missed questions with AI explanations and educator-verified notes.` },
      { time: `${part4} min`, phase: 'Next-Level Challenge', task: `Generate an auto-made practice question and test your recall.` }
    ];
  }

  const studyPlan = db.createStudyPlan({
    user_id: req.user.id,
    topic,
    root_cause: gapInfo.title,
    daily_minutes: freeMinutes,
    schedule_json: JSON.stringify(blocks),
    completed_blocks: []
  });

  logUserAction(req.user.id, 'GENERATE_STUDY_PLAN', { topic, freeMinutes });
  res.status(201).json({ plan: studyPlan, blocks });
});

app.get('/api/study-plan', requireUser, (req, res) => {
  const plans = db.getStudyPlansByUserId(req.user.id);
  const activePlan = plans[0] || null;
  res.json({
    plans,
    activePlan: activePlan ? { ...activePlan, blocks: JSON.parse(activePlan.schedule_json || '[]') } : null
  });
});

app.post('/api/study-plan/:id/toggle-block', requireUser, (req, res) => {
  const planId = req.params.id;
  const blockIndex = Number(req.body.blockIndex);
  const updated = db.toggleStudyBlock(planId, blockIndex);
  if (!updated) return res.status(404).json({ error: 'Study plan not found.' });
  res.json({ plan: updated });
});

// ==========================================
// 4. PROGRESS TRACKING & CHARTS DATA
// ==========================================

app.get('/api/progress', requireUser, (req, res) => {
  const attempts = db.getAttemptsByUserId(req.user.id, 30);
  const summary = db.getTopicSummary(req.user.id);
  
  // Calculate learning streak and total points
  const totalScore = attempts.reduce((acc, a) => acc + a.score, 0);
  const totalPossible = attempts.reduce((acc, a) => acc + a.total, 0);
  const overallAccuracy = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

  // Badges earned
  const badges = [
    { id: 'first_quiz', name: 'Curious Learner', desc: 'Completed your first learning practice', unlocked: attempts.length >= 1 },
    { id: 'gap_finder', name: 'Gap Crusher', desc: 'Diagnosed and worked through a root cause', unlocked: attempts.length >= 3 },
    { id: 'perfectionist', name: 'Mastery Star', desc: 'Scored 100% on any practice set', unlocked: attempts.some(a => a.score === a.total) },
    { id: 'dedicated', name: 'Consistent Mind', desc: 'Completed 5+ learning sessions', unlocked: attempts.length >= 5 }
  ];

  res.json({
    attempts,
    summary,
    topics: topicsList,
    stats: {
      totalAttempts: attempts.length,
      overallAccuracy,
      xpPoints: totalScore * 50 + attempts.length * 20,
      streakDays: attempts.length > 0 ? Math.min(7, attempts.length) : 0
    },
    badges
  });
});

// ==========================================
// 5. BONUS: AUTO-MADE PRACTICE QUESTIONS (AI)
// ==========================================

app.post('/api/ai/generate-question', requireUser, (req, res) => {
  const { topic, difficulty, rootCause } = req.body;
  const lang = req.user.language || 'en';
  
  try {
    const question = generateAutoPracticeQuestion(topic || 'Fractions', difficulty || 'standard', lang);
    logUserAction(req.user.id, 'AI_GENERATE_QUESTION', { topic, difficulty });
    res.json({ question });
  } catch (err) {
    console.error('Question generation failed:', err);
    res.status(500).json({ error: 'Could not generate question at this moment.' });
  }
});

// ==========================================
// 6. SAFE & RESPONSIBLE AI: REVIEW & FLAGS
// ==========================================

app.post('/api/ai/flag-explanation', requireUser, (req, res) => {
  const { questionId, questionText, aiExplanation, reason } = req.body;
  if (!reason || String(reason).trim().length < 5) {
    return res.status(400).json({ error: 'Please describe why this explanation should be reviewed.' });
  }

  const flag = db.createAiFlag({
    user_id: req.user.id,
    question_id: String(questionId || 'unknown'),
    question_text: String(questionText || ''),
    ai_explanation: String(aiExplanation || ''),
    feedback_reason: String(reason).trim()
  });

  logUserAction(req.user.id, 'AI_FLAG_SUBMITTED', { flagId: flag.id, questionId });
  res.status(201).json({ success: true, message: 'Thank you! An educator will review this AI explanation.', flag });
});

app.get('/api/teacher/ai-flags', requireUser, requireRole('teacher', 'admin'), (_req, res) => {
  const flags = db.getAiFlags();
  res.json({ flags });
});

app.post('/api/teacher/ai-flags/:id/resolve', requireUser, requireRole('teacher', 'admin'), (req, res) => {
  const flagId = req.params.id;
  const { teacherCorrection } = req.body;
  const updated = db.resolveAiFlag(flagId, teacherCorrection || 'Reviewed and approved by educator.');
  if (!updated) return res.status(404).json({ error: 'Flag record not found.' });
  
  logUserAction(req.user.id, 'AI_FLAG_RESOLVED', { flagId });
  res.json({ success: true, flag: updated });
});

// ==========================================
// 7. BONUS: TEACHER CLASS DASHBOARD
// ==========================================

app.post('/api/teacher/classrooms', requireUser, requireRole('teacher', 'admin'), (req, res) => {
  const name = String(req.body.name || '').trim();
  const subject = String(req.body.subject || 'Foundational Skills').trim();
  if (name.length < 3) return res.status(400).json({ error: 'Classroom name must be at least 3 characters.' });

  const classroom = db.createClassroom(req.user.id, name, subject);
  logUserAction(req.user.id, 'CREATE_CLASSROOM', { classroomId: classroom.id, code: classroom.code });
  res.status(201).json({ classroom });
});

app.get('/api/teacher/classrooms', requireUser, requireRole('teacher', 'admin'), (req, res) => {
  const classrooms = db.getClassroomsByTeacher(req.user.id);
  res.json({ classrooms });
});

app.get('/api/teacher/classrooms/:id', requireUser, requireRole('teacher', 'admin'), (req, res) => {
  const classroomId = req.params.id;
  const students = db.getStudentsInClassroom(classroomId);

  // Collate aggregate student metrics for teacher
  const studentMetrics = students.map(s => {
    const attempts = db.getAttemptsByUserId(s.id, 20);
    const summary = db.getTopicSummary(s.id);
    const allRootCauses = attempts.flatMap(a => a.root_causes_detected || []);
    const avgScore = summary.length > 0 ? Math.round(summary.reduce((a, b) => a + b.percent, 0) / summary.length) : null;

    return {
      id: s.id,
      name: s.name,
      email: s.email,
      averageScore: avgScore,
      totalPractices: attempts.length,
      detectedGaps: [...new Set(allRootCauses)],
      needsIntervention: avgScore !== null && avgScore < 60
    };
  });

  res.json({ classroomId, students: studentMetrics });
});

// Student enrolls in class using code
app.post('/api/student/enroll', requireUser, requireRole('student'), (req, res) => {
  const code = String(req.body.code || '').trim().toUpperCase();
  const classroom = db.getClassroomByCode(code);
  if (!classroom) {
    return res.status(404).json({ error: 'Classroom code not found. Please check with your teacher.' });
  }

  const enrollment = db.enrollStudent(req.user.id, classroom.id);
  logUserAction(req.user.id, 'ENROLL_CLASSROOM', { classroomId: classroom.id });
  res.json({ success: true, classroom, enrollment });
});

// ==========================================
// 8. PARENT DASHBOARD & CHILD OVERVIEW
// ==========================================

app.get('/api/parent/child', requireUser, requireRole('parent'), (req, res) => {
  const childId = req.user.linked_student_id;
  if (!childId) {
    return res.json({ linked: false, message: 'No student currently linked to your parent account.' });
  }

  const student = db.getUserById(childId);
  if (!student) {
    return res.status(404).json({ linked: false, error: 'Linked student profile not found.' });
  }

  const attempts = db.getAttemptsByUserId(student.id, 20);
  const summary = db.getTopicSummary(student.id);
  const plans = db.getStudyPlansByUserId(student.id);

  // Simplified parent insights
  const weakTopics = summary.filter(s => s.percent < 70).map(s => s.topic);
  const parentGuidance = weakTopics.length > 0
    ? `Your child is currently strengthening ${weakTopics.join(' and ')}. A 15-minute home review together will boost their confidence.`
    : `Your child is progressing well across foundational subjects! Encourage daily 15-minute practice consistency.`;

  res.json({
    linked: true,
    student: publicUser(student),
    summary,
    recentPractices: attempts.slice(0, 5),
    activePlan: plans[0] || null,
    parentGuidance
  });
});

// ==========================================
// 9. ADMIN & DATA PRIVACY / COMPLIANCE
// ==========================================

app.get('/api/admin/overview', requireUser, requireRole('admin'), (_req, res) => {
  const totalUsers = db.store.users.length;
  const totalAttempts = db.store.attempts.length;
  const totalClassrooms = db.store.classrooms.length;
  const auditLogs = db.getAuditLogs(25);

  const roleDistribution = {
    students: db.store.users.filter(u => u.role === 'student').length,
    teachers: db.store.users.filter(u => u.role === 'teacher').length,
    parents: db.store.users.filter(u => u.role === 'parent').length,
    admins: db.store.users.filter(u => u.role === 'admin').length
  };

  res.json({
    metrics: { totalUsers, totalAttempts, totalClassrooms },
    roleDistribution,
    auditLogs
  });
});

// GDPR / Data Privacy: Export all user data
app.get('/api/privacy/export', requireUser, (req, res) => {
  const user = req.user;
  const attempts = db.getAttemptsByUserId(user.id, 500);
  const plans = db.getStudyPlansByUserId(user.id);

  logUserAction(user.id, 'DATA_EXPORT_REQUESTED', {});
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="learnx-data-${user.id}.json"`);
  res.json({
    exportedAt: new Date().toISOString(),
    profile: publicUser(user),
    learningAttempts: attempts,
    studyPlans: plans,
    privacyNotice: 'This document contains all your personal learning records stored on LearnX. You have full ownership of this data.'
  });
});

// GDPR / Data Privacy: Purge all user data
app.delete('/api/privacy/delete-account', requireUser, (req, res) => {
  const userId = req.user.id;
  logUserAction(userId, 'ACCOUNT_DELETED', {});
  db.deleteUser(userId);
  req.session.destroy(() => {
    res.json({ success: true, message: 'All your account records and learning history have been permanently deleted.' });
  });
});

// Centralized error handler
app.use((error, _req, res, _next) => {
  console.error('Unhandled server error:', error);
  res.status(500).json({ error: 'An unexpected error occurred. Our team has been alerted.' });
});

// Serve frontend in production
if (isProduction) {
  const path = await import('node:path');
  app.use(express.static(path.resolve('dist')));
  app.get('*', (_req, res) => res.sendFile(path.resolve('dist/index.html')));
}

app.listen(port, () => console.log(`🚀 LearnX EduTech API running smoothly at http://localhost:${port}`));
