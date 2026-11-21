// In-browser mock engine and database for LearnX Teacher & Student Module

export const clientStore = {
  // Current logged in user (starts as demo teacher or student)
  currentUser: {
    id: 2,
    name: 'Prof. Ananya Sharma',
    email: 'teacher@learnx.org',
    role: 'teacher',
    phone: '+91 98765 43210',
    school_name: 'National Academy of Science & Arts',
    subject_specialization: 'Mathematics & Foundational Sciences',
    teacher_id_code: 'TCH-1042',
    language: 'en'
  },

  // 1. Teachers
  teachers: [
    {
      id: 2,
      name: 'Prof. Ananya Sharma',
      email: 'teacher@learnx.org',
      phone: '+91 98765 43210',
      school_name: 'National Academy of Science & Arts',
      subject_specialization: 'Mathematics & Foundational Sciences',
      teacher_id_code: 'TCH-1042',
      password: 'teacher123',
      created_at: '2026-01-10T10:00:00Z'
    }
  ],

  // 2. Students
  students: [
    {
      id: 1,
      name: 'Asha Rao',
      email: 'student@learnx.org',
      student_id_code: 'STU-2024-001',
      class_semester: 'Grade 7 - Sem 1',
      course_dept: 'Science & Mathematics',
      registration_date: '2026-01-15',
      last_login: '2026-11-21 15:30',
      total_quizzes: 5,
      average_score: 82.5,
      learning_progress: 85,
      weak_topics: ['LCM Common Denominators'],
      needs_support: false,
      quiz_history: [
        { quiz_title: 'Linear Equations Challenge', score: 35, total_marks: 40, percentage: 87.5, passed: true, date: '2026-11-20 14:10' },
        { quiz_title: 'Fractions Diagnostic', score: 28, total_marks: 30, percentage: 93.3, passed: true, date: '2026-11-18 11:25' },
        { quiz_title: 'Reading Comprehension', score: 20, total_marks: 20, percentage: 100.0, passed: true, date: '2026-11-15 09:40' }
      ]
    },
    {
      id: 5,
      name: 'Rahul Verma',
      email: 'rahul@learnx.org',
      student_id_code: 'STU-2024-002',
      class_semester: 'Grade 7 - Sem 1',
      course_dept: 'Science & Mathematics',
      registration_date: '2026-01-18',
      last_login: '2026-11-20 12:00',
      total_quizzes: 3,
      average_score: 48.0,
      learning_progress: 45,
      weak_topics: ['Inverse Operations', 'Negative Sign Rules'],
      needs_support: true,
      quiz_history: [
        { quiz_title: 'Linear Equations Challenge', score: 18, total_marks: 40, percentage: 45.0, passed: false, date: '2026-11-19 16:30' },
        { quiz_title: 'Fractions Diagnostic', score: 15, total_marks: 30, percentage: 50.0, passed: false, date: '2026-11-17 10:15' }
      ]
    },
    {
      id: 6,
      name: 'Sneha Kulkarni',
      email: 'sneha@learnx.org',
      student_id_code: 'STU-2024-003',
      class_semester: 'Grade 7 - Sem 1',
      course_dept: 'Humanities & Languages',
      registration_date: '2026-02-01',
      last_login: '2026-11-21 11:15',
      total_quizzes: 4,
      average_score: 91.0,
      learning_progress: 92,
      weak_topics: [],
      needs_support: false,
      quiz_history: [
        { quiz_title: 'Reading Comprehension Master', score: 30, total_marks: 30, percentage: 100.0, passed: true, date: '2026-11-20 18:00' },
        { quiz_title: 'Scientific Method', score: 18, total_marks: 20, percentage: 90.0, passed: true, date: '2026-11-16 13:45' }
      ]
    },
    {
      id: 7,
      name: 'Karthik Nair',
      email: 'karthik@learnx.org',
      student_id_code: 'STU-2024-004',
      class_semester: 'Grade 8 - Sem 2',
      course_dept: 'Science & Mathematics',
      registration_date: '2026-02-10',
      last_login: '2026-11-19 09:10',
      total_quizzes: 4,
      average_score: 74.0,
      learning_progress: 70,
      weak_topics: ['Fraction of Whole'],
      needs_support: false,
      quiz_history: [
        { quiz_title: 'Linear Equations Challenge', score: 30, total_marks: 40, percentage: 75.0, passed: true, date: '2026-11-18 15:20' }
      ]
    },
    {
      id: 8,
      name: 'Priya Patel',
      email: 'priya@learnx.org',
      student_id_code: 'STU-2024-005',
      class_semester: 'Grade 8 - Sem 2',
      course_dept: 'Commerce & General',
      registration_date: '2026-02-14',
      last_login: '2026-11-18 16:45',
      total_quizzes: 2,
      average_score: 42.0,
      learning_progress: 35,
      weak_topics: ['LCM Denominator Misconception'],
      needs_support: true,
      quiz_history: [
        { quiz_title: 'Fractions Diagnostic', score: 12, total_marks: 30, percentage: 40.0, passed: false, date: '2026-11-17 14:10' }
      ]
    }
  ],

  // 3. Quizzes (Custom Teacher Quizzes)
  quizzes: [
    {
      id: 101,
      teacher_id: 2,
      title: 'Linear Equations Mastery Challenge',
      subject: 'Basic algebra',
      topic: 'One-step and Two-step Linear Equations',
      class_semester: 'Grade 7 - Sem 1',
      difficulty: 'Medium',
      description: 'Comprehensive test on inverse operations, signs, and variable isolation techniques.',
      time_limit: 25,
      total_marks: 40.0,
      passing_percentage: 60.0,
      status: 'published',
      deadline: '2026-12-15',
      created_at: '2026-11-15',
      questions: [
        {
          id: 1,
          question_type: 'mcq',
          prompt: 'Solve for x: 3x + 9 = 27',
          options: ['4', '6', '9', '12'],
          correct_answer: '6',
          marks: 10.0,
          explanation: 'Subtract 9 from both sides: 3x = 18. Divide by 3: x = 6.'
        },
        {
          id: 2,
          question_type: 'true_false',
          prompt: 'True or False: Addition and Subtraction are inverse operations in algebra.',
          options: ['True', 'False'],
          correct_answer: 'True',
          marks: 10.0,
          explanation: 'Addition undoes subtraction and vice versa.'
        },
        {
          id: 3,
          question_type: 'fill_blank',
          prompt: 'If 2y = 16, then the value of y is ____.',
          options: [],
          correct_answer: '8',
          marks: 10.0,
          explanation: 'Divide both sides by 2: y = 8.'
        },
        {
          id: 4,
          question_type: 'short_answer',
          prompt: 'Explain the first step to isolate x in the equation x/4 - 3 = 5.',
          options: [],
          correct_answer: 'Add 3 to both sides',
          marks: 10.0,
          explanation: 'Add 3 to both sides to get x/4 = 8, then multiply both sides by 4.'
        }
      ]
    },
    {
      id: 102,
      teacher_id: 2,
      title: 'Fractions & Proportions Benchmark',
      subject: 'Fractions',
      topic: 'Unlike Denominators & GCF',
      class_semester: 'Grade 7 - Sem 1',
      difficulty: 'Hard',
      description: 'Benchmark assessment to evaluate LCM calculation and fraction addition skills.',
      time_limit: 20,
      total_marks: 30.0,
      passing_percentage: 70.0,
      status: 'published',
      deadline: '2026-12-20',
      created_at: '2026-11-18',
      questions: [
        {
          id: 5,
          question_type: 'mcq',
          prompt: 'What is 2/3 + 1/6 in simplest form?',
          options: ['3/9', '5/6', '3/6', '4/6'],
          correct_answer: '5/6',
          marks: 15.0,
          explanation: 'LCM is 6: 4/6 + 1/6 = 5/6.'
        },
        {
          id: 6,
          question_type: 'true_false',
          prompt: 'True or False: You should add denominators together when adding fractions.',
          options: ['True', 'False'],
          correct_answer: 'False',
          marks: 15.0,
          explanation: 'Never add denominators; convert to common denominator first.'
        }
      ]
    }
  ],

  // 4. Study Materials
  studyMaterials: [
    {
      id: 201,
      teacher_id: 2,
      title: 'Algebra Fundamentals & Sign Rules Cheat Sheet',
      subject: 'Basic algebra',
      topic: 'Inverse Operations & PEMDAS',
      class_semester: 'Grade 7 - Sem 1',
      description: 'Comprehensive quick-reference summary of order of operations, negative numbers, and variable isolation steps.',
      file_name: 'Algebra_CheatSheet_Grade7.pdf',
      file_type: 'pdf',
      file_size_kb: 345.0,
      downloads_count: 18,
      created_at: '2026-11-10'
    },
    {
      id: 202,
      teacher_id: 2,
      title: 'Fractions & Decimals Visual Concept Guide',
      subject: 'Fractions',
      topic: 'Unlike Denominators & LCM',
      class_semester: 'Grade 7 - Sem 1',
      description: 'Visual step-by-step pie charts and bar models demonstrating common denominator conversion.',
      file_name: 'Fractions_Visual_Guide.pdf',
      file_type: 'pdf',
      file_size_kb: 512.0,
      downloads_count: 24,
      created_at: '2026-11-12'
    },
    {
      id: 203,
      teacher_id: 2,
      title: 'Scientific Method & Variable Control Presentation',
      subject: 'Science & Logic',
      topic: 'Independent vs Dependent Variables',
      class_semester: 'Grade 7 - Sem 1',
      description: 'Slides explaining how to isolate variables and avoid experimental bias in trial testing.',
      file_name: 'Scientific_Variables_Lecture.pptx',
      file_type: 'pptx',
      file_size_kb: 1240.0,
      downloads_count: 15,
      created_at: '2026-11-16'
    }
  ],

  // 5. Announcements
  announcements: [
    {
      id: 301,
      teacher_id: 2,
      title: 'Midterm Diagnostic Quiz Scheduled',
      content: 'Please review Chapter 3 on Linear Equations before Wednesday. Check the study materials tab for the new formula sheet.',
      target_class: 'Grade 7 - Sem 1',
      priority: 'important',
      teacher_name: 'Prof. Ananya Sharma',
      created_at: '2026-11-20 09:30'
    },
    {
      id: 302,
      teacher_id: 2,
      title: 'Free 1-on-1 Tutoring Office Hours',
      content: 'Special office hours to review LCM and common denominators this Thursday from 4:00 PM to 5:30 PM in Room 204 or online.',
      target_class: 'All Classes',
      priority: 'normal',
      teacher_name: 'Prof. Ananya Sharma',
      created_at: '2026-11-18 14:00'
    }
  ],

  // Feedback messages sent to students
  studentFeedbackNotes: [
    { student_id: 5, note: 'Rahul, please review the Algebra cheat sheet before attempting quiz 2.', sent_at: '2026-11-20' }
  ]
};
