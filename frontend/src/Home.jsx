import React, { useContext, useEffect } from 'react';
import Sidebar from './Components/Sidebar';
import ChannelBar from './Components/ChannelBar';
import ChatBox from './Components/ChatBox';
import axios from "./api/axios";
import { GlobalContext } from './context/GlobalState';

const Home = () => {
  const {
    selectedServer,
  } = useContext(GlobalContext);



  
  

  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar  />

      {!selectedServer ? (
        <div className="flex-1 flex items-center justify-center text-lg">
          Select a server to start chatting.
        </div>
      ) : (
        <>
          <ChannelBar  />
          <ChatBox />
        </>
      )}
    </div>
  );
};

export default Home;
