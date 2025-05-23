import Server from '../models/serverModel.js';
import generateInviteCode from '../utils/generateInviteCode.js';

 export const createServer = async (req, res) => {
    const { name, userId } = req.body;
    const icon = req.file ? req.file.path : '';
    try {
      const inviteCode = generateInviteCode();
  
      const newServer = await Server.create({
        name,
        owner: userId,
        inviteCode,
        icon,
        members: [userId],
        channels: [{ name: 'general' }],
        admin:userId
      });
  
      res.status(201).json(newServer);
    } catch (error) {
      res.status(500).json({ message: 'Error creating server', error: error.message });
    }
  };
  
  export const getUserServers = async (req, res) => {
    const { userId } = req.query;
    try {
      const servers = await Server.find({ members: userId })
      .populate('members', 'username avatar')
      .populate('admin', 'username avatar');
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
  
      const populatedServer = await Server.findById(serverId)
      .populate('members', 'username avatar')
      .populate('admin', 'username avatar');

    res.status(200).json(populatedServer);
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
      const populatedServer = await Server.findById(server._id)
      .populate('members', 'username avatar')
      .populate('admin', 'username avatar')
      res.status(200).json(populatedServer);
    } catch (err) {
      res.status(500).json({ message: 'Failed to join', error: err.message });
    }
  };
  export const kickMember = async (req, res) => {
    const { serverId, userId } = req.params;
    const { adminId } = req.body; 
  
    try {
      const server = await Server.findById(serverId);
      if (!server) return res.status(404).json({ message: 'Server not found' });
  
      // Only Admin can kick
      if (server.admin.toString() !== adminId) {
        return res.status(403).json({ message: 'Not authorized to kick members' });
      }
  
      // Remove user from members
      server.members = server.members.filter(
        (member) => member.toString() !== userId
      );
  
      await server.save();
  
      // Return updated server members
      res.json({ members: server.members });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };


// --- Rename a Channel ---
export const renameChannel = async (req, res) => {
  const { serverId, channelId } = req.params;
  const { newName, adminId } = req.body;

  try {
    const server = await Server.findById(serverId);
    if (!server) return res.status(404).json({ message: 'Server not found' });

    // Only admin can rename
    if (server.admin.toString() !== adminId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const channel = server.channels.id(channelId);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    channel.name = newName;
    await server.save();

    res.status(200).json({ channels: server.channels });
  } catch (err) {
    res.status(500).json({ message: 'Failed to rename channel', error: err.message });
  }
};

// --- Delete a Channel ---
export const deleteChannel = async (req, res) => {
  const { serverId, channelId } = req.params;
  const { adminId } = req.body;

  try {
    const server = await Server.findById(serverId);
    if (!server) return res.status(404).json({ message: 'Server not found' });

    // Only admin can delete
    if (server.admin.toString() !== adminId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const channel = server.channels.id(channelId);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    server.channels = server.channels.filter((ch) => ch._id.toString() !== channelId);
    await server.save();

    res.status(200).json({ channels: server.channels });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete channel', error: err.message });
    
  }
};

export const getServerById = async (req, res) => {
  try {
    const server = await Server.findById(req.params.id)
      .populate('members', 'username avatar')
      .populate('admin', 'username avatar');

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    res.status(200).json(server);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching server', error: err.message });
  }
};

export const leaveServer = async (req, res) => {
  const { serverId } = req.params;
  const { userId } = req.body;

  try {
    const server = await Server.findById(serverId);
    if (!server) return res.status(404).json({ message: 'Server not found' });

    // Prevent admin from leaving (optional)
    if (server.admin.toString() === userId) {
      return res.status(403).json({ message: "Admin cannot leave the server." });
    }

    // Remove user from members
    server.members = server.members.filter((id) => id.toString() !== userId);
    await server.save();

    res.status(200).json({ message: 'Left server successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to leave server', error: error.message });
  }
};
