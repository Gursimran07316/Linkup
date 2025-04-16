import React, { useState } from 'react';
import axios from '../api/axios';
import { FaTimes } from 'react-icons/fa';

const CreateChannelModal = ({ serverId, onClose, onCreated }) => {
  const [channelName, setChannelName] = useState('');

  const handleCreate = async () => {
    if (!channelName.trim()) return;

    try {
      const { data } = await axios.post('/servers/channel', {
        serverId,
        channelName,
      });

      onCreated(data); // updates the server in UI
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create channel');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4">Create a Channel</h2>
        <input
          type="text"
          placeholder="channel-name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-sm"
        />
        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 hover:bg-blue-700 mt-4 py-2 rounded font-medium"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateChannelModal;
