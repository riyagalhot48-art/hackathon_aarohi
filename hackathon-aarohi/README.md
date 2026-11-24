# Aarohi: Hackathon Project

Team Code Divas | B.Tech CSE, Section E | K.R. Mangalam University

## Folders
- `frontend/` : the website (HTML, CSS, JavaScript)
- `backend/`  : Node.js + Express API
  - `server.js` routes, `data.js` content, `db/schema.sql` future PostgreSQL tables

## What is inside
Public page (`index.html`): overview, live planner demo, career roadmap preview, wellness preview.
Members area (`app.html`, login required):
- Dashboard with progress, today's classes and the next topic to study
- Notes: 8 subjects, 24 topics, with "mark as done" tracking
- Lectures: weekly timetable, lecture plan per subject, practice tasks, learning resources
- AI Mentor: study and career coach
- AI HealthCare: separate wellbeing-education assistant (never diagnoses, has emergency and crisis safety replies)

Edit subjects, notes and the timetable in `backend/content.js`.

## Turn on full AI answers
Without a key, both assistants run in "basic mode" using built-in content. For full AI answers,
put `ANTHROPIC_API_KEY=your-key` in `backend/.env` and restart. Get a key at console.anthropic.com.
Keep the key on the server only. Never put it in the frontend.

## Login and sign up
Pages: `frontend/signup.html` and `frontend/login.html`. Accounts are saved in `backend/users.json`
(passwords hashed with bcrypt, sessions use a 7-day JWT). Copy `.env.example` to `.env` and set `JWT_SECRET`.
For real use, move users into PostgreSQL (`db/schema.sql`) or switch to Firebase Auth.

## Run it
Needs Node.js 18 or newer.

    cd backend
    npm install
    npm start

Open http://localhost:5000 (the backend also serves the frontend).

## API
| Method | Route | Returns |
|---|---|---|
| POST | /api/auth/signup | create account (name, email, password), returns token |
| POST | /api/auth/login | log in (email, password), returns token |
| GET | /api/auth/me | current user (send `Authorization: Bearer <token>`) |
| GET | /api/subjects | notes for all subjects (login required) |
| GET | /api/lectures | lecture plans and timetable (login required) |
| POST | /api/mentor | AI Mentor reply (login required) |
| POST | /api/health-ai | AI HealthCare reply (login required) |
| GET | /api/health | server status |
| GET | /api/plan/:energy | daily plan (good, ok, low) |
| GET | /api/roles | all career roadmaps |
| GET | /api/roles/:name | one roadmap |
| GET | /api/topics | AshaCare wellness topics |

## Next steps from the pitch deck
PostgreSQL storage for users (schema provided), Firebase Auth option, AI career mentor chat
with trusted-source retrieval, resume analyzer, opportunity finder, React + Tailwind frontend.
