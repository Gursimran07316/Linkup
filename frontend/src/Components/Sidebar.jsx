import React, { useState, useEffect, useContext } from 'react';
import { FaPlus } from 'react-icons/fa';
import CreateServerModal from './CreateServerModal';
import UserProfileModal from './UserProfileModal';
import { GlobalContext } from '../context/GlobalState';

const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const {
    user,
    servers,
    selectedServer,
    setServer,
    fetchServers,
    logoutUser,
    setChannel,
    handleDeleteServer
  } = useContext(GlobalContext);

  useEffect(() => {
    if (user) {
      fetchServers(user._id);
    }
    console.log(user);
  }, [user]);

  const handleServerCreated = () => {
    // After creating server, just refetch
    fetchServers(user._id);
  };

  return (
    <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
      {/* Create New Server Button */}
      <div className="py-4 border-b border-gray-700">
        <div
          onClick={() => setShowModal(true)}
          className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-3xl text-green-500 cursor-pointer hover:bg-gray-600 transition"
          title="Create Server"
        >
          <FaPlus size={20} />
        </div>
      </div>

      {/* Server List */}
      {servers.map((srv) => (
        <div key={srv._id} className="relative group" title={srv.name}  
         onClick={() => {setServer(srv);
          if (srv.channels && srv.channels.length > 0) {
            const generalChannel = srv.channels.find((ch) => ch.name.toLowerCase() === 'general');
            if (generalChannel) {
              setChannel(generalChannel.name);
            } else {
              setChannel(srv.channels[0].name); // fallback: first channel
            }
          }
        }} >
          {srv.icon ? (
            <img
              src={srv.icon}
              alt={srv.name}
              className={`w-12 h-12 rounded-full cursor-pointer hover:opacity-80 ${
                selectedServer?._id === srv._id ? 'ring-2 ring-green-500' : ''
              }`}
            />
          ) : (
            <div
              className={`w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-sm text-white cursor-pointer ${
                selectedServer?._id === srv._id ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {srv.name[0].toUpperCase()}
            </div>
          )}

          {/* Delete Button if User is Owner */}
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

      {/* Create Server Modal */}
      {showModal && (
        <CreateServerModal
          user={user}
          onClose={() => setShowModal(false)}
          onCreated={handleServerCreated}
        />
      )}

      {/* Profile Modal */}
      {showProfile && (
        <UserProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
          onLogout={() => {
            logoutUser();
            localStorage.removeItem('userInfo');
          }}
        />
      )}
    </div>
  );
};

export default Sidebar;
