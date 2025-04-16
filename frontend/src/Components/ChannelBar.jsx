import React, { useState } from 'react';
import { FaAngleDown, FaUserPlus, FaPlus, FaTrash, FaCog } from 'react-icons/fa';
import InviteModal from './InviteModal'; 
import CreateChannelModal from './CreateChannelModal';

const ChannelBar = ({ currentChannel, setCurrentChannel, server }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div className="w-60 bg-gray-850 p-4 bg-gray-800 relative">
      {/* Server Title */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 rounded"
        onClick={toggleDropdown}
      >
        <h2 className="text-lg font-semibold truncate">{server.name}</h2>
        <FaAngleDown />
      </div>

      {/* Dropdown Options */}
      {showDropdown && (
        <div className="absolute z-50 left-4 top-20 w-52 bg-gray-900 border border-gray-700 rounded shadow-lg text-sm overflow-hidden">
          <div
            onClick={() => {
              setShowInviteModal(true);
              setShowDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 cursor-pointer"
          >
            <FaUserPlus /> Invite People
          </div>

          <div
          onClick={() => {
            setShowChannelModal(true);
            setShowDropdown(false);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 cursor-pointer">
            <FaPlus /> Create Channel
          </div>

          <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 cursor-pointer">
            <FaCog /> Server Settings
          </div>

          <div className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white cursor-pointer">
            <FaTrash /> Delete Server
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          inviteCode={server.inviteCode}
          onClose={() => setShowInviteModal(false)}
        />
      )}
      {/* Channel Modal */}
      {showChannelModal && (
  <CreateChannelModal
    serverId={server._id}
    onClose={() => setShowChannelModal(false)}
    onCreated={(updatedServer) => {
      server.channels = updatedServer.channels;
    }}
  />
)}

      {/* Channel List */}
      <div className="mt-4">
        <h3 className="text-gray-400 uppercase text-xs">Text Channels</h3>
        {server.channels.map((channel) => (
          <div
            key={channel.name}
            onClick={() => setCurrentChannel(channel.name)}
            className={`mt-2 p-2 rounded-md flex items-center justify-between cursor-pointer ${
              currentChannel === channel.name
                ? 'bg-gray-700'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <span>#{channel.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelBar;
