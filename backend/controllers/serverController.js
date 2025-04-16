import Server from '../models/serverModel.js';
import generateInviteCode from '../utils/generateInviteCode.js';

export const createServer = async (req, res) => {
  const { name, userId } = req.body;

  try {
    const inviteCode = generateInviteCode();

    const newServer = await Server.create({
      name,
      owner: userId,
      inviteCode,
      members: [userId], // owner is first member
      channels: [{ name: 'general' }],
    });

    res.status(201).json(newServer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating server', error: error.message });
  }
};
