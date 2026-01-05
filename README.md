# CollabFlow 🚀

> A production-grade real-time collaborative task management platform — built to demonstrate full-stack engineering skills across WebSockets, REST APIs, authentication, database design, DevOps, and cloud deployment.

**Live:** [collabflow-seven.vercel.app](https://collabflow-seven.vercel.app) &nbsp;|&nbsp; **API:** [collabflow-api.onrender.com](https://collabflow-api.onrender.com) &nbsp;|&nbsp; **Repo:** [github.com/praneethcheturi-143/collabflow](https://github.com/praneethcheturi-143/collabflow)

![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/Node.js-18-green)
![React](https://img.shields.io/badge/React-18-61dafb)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791)
![Docker](https://img.shields.io/badge/Docker-ready-2496ed)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-black)

---

## Why this project exists

Task management tools like Trello and Jira handle real-time collaboration at scale — this project replicates that core engineering challenge from scratch. It demonstrates how WebSocket connections, REST APIs, PostgreSQL, and a React frontend fit together in a production system, including the security, DevOps, and performance considerations that separate a serious project from a tutorial clone.

---

## What it does

CollabFlow lets multiple users collaborate on Kanban boards in real-time. Every card move, comment, and status change is instantly broadcast to all connected users via Socket.io — no refresh needed.

### Feature set

| Category | Features |
|---|---|
| **Auth** | JWT authentication, bcrypt password hashing, role-based access control |
| **Boards** | Create/delete boards, 8 gradient color themes, search by name |
| **Kanban** | To Do / In Progress / Done columns, drag-and-drop card movement |
| **Cards** | Title, description, color labels (Urgent/Feature/Bug/Done), due dates |
| **Collaboration** | Comments with user avatars, checklists with progress bars |
| **Real-time** | All changes instantly broadcast via WebSockets (Socket.io) |
| **Presence** | Online presence indicator — see who is viewing the board live |
| **Analytics** | Dashboard showing total boards, cards, completion rate, overdue count |
| **UX** | Dark/light mode, loading skeletons, toast notifications, overdue highlighting |
| **Security** | Rate limiting (express-rate-limit), security headers (helmet.js), Joi validation |
| **DevOps** | Docker + docker-compose, GitHub Actions CI/CD, health check endpoint |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│            React 18 Frontend (Vercel)                │
│   React Router · Socket.io Client · Drag & Drop     │
└────────────┬──────────────────────────┬─────────────┘
             │ REST (Axios)             │ WebSocket
┌────────────▼──────────────────────────▼─────────────┐
│           Node.js + Express Backend (Render)          │
│   JWT Auth · Socket.io · Joi · helmet · rate-limit   │
└────────────┬──────────────────────────────────────────┘
             │ Sequelize ORM
┌────────────▼──────────────────────────────────────────┐
│            PostgreSQL — Neon Cloud                     │
│   Users · Boards · Cards · Comments · Checklists     │
└───────────────────────────────────────────────────────┘
```

### Real-time flow
```
User drags card → REST PUT /api/cards/:id → DB updated
                                          ↓
                              Socket.io broadcasts to all
                              connected board members
                                          ↓
                              All clients update instantly
```

---

## Tech stack

**Frontend**
- React 18, React Router v6
- Socket.io Client — real-time event handling
- @hello-pangea/dnd — drag-and-drop Kanban columns
- Axios — REST API calls
- react-hot-toast — action feedback notifications

**Backend**
- Node.js + Express.js
- Socket.io — WebSocket server
- Sequelize ORM — database abstraction layer
- PostgreSQL (Neon Cloud) — persistent storage with indexed queries
- JWT + bcryptjs — authentication and password security
- Joi — request validation
- helmet.js — HTTP security headers
- express-rate-limit — API abuse prevention

**DevOps**
- Docker + Docker Compose — containerised local development
- GitHub Actions — CI/CD pipeline (lint + build on every push)
- Render — backend hosting
- Vercel — frontend hosting with CI/CD from GitHub

---

## API endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + return JWT |

### Boards
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/boards` | Get all boards for authenticated user |
| POST | `/api/boards` | Create new board |
| GET | `/api/boards/:id` | Get board with all cards |
| DELETE | `/api/boards/:id` | Delete board |

### Cards
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/cards` | Create card on a board |
| PUT | `/api/cards/:id` | Update card (title, description, status, label, due date) |
| DELETE | `/api/cards/:id` | Delete card |
| GET | `/api/cards/:id/comments` | Get card comments |
| POST | `/api/cards/:id/comments` | Add comment |
| GET | `/api/cards/:id/checklist` | Get checklist items |
| POST | `/api/cards/:id/checklist` | Add checklist item |
| PUT | `/api/cards/:id/checklist/:itemId` | Toggle checklist item |
| DELETE | `/api/cards/:id/checklist/:itemId` | Delete checklist item |

### System
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server + DB status check |

---

## Database schema

```
Users
  id, email, password_hash, name, created_at

Boards
  id, title, color, owner_id → Users, created_at

Cards
  id, title, description, status, label, due_date,
  position, board_id → Boards, created_at

Comments
  id, text, user_id → Users, card_id → Cards, created_at

ChecklistItems
  id, text, completed, card_id → Cards, created_at
```

---

## Running locally

```bash
# Clone
git clone https://github.com/praneethcheturi-143/collabflow
cd collabflow

# Backend
cd server
npm install
cp ../.env.example .env   # fill in your values
npm run dev               # starts on :3001

# Frontend (new terminal)
cd client
npm install
npm start                 # starts on :3000

# Or run everything with Docker
docker-compose up --build
```

---

## Project structure

```
collabflow/
├── client/
│   ├── src/
│   │   ├── api/              # Axios API calls
│   │   ├── components/       # Reusable UI (Card, Modal, Sidebar…)
│   │   ├── pages/            # Board, Login, Register, Analytics
│   │   └── App.js            # Routing + Socket.io setup
│   └── package.json
├── server/
│   ├── config/               # DB connection, Sequelize config
│   ├── middleware/            # JWT auth, rate limiting, error handler
│   ├── models/               # Sequelize models (User, Board, Card…)
│   ├── routes/               # Express route handlers
│   └── index.js              # App entry + Socket.io server
├── .github/workflows/        # CI/CD — lint + build on push
├── .env.example              # Environment variable template
├── CONTRIBUTING.md           # Contribution guidelines
├── docker-compose.yml
└── README.md
```

---

## Engineering decisions

**Why Socket.io over raw WebSockets?**
Socket.io provides automatic reconnection, room-based broadcasting (per board), and fallback to long-polling — essential for a collaborative tool where users may have unstable connections.

**Why Sequelize over raw SQL?**
Sequelize enforces model consistency, handles migrations, and prevents SQL injection by default. For a project with multiple related models (User → Board → Card → Comment), the ORM abstraction significantly reduces boilerplate.

**Why Neon (serverless PostgreSQL)?**
Neon provides a serverless PostgreSQL instance that scales to zero — ideal for a portfolio project that needs a real production database without ongoing cost.

**Why GitHub Actions for CI/CD?**
Every push to `main` triggers an automated lint and build check. This mirrors the professional workflow used at engineering teams of any size, and catches broken builds before they reach production.

---

## Skills demonstrated

- **Full-stack JavaScript** — React 18 frontend + Node.js/Express backend in a monorepo
- **Real-time systems** — WebSocket event design, room-based broadcasting, online presence
- **Authentication** — JWT flow, bcrypt hashing, protected routes, middleware
- **Database design** — relational schema, Sequelize ORM, indexed queries, foreign keys
- **API design** — REST conventions, Joi validation, error handling, health checks
- **Security** — rate limiting, helmet.js headers, input sanitisation, CORS
- **DevOps** — Docker, docker-compose, GitHub Actions CI/CD, multi-service deployment
- **UX engineering** — drag-and-drop, loading skeletons, toast notifications, dark mode
- **Cloud deployment** — Render (Node.js backend), Vercel (React frontend)

---

*Built by Praneeth Cheturi — [github.com/praneethcheturi-143](https://github.com/praneethcheturi-143)*
