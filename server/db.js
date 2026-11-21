import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(here, 'data');
fs.mkdirSync(dataDir, { recursive: true });
const dbFile = path.join(dataDir, 'learnx.json');

// In-memory data store with file persistence
let store = {
  users: [],
  classrooms: [],
  enrollments: [],
  attempts: [],
  study_plans: [],
  ai_review_flags: [],
  audit_logs: [],
  custom_questions: [],
  counters: {
    users: 0,
    classrooms: 0,
    enrollments: 0,
    attempts: 0,
    study_plans: 0,
    ai_review_flags: 0,
    audit_logs: 0,
    custom_questions: 0,
  }
};

function saveStore() {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save database file:', err);
  }
}

function loadStore() {
  if (fs.existsSync(dbFile)) {
    try {
      const data = fs.readFileSync(dbFile, 'utf8');
      store = { ...store, ...JSON.parse(data) };
    } catch (err) {
      console.error('Failed to load database file, creating fresh store:', err);
    }
  }
}

loadStore();

// Seed initial demo users and classrooms if empty
async function seedInitialData() {
  if (store.users.length === 0) {
    const studentPass = await bcrypt.hash('student123', 10);
    const teacherPass = await bcrypt.hash('teacher123', 10);
    const parentPass = await bcrypt.hash('parent123', 10);
    const adminPass = await bcrypt.hash('admin123', 10);

    const studentUser = {
      id: 1,
      name: 'Asha Rao',
      email: 'student@learnx.org',
      password_hash: studentPass,
      role: 'student',
      language: 'en',
      grade_level: 'Grade 7',
      created_at: new Date().toISOString()
    };

    const teacherUser = {
      id: 2,
      name: 'Prof. Ananya Sharma',
      email: 'teacher@learnx.org',
      password_hash: teacherPass,
      role: 'teacher',
      language: 'en',
      grade_level: 'Grade 7 & 8',
      created_at: new Date().toISOString()
    };

    const parentUser = {
      id: 3,
      name: 'Kiran Rao (Parent)',
      email: 'parent@learnx.org',
      password_hash: parentPass,
      role: 'parent',
      language: 'en',
      linked_student_id: 1,
      created_at: new Date().toISOString()
    };

    const adminUser = {
      id: 4,
      name: 'Dr. Ramesh Kumar (Admin)',
      email: 'admin@learnx.org',
      password_hash: adminPass,
      role: 'admin',
      language: 'en',
      created_at: new Date().toISOString()
    };

    store.users = [studentUser, teacherUser, parentUser, adminUser];
    store.counters.users = 4;

    // Seed teacher classroom
    const classroom = {
      id: 1,
      code: 'MATH7A',
      name: 'Grade 7 Math & Reading Section A',
      teacher_id: 2,
      subject: 'Foundational Math & Language',
      created_at: new Date().toISOString()
    };
    store.classrooms = [classroom];
    store.counters.classrooms = 1;

    // Enroll student in classroom
    store.enrollments = [{
      id: 1,
      classroom_id: 1,
      student_id: 1,
      joined_at: new Date().toISOString()
    }];
    store.counters.enrollments = 1;

    // Seed some initial practice attempts for student to show progress charts immediately
    store.attempts = [
      {
        id: 1,
        user_id: 1,
        topic: 'Fractions',
        score: 2,
        total: 3,
        root_causes_detected: ['LCM_DENOMINATOR_MISCONCEPTION'],
        created_at: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 2,
        user_id: 1,
        topic: 'Basic algebra',
        score: 1,
        total: 3,
        root_causes_detected: ['INVERSE_OPERATIONS_ORDER'],
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 3,
        user_id: 1,
        topic: 'Reading comprehension',
        score: 3,
        total: 3,
        root_causes_detected: [],
        created_at: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        id: 4,
        user_id: 1,
        topic: 'Fractions',
        score: 3,
        total: 3,
        root_causes_detected: [],
        created_at: new Date().toISOString()
      }
    ];
    store.counters.attempts = 4;

    // Seed sample study plan
    store.study_plans = [
      {
        id: 1,
        user_id: 1,
        topic: 'Basic algebra',
        root_cause: 'Inverse Operations & Sign Rules',
        daily_minutes: 30,
        schedule_json: JSON.stringify([
          { time: '10 min', phase: 'Concept Drill', task: 'Review: Isolating variables using opposite operations (+ to -, × to ÷)' },
          { time: '12 min', phase: 'Guided Practice', task: 'Solve 4 one-step & two-step equations with step-by-step checks' },
          { time: '8 min', phase: 'Check-in Quiz', task: 'Take a quick 3-question mastery check' }
        ]),
        completed_blocks: [0],
        created_at: new Date().toISOString()
      }
    ];
    store.counters.study_plans = 1;

    saveStore();
    console.log('LearnX database pre-seeded with demo accounts and sample data.');
  }
}

