import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar';
import ChannelBar from './Components/ChannelBar';
import ChatBox from './Components/ChatBox';
import { GlobalContext } from './context/GlobalState';

const Home = () => {
  const { selectedServer } = useContext(GlobalContext);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [chatOpen, setChatOpen] = useState(false); // only true when a channel is selected on mobile

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) setChatOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChannelSelect = () => {
    if (!isDesktop) setChatOpen(true);
  };

  const handleBackToChannels = () => setChatOpen(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Desktop: Always show Sidebar */}
      {/* Mobile: Show Sidebar if not in ChatBox */}
      {(isDesktop || !chatOpen) && <Sidebar />}

      {/* Show ChannelBar when server is selected and not in ChatBox */}
      {selectedServer && (isDesktop || !chatOpen) && (
        <ChannelBar onChannelSelect={handleChannelSelect} />
      )}

      {/* Show ChatBox on desktop OR when a channel is selected (mobile) */}
      {(isDesktop || chatOpen) && (
        <ChatBox
          isDesktop={isDesktop}
          onBack={handleBackToChannels}
        />
      )}
    </div>
  );
};

export default Home;
