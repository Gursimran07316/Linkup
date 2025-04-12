import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const bottomRef = useRef(null); 

  useEffect(() => {
    // Receive initial messages
    socket.on('initialMessages', (initialMessages) => {
      setMessages(initialMessages);
    });

    // Receive new messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off('initialMessages');
      socket.off('receiveMessage');
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    socket.emit('sendMessage', {
      username: 'Guri',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Guri',
      message: input,
    });

    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-850 bg-gray-900">
      <div className="border-b border-gray-700 p-4 text-lg font-semibold">
        # general
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <span className="text-gray-400">No messages yet.</span>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex space-x-3 items-start">
              {/* Avatar */}
              <img
                src={msg.avatar}
                alt={msg.username}
                className="w-10 h-10 rounded-full"
              />

              {/* Message Content */}
              <div>
                {/* Username and timestamp */}
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">{msg.username}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>

                {/* Message Text */}
                <div className="text-gray-300 text-sm">
                  {msg.message}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} /> 
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-700 flex">
        <input
          type="text"
          placeholder="Message #general"
          className="w-full p-3 bg-gray-700 text-white rounded-md"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="ml-2 px-4 bg-green-600 text-white rounded-md">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
