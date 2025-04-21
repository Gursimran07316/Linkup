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
  
  export const getUserServers = async (req, res) => {
    const { userId } = req.query;
    try {
      const servers = await Server.find({ members: userId });
      res.json(servers);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch servers' });
    }
  };
  export const deleteServer = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
  
    try {
      const server = await Server.findById(id);
      if (!server) return res.status(404).json({ message: 'Server not found' });
  
      if (server.owner.toString() !== userId)
        return res.status(403).json({ message: 'Not authorized to delete' });
  
      await server.deleteOne();
      res.status(200).json({ message: 'Server deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Delete failed' });
    }
  };
  
  export const addChannel = async (req, res) => {
    const { serverId, channelName } = req.body;
  
    if (!serverId || !channelName) {
      return res.status(400).json({ message: 'Server ID and channel name required' });
    }
  
    try {
      const server = await Server.findById(serverId);
      if (!server) return res.status(404).json({ message: 'Server not found' });
  
      // prevent duplicates
      if (server.channels.find((ch) => ch.name === channelName)) {
        return res.status(400).json({ message: 'Channel already exists' });
      }
  
      server.channels.push({ name: channelName });
      await server.save();
  
      res.status(200).json(server);
    } catch (err) {
      res.status(500).json({ message: 'Failed to add channel', error: err.message });
    }
  };
  
  export const getServerByInvite = async (req, res) => {
    const { code } = req.params;
    try {
      const server = await Server.findOne({ inviteCode: code });
      if (!server) return res.status(404).json({ message: 'Invalid invite link' });
  
      res.json(server);
    } catch (err) {
      res.status(500).json({ message: 'Error finding server' });
    }
  };
  export const joinServer = async (req, res) => {
    const { code } = req.params;
    const { userId } = req.body;
  
    try {
      const server = await Server.findOne({ inviteCode: code });
      if (!server) return res.status(404).json({ message: 'Invite not found' });
  
      // Already a member?
      if (server.members.includes(userId)) {
        return res.status(200).json(server); // silently return
      }
  
      server.members.push(userId);
      await server.save();
  
      res.status(200).json(server);
    } catch (err) {
      res.status(500).json({ message: 'Failed to join', error: err.message });
    }
  };
    