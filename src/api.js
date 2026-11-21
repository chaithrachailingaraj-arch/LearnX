import { clientStore } from './clientStore.js';

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
      // Static host without backend proxy, switch to client fallback
      isServerDown = true;
      return handleClientFallback(path, options);
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || data.detail || 'Request failed. Please try again.');
    return data;
  } catch (err) {
    isServerDown = true;
    return handleClientFallback(path, options);
  }
}

function handleClientFallback(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  // 1. TEACHER AUTHENTICATION
  if (path === '/teachers/register' && method === 'POST') {
    const newTeacher = {
      id: Date.now(),
      name: body.name || 'Teacher',
      email: body.email.toLowerCase(),
      phone: body.phone,
      school_name: body.school_name,
      subject_specialization: body.subject_specialization,
      teacher_id_code: body.teacher_id_code,
      role: 'teacher',
      language: 'en'
    };
    clientStore.teachers.push(newTeacher);
    clientStore.currentUser = newTeacher;
    return {
      success: true,
      message: 'Teacher registration successful!',
      teacher: newTeacher,
      token: 'mock-jwt-teacher-token'
    };
  }

  if (path === '/teachers/login' && method === 'POST') {
    const t = clientStore.teachers.find(tch => tch.email === body.email?.toLowerCase());
    const teacher = t || clientStore.teachers[0];
    clientStore.currentUser = { ...teacher, role: 'teacher' };
    return {
      success: true,
      teacher: clientStore.currentUser,
      token: 'mock-jwt-teacher-token'
    };
  }

  if (path === '/teachers/me') {
    return { teacher: clientStore.currentUser };
  }

  // 2. TEACHER STUDENTS & ACTIVITY MONITORING
  if (path.startsWith('/teachers/students') && method === 'GET' && !path.includes('/feedback')) {
    const parts = path.split('?');
    const studentIdParam = parts[0].replace('/teachers/students', '').replace('/', '');

    if (studentIdParam && !isNaN(studentIdParam)) {
      const student = clientStore.students.find(s => s.id === Number(studentIdParam)) || clientStore.students[0];
      return { student };
    }

    // List with filters
    const urlParams = new URLSearchParams(parts[1] || '');
    const search = (urlParams.get('search') || '').toLowerCase();
    const className = urlParams.get('class_name');
    const performance = urlParams.get('performance');

    let list = [...clientStore.students];
    if (search) {
      list = list.filter(s => s.name.toLowerCase().includes(search) || s.student_id_code.toLowerCase().includes(search) || s.email.toLowerCase().includes(search));
    }
    if (className && className !== 'All') {
      list = list.filter(s => s.class_semester === className);
    }
    if (performance === 'High') {
      list = list.filter(s => s.average_score >= 80);
    } else if (performance === 'Average') {
      list = list.filter(s => s.average_score >= 50 && s.average_score < 80);
    } else if (performance === 'Needs Support') {
      list = list.filter(s => s.average_score < 50);
    }

    return { students: list };
  }

  if (path.includes('/feedback') && method === 'POST') {
    const studentId = Number(path.split('/')[3]);
    clientStore.studentFeedbackNotes.push({
      student_id: studentId,
      note: body.note,
      sent_at: new Date().toISOString()
    });
    return { success: true, message: 'Feedback sent to student successfully!' };
  }

  // 3. TEACHER ANALYTICS & CHARTS
  if (path === '/teachers/analytics') {
    const totalStudents = clientStore.students.length;
    const avg = Math.round(clientStore.students.reduce((acc, s) => acc + s.average_score, 0) / (totalStudents || 1));
    return {
      metrics: {
        total_students: totalStudents,
        total_attempts: 18,
        class_average: avg,
        quizzes_created: clientStore.quizzes.length,
        materials_uploaded: clientStore.studyMaterials.length,
        students_needing_support: clientStore.students.filter(s => s.needs_support).length
      },
      topic_performance: [
        { topic: 'Fractions & Arithmetic', score: 83, status: 'Mastered' },
        { topic: 'Basic algebra', score: 58, status: 'Needs Review' },
        { topic: 'Reading comprehension', score: 92, status: 'Mastered' },
        { topic: 'Science & Logic', score: 76, status: 'Proficient' }
      ],
      weekly_activity: [
        { day: 'Mon', quizzes: 14, study_hours: 18 },
        { day: 'Tue', quizzes: 22, study_hours: 26 },
        { day: 'Wed', quizzes: 19, study_hours: 24 },
        { day: 'Thu', quizzes: 28, study_hours: 32 },
        { day: 'Fri', quizzes: 25, study_hours: 29 },
        { day: 'Sat', quizzes: 12, study_hours: 15 },
        { day: 'Sun', quizzes: 8, study_hours: 10 }
      ]
    };
  }

  // 4. QUIZ CREATION & MANAGEMENT
  if (path === '/teachers/quizzes' && method === 'POST') {
    const newQuiz = {
      id: Date.now(),
      teacher_id: clientStore.currentUser?.id || 2,
      title: body.title,
      subject: body.subject,
      topic: body.topic,
      class_semester: body.class_semester,
      difficulty: body.difficulty || 'Medium',
      description: body.description,
      time_limit: body.time_limit || 20,
      total_marks: body.questions?.reduce((acc, q) => acc + Number(q.marks || 10), 0) || 100,
      passing_percentage: body.passing_percentage || 60,
      status: body.status || 'published',
      deadline: body.deadline || '2026-12-31',
      created_at: new Date().toISOString().split('T')[0],
      questions: body.questions || []
    };
    clientStore.quizzes.unshift(newQuiz);
    return { success: true, message: 'Quiz created successfully!', quiz_id: newQuiz.id };
  }

  if (path === '/teachers/quizzes' && method === 'GET') {
    return {
      quizzes: clientStore.quizzes.map(q => ({
        id: q.id,
        title: q.title,
        subject: q.subject,
        topic: q.topic,
        class_semester: q.class_semester,
        difficulty: q.difficulty,
        time_limit: q.time_limit,
        total_marks: q.total_marks,
        passing_percentage: q.passing_percentage,
        status: q.status,
        deadline: q.deadline,
        questions_count: q.questions?.length || 0,
        submissions_count: 4,
        created_at: q.created_at
      }))
    };
  }

  if (path.startsWith('/teachers/quizzes/') && method === 'GET') {
    const qId = Number(path.replace('/teachers/quizzes/', ''));
    const quiz = clientStore.quizzes.find(q => q.id === qId) || clientStore.quizzes[0];
    return { quiz };
  }

  if (path.startsWith('/teachers/quizzes/') && method === 'DELETE') {
    const qId = Number(path.replace('/teachers/quizzes/', ''));
    clientStore.quizzes = clientStore.quizzes.filter(q => q.id !== qId);
    return { success: true, message: 'Quiz deleted.' };
  }

  // 5. STUDY MATERIALS MANAGEMENT
  if (path === '/teachers/materials' && method === 'POST') {
    const newMaterial = {
      id: Date.now(),
      teacher_id: clientStore.currentUser?.id || 2,
      title: body.title,
      subject: body.subject,
      topic: body.topic,
      class_semester: body.class_semester,
      description: body.description,
      file_name: body.file_name || 'Document.pdf',
      file_type: body.file_type || 'pdf',
      file_size_kb: body.file_size_kb || 240,
      downloads_count: 0,
      created_at: new Date().toISOString().split('T')[0]
    };
    clientStore.studyMaterials.unshift(newMaterial);
    return { success: true, message: 'Material uploaded successfully!', material_id: newMaterial.id };
  }

  if (path === '/teachers/materials' && method === 'GET') {
    return { materials: clientStore.studyMaterials };
  }

  if (path.startsWith('/teachers/materials/') && method === 'DELETE') {
    const mId = Number(path.replace('/teachers/materials/', ''));
    clientStore.studyMaterials = clientStore.studyMaterials.filter(m => m.id !== mId);
    return { success: true, message: 'Material deleted.' };
  }

  // 6. ANNOUNCEMENTS
  if (path === '/teachers/announcements' && method === 'POST') {
    const newAnn = {
      id: Date.now(),
      teacher_id: clientStore.currentUser?.id || 2,
      title: body.title,
      content: body.content,
      target_class: body.target_class || 'All Classes',
      priority: body.priority || 'normal',
      teacher_name: clientStore.currentUser?.name || 'Prof. Ananya',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    clientStore.announcements.unshift(newAnn);
    return { success: true, message: 'Announcement posted!', id: newAnn.id };
  }

  if (path === '/announcements') {
    return { announcements: clientStore.announcements };
  }

  // 7. STUDENT SIDE INTEGRATION: Assigned Quizzes & Materials
  if (path === '/students/quizzes') {
    return {
      quizzes: clientStore.quizzes.filter(q => q.status === 'published').map(q => ({
        id: q.id,
        title: q.title,
        subject: q.subject,
        topic: q.topic,
        class_semester: q.class_semester,
        difficulty: q.difficulty,
        time_limit: q.time_limit,
        total_marks: q.total_marks,
        passing_percentage: q.passing_percentage,
        deadline: q.deadline,
        questions_count: q.questions.length,
        teacher_name: 'Prof. Ananya Sharma'
      }))
    };
  }

  if (path.startsWith('/students/quizzes/') && path.endsWith('/submit')) {
    const qId = Number(path.replace('/students/quizzes/', '').replace('/submit', ''));
    const quiz = clientStore.quizzes.find(q => q.id === qId) || clientStore.quizzes[0];
    const answers = body.answers || [];
    let score = 0;

    const feedback = quiz.questions.map((q, idx) => {
      const studentAns = String(answers[idx] ?? '').trim().toLowerCase();
      const correctAns = String(q.correct_answer ?? '').trim().toLowerCase();
      const isCorrect = studentAns === correctAns;
      if (isCorrect) score += q.marks;

      return {
        question_id: q.id,
        prompt: q.prompt,
        student_answer: answers[idx],
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
        marks_awarded: isCorrect ? q.marks : 0,
        explanation: q.explanation
      };
    });

    const percentage = Math.round((score / quiz.total_marks) * 100);
    const passed = percentage >= quiz.passing_percentage;

    // Record attempt for student
    const student = clientStore.students[0];
    if (student) {
      student.total_quizzes += 1;
      student.quiz_history.unshift({
        quiz_title: quiz.title,
        score,
        total_marks: quiz.total_marks,
        percentage,
        passed,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16)
      });
    }

    return {
      score,
      total_marks: quiz.total_marks,
      percentage,
      passed,
      feedback
    };
  }

  if (path === '/students/materials') {
    return { materials: clientStore.studyMaterials };
  }

  if (path.includes('/download')) {
    const matId = Number(path.split('/')[2]);
    const mat = clientStore.studyMaterials.find(m => m.id === matId);
    if (mat) mat.downloads_count += 1;
    return { success: true };
  }

  // Fallback to legacy student endpoints
  if (path === '/auth/me') {
    return { user: clientStore.currentUser };
  }
  if (path === '/auth/demo-switch') {
    const role = body.role || 'teacher';
    if (role === 'teacher') {
      clientStore.currentUser = { ...clientStore.teachers[0], role: 'teacher' };
    } else {
      clientStore.currentUser = { ...clientStore.students[0], role: 'student', language: 'en' };
    }
    return { user: clientStore.currentUser };
  }
  if (path === '/auth/logout') {
    clientStore.currentUser = null;
    return { ok: true };
  }

  return {};
}
