// In-browser mock engine for static deployments (e.g. GitHub Pages)

export const clientStore = {
  currentUser: {
    id: 1,
    name: 'Asha Rao',
    email: 'student@learnx.org',
    role: 'student',
    language: 'en',
    grade_level: 'Grade 7'
  },
  attempts: [
    { id: 1, user_id: 1, topic: 'Fractions', score: 2, total: 3, rootCauses: ['LCM_DENOMINATOR_MISCONCEPTION'], createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 2, user_id: 1, topic: 'Basic algebra', score: 1, total: 3, rootCauses: ['INVERSE_OPERATIONS_ORDER'], createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 3, user_id: 1, topic: 'Reading comprehension', score: 3, total: 3, rootCauses: [], createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 4, user_id: 1, topic: 'Fractions', score: 3, total: 3, rootCauses: [], createdAt: new Date().toISOString() }
  ],
  studyPlans: [
    {
      id: 1,
      user_id: 1,
      topic: 'Basic algebra',
      root_cause: 'Inverse Operations Order',
      daily_minutes: 30,
      schedule_json: JSON.stringify([
        { time: '10 min', phase: 'Concept Drill', task: 'Review: Isolating variables using opposite operations (+ to -, × to ÷)' },
        { time: '12 min', phase: 'Guided Practice', task: 'Solve 4 one-step & two-step equations with step-by-step checks' },
        { time: '8 min', phase: 'Check-in Quiz', task: 'Take a quick 3-question mastery check' }
      ]),
      completed_blocks: [0],
      created_at: new Date().toISOString()
    }
  ],
  classrooms: [
    { id: 1, code: 'MATH7A', name: 'Grade 7 Math & Reading Section A', teacher_id: 2, subject: 'Foundational Math & Language', created_at: new Date().toISOString() }
  ],
  aiFlags: []
};

export const clientQuestions = {
  Fractions: [
    {
      id: 'frac-1',
      difficulty: 'foundational',
      subtopic: 'Unlike Denominators Addition',
      question: 'What is 1/2 + 1/4?',
      choices: ['2/6', '3/4', '1/6', '2/4'],
      answer: 1,
      explain: 'To add fractions with different denominators, find the common denominator (4). 1/2 is 2/4. Then 2/4 + 1/4 = 3/4. Do not add the bottom numbers together!',
      rootCauseNote: 'Common mistake: Adding denominators (2+4=6). Denominators tell you the size of the slice.'
    },
    {
      id: 'frac-2',
      difficulty: 'foundational',
      subtopic: 'Equivalent Fractions',
      question: 'Which fraction is equal to 2/3?',
      choices: ['4/6', '3/5', '2/6', '5/6'],
      answer: 0,
      explain: 'Multiply both top and bottom by 2: (2×2)/(3×2) = 4/6.',
      rootCauseNote: 'Equivalent fractions keep the same value when top and bottom are multiplied by the same non-zero number.'
    },
    {
      id: 'frac-3',
      difficulty: 'standard',
      subtopic: 'Fraction of a Whole',
      question: 'What is 3/4 of 20?',
      choices: ['12', '15', '16', '17'],
      answer: 1,
      explain: 'Divide 20 by 4 = 5. Then multiply by 3 = 15.',
      rootCauseNote: 'Fraction of a quantity: (Whole ÷ Denominator) × Numerator.'
    }
  ],
  'Basic algebra': [
    {
      id: 'alg-1',
      difficulty: 'foundational',
      subtopic: 'One-step Linear Equations',
      question: 'Solve for x: x + 5 = 12',
      choices: ['5', '6', '7', '17'],
      answer: 2,
      explain: 'To undo adding 5, subtract 5 from each side: x = 12 - 5 = 7.',
      rootCauseNote: 'Inverse operation rule: Undo addition with subtraction.'
    },
    {
      id: 'alg-2',
      difficulty: 'foundational',
      subtopic: 'Multiplicative Linear Equations',
      question: 'Solve for x: 3x = 18',
      choices: ['3', '6', '15', '21'],
      answer: 1,
      explain: 'Divide each side by 3: 18 ÷ 3 = 6.',
      rootCauseNote: 'When a number is next to a variable (3x), it represents multiplication.'
    },
    {
      id: 'alg-3',
      difficulty: 'standard',
      subtopic: 'Expression Evaluation & Substitution',
      question: 'If y = 4, what is 2y + 3?',
      choices: ['11', '14', '8', '10'],
      answer: 0,
      explain: 'PEMDAS: Multiply first (2 × 4 = 8), then add 3: 8 + 3 = 11.',
      rootCauseNote: 'Order of Operations: Multiplication precedes addition.'
    }
  ],
  'Reading comprehension': [
    {
      id: 'read-1',
      difficulty: 'foundational',
      subtopic: 'Main Idea Identification',
      question: 'A paragraph’s main idea is best described as…',
      choices: ['A small supporting fact', 'The central point of the paragraph', 'A new vocabulary word', 'The final punctuation mark'],
      answer: 1,
      explain: 'The main idea is the central umbrella thought that all other sentences support.',
      rootCauseNote: 'Don’t confuse a supporting detail with the core thesis.'
    },
    {
      id: 'read-2',
      difficulty: 'standard',
      subtopic: 'Context Clues & Vocabulary',
      question: 'Which clue most effectively helps you deduce an unfamiliar word’s meaning?',
      choices: ['Words and sentences surrounding the unfamiliar word', 'The length of the paragraph', 'The font style of the text', 'The date the article was published'],
      answer: 0,
      explain: 'Surrounding words, synonyms, and contrasting statements give context clues.',
      rootCauseNote: 'Context clues provide meaning within the text.'
    }
  ],
  'Science & Logic': [
    {
      id: 'sci-1',
      difficulty: 'foundational',
      subtopic: 'Scientific Method & Variables',
      question: 'In a plant growth test, sunlight hours are changed while soil and water stay constant. Sunlight is the…',
      choices: ['Dependent variable', 'Independent variable', 'Controlled variable', 'Hypothesis'],
      answer: 1,
      explain: 'The independent variable is the single factor intentionally changed by the scientist.',
      rootCauseNote: 'Independent Variable = "What I change". Dependent Variable = "What is measured".'
    }
  ]
};
