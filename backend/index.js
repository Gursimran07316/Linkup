import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

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

// In-memory storage of messages by channel
let channels = {
  general: [],
  welcome: [],
  coding: [],
  collab: [],
};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Default join general channel
  let currentRoom = 'general';
  socket.join(currentRoom);

  // Send existing messages for the channel
  socket.emit('initialMessages', channels[currentRoom]);

  // Switch channel
  socket.on('joinChannel', (newChannel) => {
    socket.leave(currentRoom);
    currentRoom = newChannel;
    socket.join(currentRoom);
    console.log(`User ${socket.id} switched to ${currentRoom}`);

    socket.emit('initialMessages', channels[currentRoom] || []);
  });

  // Send message to the current channel
  socket.on('sendMessage', (messageData) => {
    const newMessage = {
      id: channels[currentRoom].length + 1,
      username: messageData.username,
      avatar:
        messageData.avatar ||
        'https://api.dicebear.com/7.x/identicon/svg?seed=random',
      message: messageData.message,
      timestamp: new Date(),
    };

    channels[currentRoom].push(newMessage);

    io.to(currentRoom).emit('receiveMessage', newMessage);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(currentRoom).emit('userTyping', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
