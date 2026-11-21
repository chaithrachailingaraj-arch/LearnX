import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import db from './db.js';

const app = express();
const port = Number(process.env.PORT || 3001);
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '20kb' }));
app.use(session({
  name: 'learnx.sid',
  secret: process.env.SESSION_SECRET || 'change-this-development-secret-before-deploying',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: isProduction, maxAge: 1000 * 60 * 60 * 24 * 7 },
}));

const questions = {
  Fractions: [
    { question: 'What is 1/2 + 1/4?', choices: ['2/6', '3/4', '1/6', '2/4'], answer: 1, explain: 'Use a common denominator: 2/4 + 1/4 = 3/4.' },
    { question: 'Which fraction is equal to 2/3?', choices: ['4/6', '3/5', '2/6', '5/6'], answer: 0, explain: 'Multiply the top and bottom of 2/3 by 2 to get 4/6.' },
    { question: 'What is 3/4 of 20?', choices: ['12', '15', '16', '17'], answer: 1, explain: '20 ÷ 4 = 5, then 5 × 3 = 15.' },
  ],
  'Basic algebra': [
    { question: 'Solve: x + 5 = 12', choices: ['5', '6', '7', '17'], answer: 2, explain: 'Subtract 5 from each side. x = 7.' },
    { question: 'Solve: 3x = 18', choices: ['3', '6', '15', '21'], answer: 1, explain: 'Divide each side by 3. x = 6.' },
    { question: 'If y = 4, what is 2y + 3?', choices: ['11', '14', '8', '10'], answer: 0, explain: 'Replace y with 4: 2 × 4 + 3 = 11.' },
  ],
  'Reading comprehension': [
    { question: 'A paragraph’s main idea is best described as…', choices: ['A small detail', 'The central point', 'A new vocabulary word', 'The final punctuation'], answer: 1, explain: 'The main idea is the central point the paragraph communicates.' },
    { question: 'Which clue most often helps explain an unfamiliar word?', choices: ['Nearby sentences', 'The page number', 'The font size', 'The author’s initials'], answer: 0, explain: 'Nearby sentences often give context clues about a word’s meaning.' },
    { question: 'A good summary should…', choices: ['Copy every sentence', 'Include only personal opinions', 'State the key ideas briefly', 'Add unrelated facts'], answer: 2, explain: 'A summary briefly restates the important ideas in your own words.' },
  ],
};
const topics = Object.keys(questions);

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, language: user.language };
}
function requireUser(req, res, next) {
  const user = req.session.userId && db.prepare('SELECT id, name, email, language FROM users WHERE id = ?').get(req.session.userId);
  if (!user) return res.status(401).json({ error: 'Please sign in to continue.' });
  req.user = user;
  next();
}

app.post('/api/auth/register', async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (name.length < 2 || name.length > 60) return res.status(400).json({ error: 'Name must be between 2 and 60 characters.' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  if (password.length < 8 || password.length > 100) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(name, email, passwordHash);
    req.session.userId = result.lastInsertRowid;
    res.status(201).json({ user: publicUser(db.prepare('SELECT id, name, email, language FROM users WHERE id = ?').get(result.lastInsertRowid)) });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'That email already has an account.' });
    console.error(error);
    res.status(500).json({ error: 'Could not create the account.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ error: 'Email or password is incorrect.' });
  req.session.userId = user.id;
  res.json({ user: publicUser(user) });
});

app.post('/api/auth/logout', (req, res) => req.session.destroy(() => res.json({ ok: true })));
app.get('/api/auth/me', requireUser, (req, res) => res.json({ user: publicUser(req.user) }));

app.get('/api/topics', requireUser, (_req, res) => res.json({ topics }));
app.get('/api/quiz/:topic', requireUser, (req, res) => {
  const quiz = questions[req.params.topic];
  if (!quiz) return res.status(404).json({ error: 'Topic not found.' });
  // Do not send answer keys to the browser before the learner submits.
  res.json({ questions: quiz.map(({ question, choices }) => ({ question, choices })) });
});

app.post('/api/quiz/:topic/submit', requireUser, (req, res) => {
  const quiz = questions[req.params.topic];
  const answers = req.body.answers;
  if (!quiz || !Array.isArray(answers) || answers.length !== quiz.length || answers.some((v) => !Number.isInteger(v) || v < 0 || v >= 4)) {
    return res.status(400).json({ error: 'Please answer each question before submitting.' });
  }
  const score = quiz.reduce((sum, item, index) => sum + (answers[index] === item.answer ? 1 : 0), 0);
  db.prepare('INSERT INTO attempts (user_id, topic, score, total) VALUES (?, ?, ?, ?)').run(req.user.id, req.params.topic, score, quiz.length);
  res.json({ score, total: quiz.length, feedback: quiz.map((item, index) => ({ correct: answers[index] === item.answer, explanation: item.explain })) });
});

app.get('/api/progress', requireUser, (req, res) => {
  const attempts = db.prepare('SELECT id, topic, score, total, created_at AS createdAt FROM attempts WHERE user_id = ? ORDER BY id DESC LIMIT 30').all(req.user.id);
  const summary = db.prepare(`SELECT topic, ROUND(AVG(100.0 * score / total)) AS percent, COUNT(*) AS tries FROM attempts WHERE user_id = ? GROUP BY topic`).all(req.user.id);
  res.json({ attempts, summary, topics });
});

app.put('/api/profile/language', requireUser, (req, res) => {
  const language = ['en', 'hi', 'kn'].includes(req.body.language) ? req.body.language : null;
  if (!language) return res.status(400).json({ error: 'Choose a supported language.' });
  db.prepare('UPDATE users SET language = ? WHERE id = ?').run(language, req.user.id);
  res.json({ user: publicUser(db.prepare('SELECT id, name, email, language FROM users WHERE id = ?').get(req.user.id)) });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

if (isProduction) {
  const path = await import('node:path');
  app.use(express.static(path.resolve('dist')));
  app.get('*', (_req, res) => res.sendFile(path.resolve('dist/index.html')));
}

app.listen(port, () => console.log(`LearnX API is running at http://localhost:${port}`));
