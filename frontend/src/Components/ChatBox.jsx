import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { GlobalContext } from '../context/GlobalState';

const socket = io('http://localhost:5001');

const ChatBox = () => {
  const [input, setInput] = useState('');
  const topRef = useRef(null);
  const [messages, setMessages] = useState([])
  const {
    user,
    selectedServer,
    currentChannel,
    typingUser,
    setTypingUser,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (!selectedServer || !currentChannel) return;

    // Step 1: Join channel
    socket.emit('joinChannel', {
      serverId: selectedServer._id,
      channelName: currentChannel,
    });

    // Step 2: Listen for initial messages from server
    socket.on('initialMessages', (initialMessages) => {
      console.log('Received initial messages:', initialMessages);
      setMessages(initialMessages);
    });

    // Step 3: Listen for new incoming messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Step 4: Listen for typing events
    socket.on('userTyping', (data) => {
      setTypingUser(data.username);
      setTimeout(() => setTypingUser(''), 2000);
    });

    // Cleanup on unmount
    return () => {
      socket.off('initialMessages');
      socket.off('receiveMessage');
      socket.off('userTyping');
    };
  }, [selectedServer, currentChannel]);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    socket.emit('sendMessage', {
      serverId: selectedServer._id,
      channelName: currentChannel,
      username: user?.username,
      avatar: user?.avatar,
      message: input,
    });

    setInput('');
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket.emit('typing', {
      serverId: selectedServer._id,
      channelName: currentChannel,
      username: user?.username,
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Channel Header */}
      <div className="border-b border-gray-700 p-4 text-lg font-semibold">
        #{currentChannel}
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse space-y-reverse space-y-4">
        <div ref={topRef} />

        {/* Chat Messages */}
        {[...messages].reverse().map((msg) => (
          <div key={msg._id} className="flex space-x-3 items-start">
            <img
              src={msg.avatar}
              alt={msg.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white">{msg.username}</span>
                <span className="text-xs text-gray-400">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="text-gray-300 text-sm">{msg.message}</div>
            </div>
          </div>
        ))}

        {/* Welcome message if no messages */}
        {messages.length === 0 && (
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-4xl text-gray-400">
              #
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Welcome to <span className="text-gray-300">#{currentChannel}</span>
              </h2>
              <p className="text-gray-400 text-sm">
                This is the start of the #{currentChannel} channel.
              </p>
            </div>
          </div>
        )}

        {/* Typing Indicator */}
        {typingUser && (
          <div className="text-sm text-gray-400">{typingUser} is typing...</div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={sendMessage}
        className="p-4 border-t border-gray-700 flex"
      >
        <input
          type="text"
          placeholder={`Message #${currentChannel}`}
          className="w-full p-3 bg-gray-700 text-white rounded-md"
          value={input}
          onChange={handleTyping}
        />
        <button
          type="submit"
          className="ml-2 px-4 bg-green-600 text-white rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
