import React from 'react';
import { FaTimes, FaSignOutAlt } from 'react-icons/fa';

const UserProfileModal = ({ user, onClose, onLogout }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-sm relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FaTimes />
        </button>

        <div className="flex flex-col items-center gap-3">
          <img
            src={user.avatar}
            alt="User avatar"
            className="w-24 h-24 rounded-full border-4 border-gray-700 object-cover"
          />
          <h2 className="text-xl font-semibold">{user.username}</h2>
          <p className="text-sm text-gray-400">{user.email}</p>

          <button
            onClick={onLogout}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded flex items-center gap-2"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
