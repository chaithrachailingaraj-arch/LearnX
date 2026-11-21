import { clientStore, clientQuestions } from './clientStore.js';

let isServerDown = false;

export async function api(path, options = {}) {
  // If we already know the server is unreachable (static deployment like GitHub Pages), use client fallback
  if (isServerDown) {
    return handleClientFallback(path, options);
  }

  try {
    const response = await fetch(`/api${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });

    if (response.status === 404 && path.startsWith('/')) {
      // Static server without /api proxy, switch to client fallback
      isServerDown = true;
      return handleClientFallback(path, options);
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Request failed. Please try again.');
    return data;
  } catch (err) {
    // If network connection failed or server is not running, switch to client fallback
    isServerDown = true;
    return handleClientFallback(path, options);
  }
}

function handleClientFallback(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  // 1. Auth routes
  if (path === '/auth/me') {
    return { user: clientStore.currentUser };
  }
  if (path === '/auth/login' || path === '/auth/register') {
    clientStore.currentUser = {
      id: 1,
      name: body.name || 'Asha Rao',
      email: body.email || 'student@learnx.org',
      role: body.role || 'student',
      language: body.language || 'en',
      grade_level: 'Grade 7'
    };
    return { user: clientStore.currentUser };
  }
  if (path === '/auth/demo-switch') {
    const role = body.role || 'student';
    const names = {
      student: 'Asha Rao',
      teacher: 'Prof. Ananya Sharma',
      parent: 'Kiran Rao (Parent)',
      admin: 'Dr. Ramesh Kumar (Admin)'
    };
    clientStore.currentUser = {
      id: role === 'student' ? 1 : role === 'teacher' ? 2 : role === 'parent' ? 3 : 4,
      name: names[role] || 'User',
      email: `${role}@learnx.org`,
      role,
      language: 'en',
      grade_level: 'Grade 7',
      linked_student_id: role === 'parent' ? 1 : null
    };
    return { user: clientStore.currentUser };
  }
  if (path === '/auth/logout') {
    clientStore.currentUser = null;
    return { ok: true };
  }
  if (path === '/profile/language') {
    if (clientStore.currentUser) clientStore.currentUser.language = body.language || 'en';
    return { user: clientStore.currentUser };
  }

  // 2. Topics & Quiz
  if (path === '/topics') {
    const topics = Object.keys(clientQuestions);
    const metadata = topics.map(name => ({
      name,
      questionCount: clientQuestions[name].length,
      subtopics: [...new Set(clientQuestions[name].map(q => q.subtopic))]
    }));
    return { topics, metadata };
  }
  if (path.startsWith('/quiz/') && method === 'GET') {
    const topic = decodeURIComponent(path.replace('/quiz/', '').split('?')[0]);
    const qs = clientQuestions[topic] || clientQuestions.Fractions;
    return {
      topic,
      questions: qs.map(q => ({
        id: q.id,
        difficulty: q.difficulty,
        subtopic: q.subtopic,
        question: q.question,
        choices: q.choices
      }))
    };
  }
  if (path.startsWith('/quiz/') && path.endsWith('/submit')) {
    const topic = decodeURIComponent(path.replace('/quiz/', '').replace('/submit', ''));
    const qs = clientQuestions[topic] || clientQuestions.Fractions;
    const answers = body.answers || [];
    let score = 0;
    const rootCausesDetected = [];
    const feedback = qs.map((q, idx) => {
      const correct = answers[idx] === q.answer;
      if (correct) score += 1;
      else if (q.rootCauseNote) rootCausesDetected.push('LCM_DENOMINATOR_MISCONCEPTION');
      return {
        questionId: q.id,
        correct,
        selectedChoice: answers[idx],
        correctChoice: q.answer,
        explanation: q.explain,
        rootCauseNote: !correct ? q.rootCauseNote : null,
        educatorVerified: true
      };
    });

    const newAttempt = {
      id: Date.now(),
      user_id: clientStore.currentUser?.id || 1,
      topic,
      score,
      total: qs.length,
      rootCauses: rootCausesDetected,
      createdAt: new Date().toISOString()
    };
    clientStore.attempts.unshift(newAttempt);

    return {
      attemptId: newAttempt.id,
      score,
      total: qs.length,
      percent: Math.round((score / qs.length) * 100),
      feedback,
      rootCausesDetected,
      diagnosedGaps: rootCausesDetected.map(k => ({
        key: k,
        details: {
          title: 'Common Denominators & LCM',
          description: 'Adding denominators directly instead of finding the Least Common Denominator.',
          drillExample: '1/2 + 1/4 = 2/4 + 1/4 = 3/4.'
        }
      }))
    };
  }

  // 3. Gap Finder
  if (path === '/gap-finder/analysis') {
    return {
      totalAttempts: clientStore.attempts.length,
      knowledgeTree: [
        { id: 'frac-root', domain: 'Fractions', prerequisiteNode: 'Common Denominators (LCM)', status: 'gap_detected', rootCauseKey: 'LCM_DENOMINATOR_MISCONCEPTION', title: 'Adding Unlike Denominators', advice: 'Find the lowest common denominator first before adding numerators.' },
        { id: 'alg-root', domain: 'Basic algebra', prerequisiteNode: 'Inverse Operations Order', status: 'in_progress', rootCauseKey: 'INVERSE_OPERATIONS_ORDER', title: 'Isolating Linear Variables', advice: 'Undo addition with subtraction, multiplication with division.' },
        { id: 'pemdas-root', domain: 'Basic algebra', prerequisiteNode: 'Order of Operations', status: 'mastered', rootCauseKey: 'ORDER_OF_OPERATIONS_PEMDAS', title: 'Precedence & PEMDAS', advice: 'Multiplication precedes addition.' },
        { id: 'read-root', domain: 'Reading comprehension', prerequisiteNode: 'Paragraph Structure', status: 'mastered', rootCauseKey: 'MAIN_VS_DETAIL_CONFUSION', title: 'Main Idea vs Details', advice: 'Look for the overarching thesis statement.' }
      ]
    };
  }

  // 4. Progress
  if (path === '/progress') {
    const summary = [
      { topic: 'Fractions', percent: 83, tries: 2 },
      { topic: 'Basic algebra', percent: 33, tries: 1 },
      { topic: 'Reading comprehension', percent: 100, tries: 1 },
      { topic: 'Science & Logic', percent: 75, tries: 1 }
    ];
    return {
      attempts: clientStore.attempts,
      summary,
      topics: Object.keys(clientQuestions),
      stats: {
        totalAttempts: clientStore.attempts.length,
        overallAccuracy: 78,
        xpPoints: 380,
        streakDays: 4
      },
      badges: [
        { id: 'first_quiz', name: 'Curious Learner', desc: 'Completed your first learning practice', unlocked: true },
        { id: 'gap_finder', name: 'Gap Crusher', desc: 'Diagnosed and worked through a root cause', unlocked: true },
        { id: 'perfectionist', name: 'Mastery Star', desc: 'Scored 100% on any practice set', unlocked: true },
        { id: 'dedicated', name: 'Consistent Mind', desc: 'Completed 5+ learning sessions', unlocked: false }
      ]
    };
  }

  // 5. Study Plan
  if (path === '/study-plan' && method === 'GET') {
    const plan = clientStore.studyPlans[0] || null;
    return {
      plans: clientStore.studyPlans,
      activePlan: plan ? { ...plan, blocks: JSON.parse(plan.schedule_json || '[]') } : null
    };
  }
  if (path === '/study-plan/generate' && method === 'POST') {
    const freeMinutes = body.freeMinutes || 30;
    const blocks = [
      { time: '8 min', phase: 'Flash Rule Drill', task: `Review root cause rule for ${body.topic || 'Fractions'}.` },
      { time: '15 min', phase: 'Guided Practice', task: 'Solve 4 targeted diagnostic questions with hints.' },
      { time: '7 min', phase: 'Confidence Review', task: 'Self-check: Explain solution steps.' }
    ];
    const newPlan = {
      id: Date.now(),
      topic: body.topic || 'Fractions',
      root_cause: 'LCM Common Denominators',
      daily_minutes: freeMinutes,
      schedule_json: JSON.stringify(blocks),
      completed_blocks: []
    };
    clientStore.studyPlans.unshift(newPlan);
    return { plan: newPlan, blocks };
  }
  if (path.includes('/toggle-block')) {
    const plan = clientStore.studyPlans[0];
    if (plan) {
      const idx = body.blockIndex;
      let completed = plan.completed_blocks || [];
      if (completed.includes(idx)) completed = completed.filter(i => i !== idx);
      else completed.push(idx);
      plan.completed_blocks = completed;
      return { plan };
    }
  }

  // 6. AI Question Generator (Bonus)
  if (path === '/ai/generate-question') {
    return {
      question: {
        id: `ai-gen-${Date.now()}`,
        topic: body.topic || 'Fractions',
        difficulty: body.difficulty || 'standard',
        isAiGenerated: true,
        educatorVerified: true,
        question: `Calculate: 1/4 + 2/8 = ?`,
        choices: ['2/8', '2/12', '4/8 (or 1/2)', '3/8'],
        answer: 2,
        explain: '2/8 simplifies to 1/4. So 1/4 + 1/4 = 2/4 = 4/8 = 1/2.'
      }
    };
  }

  // 7. Teacher routes
  if (path === '/teacher/classrooms') {
    return { classrooms: clientStore.classrooms };
  }
  if (path.startsWith('/teacher/classrooms/')) {
    return {
      classroomId: 1,
      students: [
        { id: 1, name: 'Asha Rao', email: 'student@learnx.org', averageScore: 78, totalPractices: 4, detectedGaps: ['LCM_DENOMINATOR_MISCONCEPTION'], needsIntervention: false },
        { id: 5, name: 'Rahul Verma', email: 'rahul@learnx.org', averageScore: 48, totalPractices: 2, detectedGaps: ['INVERSE_OPERATIONS_ORDER'], needsIntervention: true }
      ]
    };
  }
  if (path === '/teacher/ai-flags') {
    return { flags: clientStore.aiFlags };
  }
  if (path === '/ai/flag-explanation') {
    const flag = { id: Date.now(), ...body, status: 'pending' };
    clientStore.aiFlags.push(flag);
    return { success: true, flag };
  }
  if (path.includes('/resolve')) {
    return { success: true };
  }

  // 8. Parent route
  if (path === '/parent/child') {
    return {
      linked: true,
      student: { id: 1, name: 'Asha Rao', grade_level: 'Grade 7' },
      summary: [
        { topic: 'Fractions', percent: 83 },
        { topic: 'Basic algebra', percent: 33 },
        { topic: 'Reading comprehension', percent: 100 }
      ],
      recentPractices: clientStore.attempts.slice(0, 3),
      activePlan: clientStore.studyPlans[0],
      parentGuidance: 'Asha is strengthening Basic algebra. A 15-minute home review together will boost her confidence.'
    };
  }

  // 9. Admin route
  if (path === '/admin/overview') {
    return {
      metrics: { totalUsers: 14, totalAttempts: 42, totalClassrooms: 3 },
      roleDistribution: { students: 9, teachers: 2, parents: 2, admins: 1 },
      auditLogs: [
        { id: 1, timestamp: new Date().toISOString(), user_id: 1, action: 'SUBMIT_PRACTICE', details: 'Fractions: 3/3' },
        { id: 2, timestamp: new Date(Date.now() - 3600000).toISOString(), user_id: 2, action: 'CREATE_CLASSROOM', details: 'MATH7A' }
      ]
    };
  }

  return {};
}