seedInitialData();

// SQL compatibility layer and store methods
export const db = {
  store,
  saveStore,

  // Direct helper methods for safety and performance
  getUserById(id) {
    return store.users.find(u => u.id === Number(id));
  },
  getUserByEmail(email) {
    return store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  createUser(userData) {
    store.counters.users += 1;
    const user = {
      id: store.counters.users,
      role: 'student',
      language: 'en',
      grade_level: 'Grade 7',
      created_at: new Date().toISOString(),
      ...userData
    };
    store.users.push(user);
    saveStore();
    return user;
  },
  updateUser(id, updates) {
    const user = this.getUserById(id);
    if (!user) return null;
    Object.assign(user, updates);
    saveStore();
    return user;
  },
  deleteUser(id) {
    store.users = store.users.filter(u => u.id !== Number(id));
    store.attempts = store.attempts.filter(a => a.user_id !== Number(id));
    store.study_plans = store.study_plans.filter(p => p.user_id !== Number(id));
    store.enrollments = store.enrollments.filter(e => e.student_id !== Number(id));
    saveStore();
    return true;
  },

  // Attempts
  createAttempt(data) {
    store.counters.attempts += 1;
    const attempt = {
      id: store.counters.attempts,
      created_at: new Date().toISOString(),
      ...data
    };
    store.attempts.push(attempt);
    saveStore();
    return attempt;
  },
  getAttemptsByUserId(userId, limit = 50) {
    return store.attempts
      .filter(a => a.user_id === Number(userId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  },
  getTopicSummary(userId) {
    const attempts = store.attempts.filter(a => a.user_id === Number(userId));
    const grouped = {};
    for (const a of attempts) {
      if (!grouped[a.topic]) {
        grouped[a.topic] = { topic: a.topic, totalScore: 0, totalMax: 0, tries: 0 };
      }
      grouped[a.topic].totalScore += a.score;
      grouped[a.topic].totalMax += a.total;
      grouped[a.topic].tries += 1;
    }
    return Object.values(grouped).map(g => ({
      topic: g.topic,
      percent: Math.round((g.totalScore / g.totalMax) * 100),
      tries: g.tries
    }));
  },

  // Classrooms
  createClassroom(teacherId, name, subject = 'General') {
    store.counters.classrooms += 1;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const classroom = {
      id: store.counters.classrooms,
      teacher_id: Number(teacherId),
      code,
      name,
      subject,
      created_at: new Date().toISOString()
    };
    store.classrooms.push(classroom);
    saveStore();
    return classroom;
  },
  getClassroomsByTeacher(teacherId) {
    return store.classrooms.filter(c => c.teacher_id === Number(teacherId));
  },
  getClassroomByCode(code) {
    return store.classrooms.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
  },
  enrollStudent(studentId, classroomId) {
    const exists = store.enrollments.find(e => e.student_id === Number(studentId) && e.classroom_id === Number(classroomId));
    if (exists) return exists;
    store.counters.enrollments += 1;
    const enrollment = {
      id: store.counters.enrollments,
      student_id: Number(studentId),
      classroom_id: Number(classroomId),
      joined_at: new Date().toISOString()
    };
    store.enrollments.push(enrollment);
    saveStore();
    return enrollment;
  },
  getStudentsInClassroom(classroomId) {
    const studentIds = store.enrollments
      .filter(e => e.classroom_id === Number(classroomId))
      .map(e => e.student_id);
    return store.users.filter(u => studentIds.includes(u.id));
  },

  // Study plans
  createStudyPlan(data) {
    store.counters.study_plans += 1;
    const plan = {
      id: store.counters.study_plans,
      created_at: new Date().toISOString(),
      completed_blocks: [],
      ...data
    };
    store.study_plans.push(plan);
    saveStore();
    return plan;
  },
  getStudyPlansByUserId(userId) {
    return store.study_plans
      .filter(p => p.user_id === Number(userId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  toggleStudyBlock(planId, blockIndex) {
    const plan = store.study_plans.find(p => p.id === Number(planId));
    if (!plan) return null;
    let completed = Array.isArray(plan.completed_blocks) ? [...plan.completed_blocks] : [];
    if (completed.includes(blockIndex)) {
      completed = completed.filter(i => i !== blockIndex);
    } else {
      completed.push(blockIndex);
    }
    plan.completed_blocks = completed;
    saveStore();
    return plan;
  },

  // AI Review Flags
  createAiFlag(data) {
    store.counters.ai_review_flags += 1;
    const flag = {
      id: store.counters.ai_review_flags,
      status: 'pending',
      created_at: new Date().toISOString(),
      ...data
    };
    store.ai_review_flags.push(flag);
    saveStore();
    return flag;
  },
  getAiFlags() {
    return store.ai_review_flags.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  resolveAiFlag(flagId, teacherCorrection) {
    const flag = store.ai_review_flags.find(f => f.id === Number(flagId));
    if (!flag) return null;
    flag.status = 'reviewed';
    flag.teacher_correction = teacherCorrection;
    saveStore();
    return flag;
  },

  // Audit Logs
  logAudit(userId, action, details) {
    store.counters.audit_logs += 1;
    const log = {
      id: store.counters.audit_logs,
      user_id: userId,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    store.audit_logs.push(log);
    saveStore();
    return log;
  },
  getAuditLogs(limit = 100) {
    return store.audit_logs.slice(-limit).reverse();
  },

  // SQLite .prepare() compatible wrapper for standard queries
  prepare(sql) {
    const cleanSql = sql.trim().replace(/\s+/g, ' ');

    return {
      get: (...params) => {
        // SELECT id, name, email, language FROM users WHERE id = ?
        if (cleanSql.includes('FROM users WHERE id = ?')) {
          const u = db.getUserById(params[0]);
          return u ? { id: u.id, name: u.name, email: u.email, role: u.role, language: u.language, grade_level: u.grade_level, linked_student_id: u.linked_student_id } : undefined;
        }
        // SELECT * FROM users WHERE email = ?
        if (cleanSql.includes('FROM users WHERE email = ?')) {
          return db.getUserByEmail(params[0]);
        }
        return undefined;
      },

      all: (...params) => {
        // SELECT id, topic, score, total, created_at AS createdAt FROM attempts WHERE user_id = ?
        if (cleanSql.includes('FROM attempts WHERE user_id = ?')) {
          return db.getAttemptsByUserId(params[0]).map(a => ({
            id: a.id,
            topic: a.topic,
            score: a.score,
            total: a.total,
            createdAt: a.created_at,
            rootCauses: a.root_causes_detected || []
          }));
        }
        // SELECT topic, ROUND(AVG(100.0 * score / total)) AS percent, COUNT(*) AS tries FROM attempts WHERE user_id = ? GROUP BY topic
        if (cleanSql.includes('GROUP BY topic')) {
          return db.getTopicSummary(params[0]);
        }
        return [];
      },

      run: (...params) => {
        // INSERT INTO users
        if (cleanSql.includes('INSERT INTO users')) {
          const user = db.createUser({
            name: params[0],
            email: params[1],
            password_hash: params[2],
            role: params[3] || 'student'
          });
          return { lastInsertRowid: user.id };
        }
        // INSERT INTO attempts
        if (cleanSql.includes('INSERT INTO attempts')) {
          const attempt = db.createAttempt({
            user_id: params[0],
            topic: params[1],
            score: params[2],
            total: params[3],
            root_causes_detected: params[4] || []
          });
          return { lastInsertRowid: attempt.id };
        }
        // UPDATE users SET language = ? WHERE id = ?
        if (cleanSql.includes('UPDATE users SET language = ? WHERE id = ?')) {
          db.updateUser(params[1], { language: params[0] });
          return { changes: 1 };
        }
        return { changes: 0 };
      }
    };
  },

  exec(_sql) {
    // Pure JS store doesn't need DDL execution, but keep for compatibility
    return true;
  },

  pragma(_stmt) {
    return true;
  }
};

export default db;
