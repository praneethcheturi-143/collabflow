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
- Multi-User collaboration on the same board simultaneously
- Cloud PostgreSQL database on Neon with optimised indexed queries
- Dockerised full stack with Docker Compose
- Auto CI/CD — deploys to Vercel on every GitHub push

---

## Tech Stack

### Frontend
- React 18
- React Router v6
- Socket.io Client
- @hello-pangea/dnd
- Axios

### Backend
- Node.js + Express.js
- Socket.io
- Sequelize ORM
- PostgreSQL (Neon Cloud)
- JWT + bcryptjs
- Joi validation

### DevOps
- Docker + Docker Compose
- GitHub Actions CI/CD
- Render (backend hosting)
- Vercel (frontend hosting)

---

## Database Schema

Users --> Boards --> Columns --> Cards

- Users have many Boards
- Boards have many Columns
- Columns have many Cards

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

---

## Real-Time WebSocket Events

- join-board — client joins a board room
- card-moved — card dragged to new column, broadcast to all users
- card-created — new card added, broadcast to all users

---

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/praneethcheturi-143/collabflow.git
cd collabflow
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file:

PORT=3001

JWT_SECRET=your_jwt_secret

DATABASE_URL=your_postgresql_url

```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../client
npm install
npm start
```

### 4. Run with Docker
```bash
docker-compose up
```

---

## Project Structure

collabflow/

├── client/

│   ├── src/

│   │   ├── api/

│   │   ├── pages/

│   │   └── App.js

│   └── package.json

├── server/

│   ├── config/

│   ├── middleware/

│   ├── models/

│   ├── routes/

│   └── index.js

└── README.md

---

## Author

**Venkata Praneeth Cheturi**

- GitHub: https://github.com/praneethcheturi-143
- LinkedIn: https://linkedin.com/in/g-b-harshavardhan
- Email: praneethcheturi@gmail.com

---

## License

MIT License