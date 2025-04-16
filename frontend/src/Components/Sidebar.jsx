import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import CreateServerModal from './CreateServerModal';

const Sidebar = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [servers, setServers] = useState([]);

  const handleServerCreated = (newServer) => {
    setServers((prev) => [...prev, newServer]);
  };

  return (
    <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
      <div className="py-4 border-b border-gray-700">
        <div
          onClick={() => setShowModal(true)}
          className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-3xl text-green-500 cursor-pointer"
        >
          <FaPlus size={20} />
        </div>
      </div>

      {servers.map((srv) => (
  <div key={srv._id} title={srv.name}>
    {srv.icon ? (
      <img
        src={`http://localhost:5001${srv.icon}`}
        alt={srv.name}
        className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80"
      />
    ) : (
      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-sm text-white">
        {srv.name[0].toUpperCase()}
      </div>
    )}
  </div>
))}


      <div className="mt-auto mb-4">
        <img
          src={user.avatar}
          alt="Your Avatar"
          className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80"
        />
      </div>

      {showModal && (
        <CreateServerModal
          user={user}
          onClose={() => setShowModal(false)}
          onCreated={handleServerCreated}
        />
      )}
    </div>
  );
};

export default Sidebar;
