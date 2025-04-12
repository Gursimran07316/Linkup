import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const ChatBox = ({ currentChannel }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [typingUser, setTypingUser] = useState('');

  const bottomRef = useRef(null);

  useEffect(() => {
    const randomName = 'User' + Math.floor(Math.random() * 1000);
    const randomAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${Math.floor(
      Math.random() * 1000
    )}`;
    setUsername(randomName);
    setAvatar(randomAvatar);
  }, []);

  useEffect(() => {
    socket.emit('joinChannel', currentChannel);

    socket.on('initialMessages', (initialMessages) => {
      setMessages(initialMessages);
    });

    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on('userTyping', (data) => {
      setTypingUser(data.username);
      setTimeout(() => setTypingUser(''), 2000);
    });

    return () => {
      socket.off('initialMessages');
      socket.off('receiveMessage');
      socket.off('userTyping');
    };
  }, [currentChannel]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    socket.emit('sendMessage', {
      username,
      avatar,
      message: input,
    });

    setInput('');
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket.emit('typing', { username });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-850 bg-gray-900">
      <div className="border-b border-gray-700 p-4 text-lg font-semibold">
        #{currentChannel}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {typingUser && (
          <div className="text-sm text-gray-400 mb-2">
            {typingUser} is typing...
          </div>
        )}

        {messages.length === 0 ? (
          <span className="text-gray-400">No messages yet.</span>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex space-x-3 items-start">
              <img
                src={msg.avatar}
                alt={msg.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">
                    {msg.username}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-gray-300 text-sm">{msg.message}</div>
              </div>
            </div>
          ))
        )}

        <div ref={bottomRef} />
      </div>

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
