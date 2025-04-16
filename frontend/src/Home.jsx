import React, { useState } from 'react';
import Sidebar from './Components/Sidebar';
import ChannelBar from './Components/ChannelBar';
import ChatBox from './Components/ChatBox';

const Home = ({user}) => {
  const [currentChannel, setCurrentChannel] = useState('general');

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar user={user} />
      <ChannelBar
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
      />
      <ChatBox currentChannel={currentChannel} user={user}/>
    </div>
  );
};

export default Home;
