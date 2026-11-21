import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { api } from './api.js';

const words = {
  en: { home: 'Home', practice: 'Practice', progress: 'My progress', welcome: 'Welcome back', tagline: 'A learning plan that fits your pace.', start: 'Start a practice', weak: 'Topics to strengthen', recent: 'Recent practice', hours: 'Free study time today', plan: 'Build my study plan', submit: 'Check my answers', next: 'Try another topic', signout: 'Sign out', signin: 'Sign in', create: 'Create account' },
  hi: { home: 'होम', practice: 'अभ्यास', progress: 'मेरी प्रगति', welcome: 'वापस स्वागत है', tagline: 'आपकी गति के अनुसार सीखने की योजना।', start: 'अभ्यास शुरू करें', weak: 'जिन विषयों पर अभ्यास करें', recent: 'हाल का अभ्यास', hours: 'आज पढ़ाई का खाली समय', plan: 'मेरी योजना बनाएँ', submit: 'उत्तर जाँचें', next: 'दूसरा विषय आज़माएँ', signout: 'साइन आउट', signin: 'साइन इन', create: 'खाता बनाएँ' },
  kn: { home: 'ಮುಖಪುಟ', practice: 'ಅಭ್ಯಾಸ', progress: 'ನನ್ನ ಪ್ರಗತಿ', welcome: 'ಮತ್ತೆ ಸ್ವಾಗತ', tagline: 'ನಿಮ್ಮ ವೇಗಕ್ಕೆ ಹೊಂದುವ ಕಲಿಕಾ ಯೋಜನೆ.', start: 'ಅಭ್ಯಾಸ ಪ್ರಾರಂಭಿಸಿ', weak: 'ಸುಧಾರಿಸಬೇಕಾದ ವಿಷಯಗಳು', recent: 'ಇತ್ತೀಚಿನ ಅಭ್ಯಾಸ', hours: 'ಇಂದು ಓದಲು ಲಭ್ಯವಿರುವ ಸಮಯ', plan: 'ನನ್ನ ಯೋಜನೆ ರಚಿಸಿ', submit: 'ಉತ್ತರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ', next: 'ಮತ್ತೊಂದು ವಿಷಯ ಪ್ರಯತ್ನಿಸಿ', signout: 'ಸೈನ್ ಔಟ್', signin: 'ಸೈನ್ ಇನ್', create: 'ಖಾತೆ ತೆರೆಯಿರಿ' },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => { api('/auth/me').then((data) => setUser(data.user)).catch(() => {}).finally(() => setChecking(false)); }, []);
  const t = words[user?.language || 'en'];
  async function signOut() { await api('/auth/logout', { method: 'POST' }); setUser(null); navigate('/'); }
  if (checking) return <div className="loading">Opening your learning space…</div>;
  return <div className="app-shell">
    <header className="topbar"><Link className="brand" to={user ? '/dashboard' : '/'}><span className="brand-mark">L</span> Learn<span className="brand-accent">X</span></Link>
      {user && <nav><Link to="/dashboard">{t.home}</Link><Link to="/practice">{t.practice}</Link><Link to="/progress">{t.progress}</Link></nav>}
      {user && <div className="top-actions"><select aria-label="Choose language" value={user.language} onChange={async (e) => { const d = await api('/profile/language', { method: 'PUT', body: JSON.stringify({ language: e.target.value }) }); setUser(d.user); }}><option value="en">English</option><option value="hi">हिन्दी</option><option value="kn">ಕನ್ನಡ</option></select><button className="text-button" onClick={signOut}>{t.signout}</button></div>}
    </header>
    {error && <div className="toast" role="alert">{error}<button onClick={() => setError('')}>×</button></div>}
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthPage onLogin={setUser} />}/>
      <Route path="/dashboard" element={user ? <Dashboard user={user} t={t} setError={setError}/> : <Navigate to="/"/>}/>
      <Route path="/practice" element={user ? <Practice t={t} setError={setError}/> : <Navigate to="/"/>}/>
      <Route path="/progress" element={user ? <Progress t={t}/> : <Navigate to="/"/>}/>
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} />}/>
    </Routes>
    <footer>LearnX · Small steps add up. <span>Private by design · Your learning data belongs to you.</span></footer>
  </div>;
}

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('register'); const [form, setForm] = useState({ name: '', email: '', password: '' }); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(e) { e.preventDefault(); setError(''); setBusy(true); try { const result = await api(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(form) }); onLogin(result.user); } catch (err) { setError(err.message); } finally { setBusy(false); } }
  return <main className="auth-layout"><section className="hero-copy"><p className="eyebrow">SMART · INCLUSIVE · PERSONALIZED</p><h1>Learn at your pace.<br/><span>Grow with confidence.</span></h1><p className="hero-description">Spot learning gaps, practise one step at a time, and see your progress grow.</p><div className="feature-pills"><span>✦ Personal study plan</span><span>✓ Helpful feedback</span><span>◉ Private progress</span></div><div className="quote-card"><span className="quote-icon">✳</span><p>Every learner is different.<br/><b>Your next step starts here.</b></p><span className="quote-spark">✦</span></div></section>
    <section className="auth-card"><span className="card-kicker">YOUR LEARNING SPACE</span><h2>{mode === 'register' ? 'Create your account' : 'Welcome back'}</h2><p className="muted">{mode === 'register' ? 'Let’s make your learning plan.' : 'Sign in to continue learning.'}</p><form onSubmit={submit}>{mode === 'register' && <label>Your name<input autoComplete="name" required minLength="2" maxLength="60" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Asha Rao"/></label>}<label>Email address<input type="email" autoComplete="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label>Password<input type="password" autoComplete={mode==='register'?'new-password':'current-password'} required minLength={mode==='register'?8:1} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder={mode==='register'?'At least 8 characters':'Your password'}/></label>{error&&<p className="form-error" role="alert">{error}</p>}<button className="primary full" disabled={busy}>{busy?'Please wait…':mode==='register'?'Create my account':'Sign in'} <span>→</span></button></form><p className="switch-mode">{mode==='register'?'Already have an account?':'New to LearnX?'} <button onClick={()=>{setMode(mode==='register'?'login':'register');setError('');}}>{mode==='register'?'Sign in':'Create account'}</button></p><p className="privacy-note">🔒 Your practice history stays private to your account.</p></section></main>;
}

