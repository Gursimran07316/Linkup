import React, { useContext, useEffect } from 'react';
import Sidebar from './Components/Sidebar';
import ChannelBar from './Components/ChannelBar';
import ChatBox from './Components/ChatBox';
import axios from "./api/axios";
import { GlobalContext } from './context/GlobalState';

const Home = () => {
  const {
    user,
    selectedServer,
    setServer,
    servers,
    currentChannel,
    setChannel,
    logoutUser,
    fetchServers,
    setMembers,
  } = useContext(GlobalContext);

  // useEffect(() => {
  //   if (selectedServer) {
  //     setChannel(
  //       selectedServer.channels.map((c) => c.name).includes('general') ? 'general' : ''
  //     );
  //   }
  // }, [selectedServer]);
console.log(servers);
  // Delete a server (only if user is owner)
  const handleDeleteServer = async (serverId, serverName) => {
    const confirm = window.confirm(`Are you sure you want to delete "${serverName}"?`);
    if (!confirm) return;

    try {
      await axios.delete(`/servers/${serverId}`, {
        data: { userId: user._id },
      });
      setServer(null);
      fetchServers(user._id); // refetch updated servers list
    } catch (err) {
      alert('Failed to delete server.');
    }
  };

  // Kick a member from server (admin only)
  const handleKick = async (memberId) => {
    if (!window.confirm('Are you sure you want to kick this member?')) return;

    try {
      const { data } = await axios.put(`/servers/${selectedServer._id}/kick/${memberId}`, {
        adminId: user._id,
      });

      setMembers(data.members); // update members immediately without reload
    } catch (error) {
      alert('Failed to kick member');
      console.log(error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar handleDeleteServer={handleDeleteServer} />

      {!selectedServer ? (
        <div className="flex-1 flex items-center justify-center text-lg">
          Select a server to start chatting.
        </div>
      ) : (
        <>
          <ChannelBar handleKick={handleKick} />
          <ChatBox />
        </>
      )}
    </div>
  );
};

export default Home;
