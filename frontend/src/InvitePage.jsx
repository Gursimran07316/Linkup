import React, { useEffect, useState,useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './api/axios';
import { GlobalContext } from './context/GlobalState';
const InvitePage = ({  onJoin }) => {
  const { code } = useParams();
  const [server, setLocalServer] = useState(null);
  const navigate = useNavigate();
  const {
    user,
    setServer
  } = useContext(GlobalContext);

  useEffect(() => {
    const fetchServer = async () => {
      try {
        const { data } = await axios.get(`/servers/invite/${code}`);
        setLocalServer(data);
      } catch {
        alert('Invalid or expired invite link.');
        navigate('/');
      }
    };

    fetchServer();
  }, [code, navigate]);

  const handleJoin = async () => {
    try {
      const { data } = await axios.post(`/servers/join/${code}`, {
        userId: user._id,
      });

      setServer(data); // set selected server
      navigate('/');
    } catch (err) {
      alert('Join failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      {server ? (
        <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-sm text-center">
          <h2 className="text-xl font-bold mb-2">You're invited to join</h2>
          <h3 className="text-2xl font-semibold mb-4">{server.name}</h3>
          <button
            onClick={handleJoin}
            className="bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded"
          >
            Join Server
          </button>
        </div>
      ) : (
        <p>Loading invite...</p>
      )}
    </div>
  );
};

export default InvitePage;