function Dashboard({ user, t, setError }) {
  const [data, setData] = useState(null); const [hours, setHours] = useState(1);
  useEffect(() => { Promise.all([api('/progress'),api('/topics')]).then(([progress,topicData])=>setData({...progress,topics:topicData.topics})).catch(e=>setError(e.message)); }, []);
  if (!data) return <div className="loading">Preparing your plan…</div>;
  const byTopic = new Map(data.summary.map((x)=>[x.topic,x]));
  const weakest = data.topics.map(topic=>({topic,...(byTopic.get(topic)||{percent:null,tries:0})})).sort((a,b)=>(a.percent??0)-(b.percent??0));
  const minutePlan = Math.round(Number(hours)*60); const focus = weakest[0]?.topic;
  return <main className="page"><div className="welcome-row"><div><p className="eyebrow">YOUR LEARNING SPACE</p><h1>{t.welcome}, {user.name.split(' ')[0]} <span className="wave">✦</span></h1><p className="muted">{t.tagline}</p></div><span className="avatar">{user.name[0].toUpperCase()}</span></div>
    <section className="plan-card"><div className="plan-copy"><span className="card-kicker">YOUR NEXT SMALL STEP</span><h2>{focus ? `Let’s practise ${focus.toLowerCase()}` : 'Start with a quick learning check-in'}</h2><p>{focus && byTopic.has(focus) ? `Your recent average is ${byTopic.get(focus).percent}%. A short practice can help strengthen this topic.` : 'Try a short practice in any topic. We’ll use your results to suggest what to study next.'}</p><Link className="primary link-button" to="/practice">{t.start} <span>→</span></Link></div><div className="plan-art"><div className="art-sun">✦</div><div className="art-book">▰<br/><small>LEARN</small></div><div className="art-dot one">✳</div><div className="art-dot two">●</div><div className="art-line"></div></div></section>
    <div className="section-heading"><div><p className="eyebrow">YOUR LEARNING SNAPSHOT</p><h2>{t.weak}</h2></div><Link to="/progress" className="subtle-link">View progress →</Link></div><div className="topic-grid">{weakest.map((item,i)=><div className="topic-card" key={item.topic}><div className={`topic-icon color-${i%3}`}>{['½','x²','Aa'][i%3]}</div><div className="topic-title">{item.topic}</div><div className="progress-line"><i style={{width:`${item.percent??0}%`}}/></div><div className="topic-meta">{item.tries?`${item.percent}% average`:'Not practised yet'}<Link to={`/practice?topic=${encodeURIComponent(item.topic)}`}>Practise →</Link></div></div>)}</div>
    <section className="study-card"><div className="study-icon">◷</div><div className="study-text"><h3>{t.hours}</h3><p>We’ll suggest a simple focus plan that fits the time you have.</p></div><div className="hours-control"><select value={hours} onChange={e=>setHours(e.target.value)} aria-label={t.hours}>{[0.5,1,1.5,2,3].map(v=><option key={v} value={v}>{v<1?'30 minutes':`${v} ${v===1?'hour':'hours'}`}</option>)}</select><Link to={`/practice?topic=${encodeURIComponent(focus||data.topics[0])}`} className="plan-link">{t.plan} →</Link></div></section>
    <section className="recent-card"><div className="section-heading compact"><div><p className="eyebrow">KEEP IT GOING</p><h2>{t.recent}</h2></div><Link to="/progress" className="subtle-link">See all →</Link></div>{data.attempts.length===0?<div className="empty-state">Your practice sessions will show up here. Start a short quiz when you’re ready.</div>:data.attempts.slice(0,3).map(a=><div className="recent-row" key={a.id}><span className="result-check">✓</span><span>{a.topic}</span><span className="recent-score">{a.score}/{a.total} correct</span><span className="muted">{new Date(a.createdAt+'Z').toLocaleDateString()}</span></div>)}</section>
  </main>;
}

