import React from 'react';
import { FaAngleDown } from 'react-icons/fa';

const ChannelBar = ({ currentChannel, setCurrentChannel }) => {
  const channels = ['general', 'welcome', 'coding', 'collab'];

  return (
    <div className="w-60 bg-gray-850 p-4 bg-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Linkup</h2>
        <FaAngleDown className="cursor-pointer" />
      </div>

      <div className="mt-4">
        <h3 className="text-gray-400 uppercase text-xs">Text Channels</h3>
        {channels.map((channel) => (
          <div
            key={channel}
            onClick={() => setCurrentChannel(channel)}
            className={`mt-2 p-2 rounded-md flex items-center justify-between cursor-pointer ${
              currentChannel === channel ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <span>#{channel}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelBar;
