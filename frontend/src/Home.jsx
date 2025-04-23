import React, { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar';
import ChannelBar from './Components/ChannelBar';
import ChatBox from './Components/ChatBox';

const Home = ({ user, selectedServer, setSelectedServer }) => {
  const [currentChannel, setCurrentChannel] = useState(null);
useEffect(() => {

 if(selectedServer){
  setCurrentChannel(selectedServer.channels.map(c=>c.name).includes('general')?'general':'')
 }
}, [selectedServer])

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        user={user}
        selectedServer={selectedServer}
        setSelectedServer={setSelectedServer}
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
            setCurrentChannel={setCurrentChannel}
            server={selectedServer}
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
