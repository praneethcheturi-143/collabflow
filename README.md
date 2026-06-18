# CollabFlow

**A real-time collaborative task management platform built for modern teams.**

Live Demo: https://collabflow-seven.vercel.app
Backend API: https://collabflow-api.onrender.com
GitHub: https://github.com/praneethcheturi-143/collabflow

---

## Features

- JWT Authentication with bcrypt password hashing and role-based access control
- Kanban Boards with To Do / In Progress / Done columns
- Drag and Drop card movement powered by @hello-pangea/dnd
- Real-Time Sync — all changes instantly broadcast via WebSockets (Socket.io)
- Card Detail Modal — edit title, description, label, due date
- Comments — add comments on each card with user avatars
- Checklists — add subtasks with progress bar inside each card
- Card Labels — color-coded tags (Urgent, Feature, Bug, Done)
- Due Dates — overdue cards highlighted in red automatically
- Online Presence — see who is currently viewing the board
- Analytics Dashboard — total boards, cards, completion rate, overdue count
- Board Color Picker — choose from 8 gradient colors
- Dark/Light Mode — toggle theme with one click, persisted in localStorage
- Search — filter boards by name instantly
- Toast Notifications — real-time feedback on every action
- Board Deletion — with confirmation modal
- Loading Skeletons — shimmer effect while content loads
- Rate Limiting — API abuse prevention with express-rate-limit
- Security Headers — helmet.js for production security
- Health Check — /api/health returns server and DB status
- PostgreSQL cloud database (Neon) with optimised indexed queries
- Docker + Docker Compose support
- GitHub Actions CI/CD pipeline — auto lint and build on every push
- Deployed on Render (backend) + Vercel (frontend)

---

## Tech Stack

### Frontend
- React 18
- React Router v6
- Socket.io Client
- @hello-pangea/dnd (drag and drop)
- Axios
- react-hot-toast

### Backend
- Node.js + Express.js
- Socket.io
- Sequelize ORM
- PostgreSQL (Neon Cloud)
- JWT + bcryptjs
- Joi validation
- helmet.js
- express-rate-limit

### DevOps
- Docker + Docker Compose
- GitHub Actions CI/CD
- Render (backend hosting)
- Vercel (frontend hosting)

---

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Boards
- GET /api/boards
- POST /api/boards
- GET /api/boards/:id
- DELETE /api/boards/:id

### Cards
- POST /api/cards
- PUT /api/cards/:id
- DELETE /api/cards/:id
- GET /api/cards/:id/comments
- POST /api/cards/:id/comments
- GET /api/cards/:id/checklist
- POST /api/cards/:id/checklist
- PUT /api/cards/:id/checklist/:itemId
- DELETE /api/cards/:id/checklist/:itemId

---

## Quick Start

### 1. Clone the repository
git clone https://github.com/praneethcheturi-143/collabflow.git
cd collabflow

### 2. Backend setup
cd server
npm install

Create a .env file:
PORT=3001
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_postgresql_url

npm run dev

### 3. Frontend setup
cd ../client
npm install
npm start

### 4. Run with Docker
docker-compose up

---

## Project Structure

collabflow/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
├── server/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
├── .github/workflows/
├── docker-compose.yml
└── README.md

---

## Author

Venkata Praneeth Cheturi

- GitHub: https://github.com/praneethcheturi-143
- Email: praneethcheturi@gmail.com

---

## License

MIT License