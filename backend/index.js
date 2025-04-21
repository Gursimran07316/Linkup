import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import Message from './models/messageModel.js';
import authRoutes from './routes/authRoutes.js';
import serverRoutes from './routes/serverRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Create HTTP server
const server = createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
connectDB();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));



io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  let currentRoom = '';
  let currentServer = '';
  let currentChannel = '';

  // Load messages from DB
  const loadMessages = async (serverId, channel) => {
    try {
      const messages = await Message.find({ serverId, channel }).sort('timestamp');
      socket.emit('initialMessages', messages);
    } catch (err) {
      console.error('Load error:', err.message);
    }
  };

  // Join a server/channel combo
  socket.on('joinChannel', async ({ serverId, channelName }) => {
    if (!serverId || !channelName) return;

    // Leave previous room
    if (currentRoom) socket.leave(currentRoom);

    currentServer = serverId;
    currentChannel = channelName;
    currentRoom = `${serverId}-${channelName}`;
    socket.join(currentRoom);

    console.log(`User ${socket.id} joined ${currentRoom}`);
    await loadMessages(serverId, channelName);
  });

  // Send message
  socket.on('sendMessage', async (data) => {
    if (!currentServer || !currentChannel) return;

    try {
      const newMessage = await Message.create({
        serverId: currentServer,
        channel: currentChannel,
        username: data.username,
        avatar: data.avatar,
        message: data.message,
      });

      io.to(currentRoom).emit('receiveMessage', newMessage);
    } catch (err) {
      console.error('Send error:', err.message);
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    if (currentRoom) {
      socket.to(currentRoom).emit('userTyping', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Auth route
app.use('/api/auth', authRoutes);
// Servers route
app.use('/api/servers', serverRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
