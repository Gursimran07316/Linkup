import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import CreateServerModal from './CreateServerModal';
import axios from '../api/axios';
import UserProfileModal from './UserProfileModal';

const Sidebar = ({ user ,selectedServer, setSelectedServer }) => {
  const [showModal, setShowModal] = useState(false);
  const [servers, setServers] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  // Fetch all servers the user is a member of
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const { data } = await axios.get(`/servers?userId=${user._id}`);
        setServers(data);
      } catch (err) {
        console.error('Error loading servers:', err);
      }
    };

    fetchServers();
  }, [user]);

  // Add new server to sidebar
  const handleServerCreated = (newServer) => {
    setServers((prev) => [...prev, newServer]);
  };

  // Delete a server (only if user is owner)
  const handleDeleteServer = async (serverId, serverName) => {
    const confirm = window.confirm(`Are you sure you want to delete "${serverName}"?`);
    if (!confirm) return;

    try {
      await axios.delete(`/servers/${serverId}`, {
        data: { userId: user._id },
      });
      setServers((prev) => prev.filter((s) => s._id !== serverId));
    } catch (err) {
      alert('Failed to delete server.');
    }
  };

  return (
    <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
      {/* Create New Server */}
      <div className="py-4 border-b border-gray-700">
        <div
          onClick={() => setShowModal(true)}
          className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-3xl text-green-500 cursor-pointer hover:bg-gray-600 transition"
          title="Create Server"
        >
          <FaPlus size={20} />
        </div>
      </div>

      {/* Render All Joined/Owned Servers */}
      {servers.map((srv) => (
        <div key={srv._id} className="relative group" title={srv.name} onClick={() => setSelectedServer(srv)}        >
          {srv.icon ? (
            <img
              src={srv.icon}
              alt={srv.name}
              className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-sm text-white">
              {srv.name[0].toUpperCase()}
            </div>
          )}

          {/* Delete Icon */}
          {srv.owner === user._id && (
            <button
              onClick={() => handleDeleteServer(srv._id, srv.name)}
              className="absolute -top-1.5 -right-1.5 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
              title="Delete Server"
            >
              ✖
            </button>
          )}
        </div>
      ))}

      {/* User Avatar at Bottom */}
      <div className="mt-auto mb-4">
        <img
          src={user.avatar}
          alt="Your Avatar"
          className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80"
          onClick={() => setShowProfile(true)}
        />
      </div>

      {/* Modal for Server Creation */}
      {showModal && (
        <CreateServerModal
          user={user}
          onClose={() => setShowModal(false)}
          onCreated={handleServerCreated}
        />
      )}
      {showProfile && (
  <UserProfileModal
    user={user}
    onClose={() => setShowProfile(false)}
    onLogout={() => {
      localStorage.removeItem('userInfo');
      window.location.reload(); // Or navigate('/') if using router
    }}
  />
)}
    </div>
  );
};

export default Sidebar;
