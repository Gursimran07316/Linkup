import React, { useState } from 'react';
import axios from '../api/axios';
import { GlobalContext } from '../context/GlobalState';
import { useContext } from 'react';

const RenameChannelModal = ({ serverId, channel, onClose }) => {
  const [newName, setNewName] = useState(channel.name);
  const { handleRename } = useContext(GlobalContext);

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-sm shadow-lg relative">
        <h2 className="text-2xl font-bold mb-6 text-center">Rename Channel</h2>

        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 mb-4"
          placeholder="New Channel Name"
        />

        <div className="flex justify-between">
          <button
            onClick={()=>handleRename(newName,channel,onClose)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold"
          >
            Cancel
          </button>
        </div>

        {/* Close button top right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default RenameChannelModal;
