import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
  serverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Server',
  },
  channel: { type: String, required: true },
  username: { type: String, required: true },
  avatar: { type: String },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
