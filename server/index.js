const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const { sequelize } = require('./models');
sequelize.sync({ alter: true }).then(() => console.log('Database synced'));

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CollabFlow API running' });
});

const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');
const cardRoutes = require('./routes/cards');

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/cards', cardRoutes);

io.on('connection', (socket) => {
  socket.on('join-board', (boardId) => {
    socket.join(boardId);
  });
  socket.on('card-moved', (data) => {
    socket.to(data.boardId).emit('card-moved', data);
  });
  socket.on('card-created', (data) => {
    socket.to(data.boardId).emit('card-created', data);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});