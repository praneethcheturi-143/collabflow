const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const { sequelize } = require('./models');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

sequelize.sync({ alter: true }).then(() => console.log('Database synced'));

app.get('/', (req, res) => {
  res.json({ message: 'CollabFlow API running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');
const cardRoutes = require('./routes/cards');

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/cards', cardRoutes);

const boardUsers = {};

io.on('connection', (socket) => {
  socket.on('join-board', ({ boardId, username }) => {
    socket.join(boardId);
    socket.data.boardId = boardId;
    socket.data.username = username;
    if (!boardUsers[boardId]) boardUsers[boardId] = [];
    if (!boardUsers[boardId].includes(username)) {
      boardUsers[boardId].push(username);
    }
    io.to(boardId).emit('board-users', boardUsers[boardId]);
  });

  socket.on('leave-board', ({ boardId, username }) => {
    if (boardUsers[boardId]) {
      boardUsers[boardId] = boardUsers[boardId].filter(u => u !== username);
      io.to(boardId).emit('board-users', boardUsers[boardId]);
    }
  });

  socket.on('card-moved', (data) => {
    socket.to(data.boardId).emit('card-moved', data);
  });

  socket.on('card-created', (data) => {
    socket.to(data.boardId).emit('card-created', data);
  });

  socket.on('disconnect', () => {
    const { boardId, username } = socket.data;
    if (boardId && username && boardUsers[boardId]) {
      boardUsers[boardId] = boardUsers[boardId].filter(u => u !== username);
      io.to(boardId).emit('board-users', boardUsers[boardId]);
    }
  });
});

const PORT = process.env.PORT || 3001;
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});