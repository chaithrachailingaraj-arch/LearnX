# LearnX: beginner full stack learning project

LearnX is a small educational website based on the objectives in the reference image. You can use it as a starting project in Visual Studio Code and change it as you learn.

## What this first version includes

- **Problem and users:** a learner dashboard designed for students who want clear, personal practice.
- **Gap finder:** short quizzes across fractions, basic algebra, and reading comprehension; topic averages help suggest what to practise.
- **Easy to use:** responsive layout, plain feedback, and interface labels in English, Hindi, and Kannada.
- **Data and privacy:** account sign-up/sign-in; each progress request is filtered by the signed-in account. Passwords are hashed before they are stored.
- **Track progress:** attempts are saved and displayed by topic and date.
- **Safe and responsible learning:** questions and explanations are teacher-reviewable examples, and feedback explains the answer. The app does not claim that a score is a diagnosis or use AI to make high-stakes decisions.

This is a local learning prototype. It does not yet include parent/teacher dashboards, translated quiz content, an AI service, or a production-grade session store. The language selector currently translates the main navigation and key labels; quiz questions remain in English.

## 1. Install the tools

Install a current Node.js LTS release and Visual Studio Code. In VS Code, open this project folder, then open **Terminal → New Terminal**.

Check that Node and npm are available:

```bash
node --version
npm --version
```

## 2. Install this project's packages

In the VS Code terminal, from the folder that contains `package.json`, run:

```bash
npm install
```

This installs React (the screens), Vite (the development website server), Express (the backend API), SQLite (the local database), and the supporting packages.

## 3. Start the website

```bash
npm run dev
```

Keep that terminal open. Visit the local address Vite prints, usually `http://localhost:5173`. Create an account, pick a topic, and submit a practice quiz. Vite forwards `/api` requests to the backend at `http://localhost:3001`.

To stop the two development servers, focus the terminal and press `Ctrl+C`.

## 4. Understand the folders

```text
LearnX/
├── index.html              # The browser page where React starts
├── package.json            # Project dependencies and run commands
├── vite.config.js           # Connects frontend API calls to Express in development
├── src/
│   ├── main.jsx             # Mounts the React app in index.html
│   ├── App.jsx              # Pages, forms, dashboard, practice, progress
│   ├── api.js               # Shared helper for calling the backend
│   └── style.css            # Colors, layout, and mobile styles
└── server/
    ├── index.js             # API routes and quiz rules
    └── db.js                # SQLite database and table definitions
```

## 5. Follow one request from screen to database

When a learner submits a quiz:

1. The quiz screen in `src/App.jsx` collects the selected answers.
2. It calls `api()` in `src/api.js` with `POST /api/quiz/<topic>/submit`.
3. `server/index.js` checks the signed-in session, grades the answers on the server, and saves the attempt.
4. `server/db.js` defines the `users` and `attempts` tables. The database file is created at `server/data/learnx.db` the first time the server starts.
5. The API sends the score and explanations back to React, which displays feedback.

Keeping the answer key on the server means the browser does not receive correct answers before the quiz is submitted.

## 6. Where to make common changes

- **Colors and mobile layout:** edit CSS variables near the top of `src/style.css` and the media queries at the bottom.
- **Add or edit a quiz:** change the `questions` object near the top of `server/index.js`. Each topic has three questions with four choices, a correct choice index, and an explanation. Choice indexes start at zero.
- **Add a translated interface label:** add the label to each language in the `words` object in `src/App.jsx` and use it on the page.
- **Add a database field:** update the table creation SQL in `server/db.js`, then update the API route in `server/index.js` that reads or writes that field.
- **Add a page:** create a React component in `src/App.jsx` and add a route inside `<Routes>`.

## 7. The frontend, backend, and database in plain language

- **Frontend:** React components in `src/` display the pages and respond to clicks. CSS makes them readable on phones and computers.
- **Backend:** Express routes in `server/index.js` receive requests, validate input, check the signed-in account, grade practice, and decide what data can be returned.
- **Database:** SQLite in `server/db.js` keeps account records and quiz attempts in a local file. Each attempt includes the user's ID, and progress queries filter by that ID.
- **Full stack:** the frontend calls the backend, and the backend reads or writes the database. Together they make the complete website.

## Before publishing to the internet

This starter is for learning locally. Before putting it on a public server, configure a long random `SESSION_SECRET`, use HTTPS, replace Express's default in-memory session store with a persistent store, add rate limits and CSRF protections, review privacy and child-safety requirements for your audience, and use a managed database with backups. Never commit real secrets or student data to Git. Do not enter real learner data into this local prototype.

## Helpful VS Code workflow

1. Keep the development terminal running with `npm run dev`.
2. Edit a file and save; Vite refreshes the browser automatically.
3. Change one small thing at a time, then try that feature in the browser.
4. Use the VS Code Explorer to locate files and the integrated terminal to run commands.