function Practice({ t, setError }) {
  const [topics,setTopics]=useState([]); const [topic,setTopic]=useState(new URLSearchParams(location.search).get('topic')||''); const [quiz,setQuiz]=useState(null); const [answers,setAnswers]=useState([]); const [result,setResult]=useState(null); const [busy,setBusy]=useState(false);
  useEffect(()=>{api('/topics').then(d=>{setTopics(d.topics);setTopic(old=>old||d.topics[0]);}).catch(e=>setError(e.message));},[]);
  useEffect(()=>{if(topic) api(`/quiz/${encodeURIComponent(topic)}`).then(d=>{setQuiz(d.questions);setAnswers(Array(d.questions.length).fill(-1));setResult(null);}).catch(e=>setError(e.message));},[topic]);
  async function submit(){if(answers.some(a=>a<0)){setError('Choose one answer for each question first.');return;}setBusy(true);try{setResult(await api(`/quiz/${encodeURIComponent(topic)}/submit`,{method:'POST',body:JSON.stringify({answers})}));}catch(e){setError(e.message);}finally{setBusy(false);}}
  if(!quiz)return <div className="loading">Loading practice…</div>;
  return <main className="page narrow"><p className="eyebrow">PRACTISE AND LEARN</p><h1>One topic at a time.</h1><p className="muted">Choose a topic, answer a few questions, and use the feedback to guide your next step.</p><label className="topic-select-label">Choose a topic<select value={topic} onChange={e=>setTopic(e.target.value)}>{topics.map(x=><option key={x}>{x}</option>)}</select></label>
    {result?<section className="result-card"><div className="result-medal">{result.score===result.total?'✦':'✓'}</div><p className="eyebrow">PRACTICE COMPLETE</p><h2>You got {result.score} out of {result.total}</h2><p className="muted">A score is a snapshot. Review the notes below and keep going.</p>{result.feedback.map((f,i)=><div className={`feedback-row ${f.correct?'correct':'review'}`} key={i}><b>{f.correct?'✓ Correct':'↻ Review'} · Question {i+1}</b><p>{f.explanation}</p></div>)}<button className="primary" onClick={()=>{setResult(null);setAnswers(Array(quiz.length).fill(-1));}}>{t.next} →</button></section>:<>{quiz.map((q,i)=><section className="question-card" key={i}><div className="question-number">QUESTION {i+1} OF {quiz.length}</div><h2>{q.question}</h2><div className="choice-list">{q.choices.map((choice,j)=><button key={j} className={`choice ${answers[i]===j?'selected':''}`} onClick={()=>setAnswers(answers.map((a,k)=>k===i?j:a))}><span className="choice-letter">{String.fromCharCode(65+j)}</span>{choice}</button>)}</div></section>)}<button className="primary submit-button" disabled={busy} onClick={submit}>{busy?'Checking…':t.submit} →</button></>}
  </main>;
}

function Progress({t}) {
  const [data,setData]=useState(null);const [error,setError]=useState('');
  useEffect(()=>{api('/progress').then(setData).catch(e=>setError(e.message));},[]);
  if(error)return <main className="page"><p className="form-error">{error}</p></main>;if(!data)return <div className="loading">Loading your progress…</div>;
  const summary=new Map(data.summary.map(x=>[x.topic,x]));
  return <main className="page"><p className="eyebrow">YOUR EFFORT, OVER TIME</p><h1>{t.progress}</h1><p className="muted">Use these results as a guide to what you might practise next.</p><div className="progress-overview">{data.topics.map((topic,i)=>{const item=summary.get(topic);return <section className="overview-card" key={topic}><div className={`topic-icon color-${i%3}`}>{['½','x²','Aa'][i%3]}</div><h3>{topic}</h3><div className="big-score">{item?`${item.percent}%`:'—'}</div><p>{item?`${item.tries} practice ${item.tries===1?'session':'sessions'}`:'No sessions yet'}</p><div className="progress-line"><i style={{width:`${item?.percent??0}%`}}/></div></section>})}</div><section className="recent-card"><div className="section-heading compact"><div><p className="eyebrow">YOUR SESSIONS</p><h2>Practice history</h2></div></div>{data.attempts.length===0?<div className="empty-state">Complete a practice session to start your progress history.</div>:data.attempts.map(a=><div className="recent-row" key={a.id}><span className="result-check">✓</span><span>{a.topic}</span><span className="recent-score">{a.score}/{a.total} correct</span><span className="muted">{new Date(a.createdAt+'Z').toLocaleString()}</span></div>)}</section></main>;
}
