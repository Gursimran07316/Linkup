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
    origin: 'http://localhost:5173', // your frontend port
    methods: ['GET', 'POST'],
  },
});

// In-memory storage
let messages = [];

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send existing messages to new client
  socket.emit('initialMessages', messages);

  // Listen for new messages
  socket.on('sendMessage', (messageData) => {
    const newMessage = {
      id: messages.length + 1,
      username: messageData.username,
      avatar:
        messageData.avatar ||
        'https://api.dicebear.com/7.x/identicon/svg?seed=random',
      message: messageData.message,
      timestamp: new Date(),
    };

    messages.push(newMessage);

    // Broadcast new message to all clients
    io.emit('receiveMessage', newMessage);
  });

  // Typing event
  socket.on('typing', (data) => {
    socket.broadcast.emit('userTyping', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
