import React, { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar';
import ChannelBar from './Components/ChannelBar';
import ChatBox from './Components/ChatBox';
import axios from "./api/axios"
const Home = ({ user, selectedServer, setSelectedServer }) => {
  const [currentChannel, setCurrentChannel] = useState(null);
useEffect(() => {

 if(selectedServer){
  setCurrentChannel(selectedServer.channels.map(c=>c.name).includes('general')?'general':'')
 }
}, [selectedServer])

  // Delete a server (only if user is owner)
  const handleDeleteServer = async (serverId, serverName) => {
    const confirm = window.confirm(`Are you sure you want to delete "${serverName}"?`);
    if (!confirm) return;

    try {
      await axios.delete(`/servers/${serverId}`, {
        data: { userId: user._id },
      });
      setSelectedServer(null);
    } catch (err) {
      alert('Failed to delete server.');
    }
  };

  const handleKick = async (memberId) => {
    if (!window.confirm('Are you sure you want to kick this member?')) return;
  
    try {
      const { data } = await axios.put(`/servers/${selectedServer._id}/kick/${memberId}`, {
        adminId: user._id, 
      });
  
      window.location.reload(); 
      
    } catch (error) {
      alert('Failed to kick member');
      console.log(error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        user={user}
        selectedServer={selectedServer}
        setSelectedServer={setSelectedServer}
        handleDeleteServer={handleDeleteServer}
      />

      {/* No server selected yet */}
      {!selectedServer ? (
        <div className="flex-1 flex items-center justify-center text-lg">
          Select a server to start chatting.
        </div>
      ) : (
        <>
          <ChannelBar
            currentChannel={currentChannel}
            user={user}
            setCurrentChannel={setCurrentChannel}
            server={selectedServer}
            handleKick={handleKick}
          />
          <ChatBox
            currentChannel={currentChannel}
          currentServer={selectedServer}
            user={user}
          />
        </>
      )}
    </div>
  );
};

export default Home;
