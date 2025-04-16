import Server from '../models/serverModel.js';
import generateInviteCode from '../utils/generateInviteCode.js';

 export const createServer = async (req, res) => {
    const { name, userId } = req.body;
    const icon = req.file ? `/uploads/${req.file.filename}` : '';
  
    try {
      const inviteCode = generateInviteCode();
  
      const newServer = await Server.create({
        name,
        owner: userId,
        inviteCode,
        icon,
        members: [userId],
        channels: [{ name: 'general' }],
      });
  
      res.status(201).json(newServer);
    } catch (error) {
      res.status(500).json({ message: 'Error creating server', error: error.message });
    }
  };
  
