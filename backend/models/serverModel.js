import mongoose from 'mongoose';

const serverSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    icon: { type: String, default: '' },
    inviteCode: { type: String, required: true, unique: true },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    channels: [
      {
        name: String,
      },
    ],
  },
  { timestamps: true }
);

const Server = mongoose.model('Server', serverSchema);
export default Server;
