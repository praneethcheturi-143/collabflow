---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL or Neon account
- Docker (optional)

### 1. Clone the repository
```bash
git clone https://github.com/praneethcheturi-143/collabflow.git
cd collabflow
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create `.env` file:
```env
PORT=3001
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_postgresql_url
```

```bash
npm run dev
```

### 3. Set up the frontend
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

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://collabflow-seven.vercel.app |
| Backend API | https://collabflow-api.onrender.com |
| GitHub | https://github.com/praneethcheturi-143/collabflow |

---

## 📁 Project Structure



collabflow/

├── client/                 # React frontend

│   ├── src/

│   │   ├── api/           # Axios configuration

│   │   ├── pages/         # Login, Register, Dashboard, Board

│   │   └── App.js         # Routes

│   └── package.json

├── server/                 # Express backend

│   ├── config/            # Database config

│   ├── middleware/        # JWT auth middleware

│   ├── models/            # Sequelize models

│   ├── routes/            # API routes

│   └── index.js           # Server entry point

└── docker-compose.yml



---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Boards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | Get all boards |
| POST | `/api/boards` | Create board |
| GET | `/api/boards/:id` | Get board with columns and cards |
| DELETE | `/api/boards/:id` | Delete board |

### Cards
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cards` | Create card |
| PUT | `/api/cards/:id` | Update/move card |
| DELETE | `/api/cards/:id` | Delete card |

---

## ⚡ Real-Time Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-board` | Client → Server | Join a board room |
| `card-moved` | Bidirectional | Card dragged to new column |
| `card-created` | Bidirectional | New card added |

---

## 👨‍💻 Author

**Venkata Praneeth Cheturi**
- GitHub: [@praneethcheturi-143](https://github.com/praneethcheturi-143)
- Email: praneethcheturi@gmail.com

---

## 📄 License

MIT License — feel free to use this project for learning or inspiration.

---

<p align="center">Built with ❤️ by Venkata Praneeth Cheturi</p>