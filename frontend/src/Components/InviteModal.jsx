import React from 'react';
import { FaTimes, FaCopy, FaSync } from 'react-icons/fa';

const InviteModal = ({ inviteCode, onClose }) => {
  const inviteLink = `http://localhost:5173/invite/${inviteCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert('Invite link copied!');
    } catch (err) {
      alert('Failed to copy');
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

        <h2 className="text-xl font-semibold mb-4">Invite Friends</h2>

        <div className="bg-gray-800 rounded p-3 flex items-center justify-between mb-4">
          <input
            type="text"
            readOnly
            value={inviteLink}
            className="bg-transparent w-full mr-3 text-sm"
          />
          <button
            onClick={copyToClipboard}
            className="text-blue-400 hover:text-white"
          >
            <FaCopy />
          </button>
        </div>

        <div className="flex items-center text-sm text-gray-400 gap-2">
          <FaSync className="text-gray-500" />
          Generate a new link (coming soon)
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
