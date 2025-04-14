import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
  channel: { type: String, required: true },
  username: { type: String, required: true },
  avatar: { type: String },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
