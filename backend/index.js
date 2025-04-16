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

// Define static channels for now (later we will make this dynamic)
let channels = ['general', 'welcome', 'coding', 'collab'];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Default room
  let currentRoom = 'general';
  socket.join(currentRoom);

  // Load existing messages from MongoDB when connected
  const loadMessages = async (room) => {
    try {
      const messages = await Message.find({ channel: room });
      socket.emit('initialMessages', messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  loadMessages(currentRoom);

  // Switch channel
  socket.on('joinChannel', async (newChannel) => {
    if (!channels.includes(newChannel)) {
      console.log(`Invalid channel: ${newChannel}`);
      return;
    }

    socket.leave(currentRoom);
    currentRoom = newChannel;
    socket.join(currentRoom);
    console.log(`User ${socket.id} switched to ${currentRoom}`);

    loadMessages(currentRoom);
  });

  // Handle new messages
  socket.on('sendMessage', async (messageData) => {
    try {
      const newMessage = await Message.create({
        channel: currentRoom,
        username: messageData.username,
        avatar: messageData.avatar,
        message: messageData.message,
      });

      io.to(currentRoom).emit('receiveMessage', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(currentRoom).emit('userTyping', data);
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
