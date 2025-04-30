import React, { createContext, useReducer, useEffect } from 'react';
import AppReducer from './AppReducer';
import axios from '../api/axios';

// Initial State
const initialState = {
  user: null,
  selectedServer: null,
  servers: [],
  currentChannel: null,
  messages: [],
  typingUser: null,
};

// Create Context
export const GlobalContext = createContext(initialState);

// Provider Component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // ACTIONS

  const setUser = (user) => dispatch({ type: 'SET_USER', payload: user });
  const logoutUser = () => dispatch({ type: 'LOGOUT_USER' });

  const setServer = (server) => dispatch({ type: 'SET_SERVER', payload: server });
  const setChannel = (channel) => dispatch({ type: 'SET_CHANNEL', payload: channel });
  const setTypingUser = (username) => dispatch({ type: 'SET_TYPING_USER', payload: username });

  // API Actions

  const fetchServers = async (userId) => {
    try {
      const { data } = await axios.get(`/servers?userId=${userId}`);
      dispatch({ type: 'SET_SERVERS', payload: data });
    } catch (error) {
      console.error('Error fetching servers', error);
    }
  };

  const fetchMembers = async (serverId) => {
    try {
      const { data } = await axios.get(`/servers/${serverId}`);
      console.log(data);
      dispatch({ type: 'SET_MEMBERS', payload: data.members });
    } catch (error) {
      console.error('Error fetching members', error);
    }
  };

  const fetchMessages = async (serverId, channelName) => {
    try {
      const { data } = await axios.get(`/messages/${serverId}/${channelName}`);
      dispatch({ type: 'SET_MESSAGES', payload: data });
    } catch (error) {
      console.error('Error fetching messages', error);
    }
  };
  const handleDeleteChannel = async (channelId) => {
    if (!window.confirm('Are you sure you want to delete this channel?')) return;
    try {
      const { data } = await axios.delete(`/servers/${state.selectedServer._id}/channels/${channelId}`, {
        data: { adminId: state.user._id },
      });
      setServer({ ...state.selectedServer, channels: data.channels });
    } catch (error) {
      alert('Delete failed');
      console.log(error.message);
    }
  };

  const handleRename = async (newName,channel,onClose) => {
    if (!newName.trim()) return;

    try {
      const { data } = await axios.put(`/servers/${state.selectedServer._id}/channels/${channel._id}/rename`, {
        newName,
        adminId: state.user._id,
      });
      setServer({ ...state.selectedServer, channels: data.channels });
      setChannel(newName);
      onClose(); // close modal
    } catch (err) {
      alert('Failed to rename channel');
      console.log(err.message);
    }
  };

  const handleDeleteServer = async (serverId, serverName) => {
    const confirm = window.confirm(`Are you sure you want to delete "${serverName}"?`);
    if (!confirm) return;

    try {
      await axios.delete(`/servers/${serverId}`, {
        data: { userId: state.user._id },
      });
      setServer(null);
      await fetchServers(state.user._id); 
    } catch (err) {
      alert('Failed to delete server.');
    }
  };

   // Kick a member from server (admin only)
   const handleKick = async (memberId) => {
    if (!window.confirm('Are you sure you want to kick this member?')) return;

    try {
      const { data } = await axios.put(`/servers/${state.selectedServer._id}/kick/${memberId}`, {
        adminId: state.user._id,
      });
      console.log(data.members);
      await fetchMembers(state.selectedServer._id);
    } catch (error) {
      alert('Failed to kick member');
      console.log(error.message);
    }
  };
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        user: state.user,
        selectedServer: state.selectedServer,
        servers: state.servers,
        members: state.members,
        currentChannel: state.currentChannel,
        messages: state.messages,
        typingUser: state.typingUser,
        setUser,
        logoutUser,
        setServer,
        setChannel,
        setTypingUser,
        fetchServers,
        fetchMembers,
        fetchMessages,
        handleDeleteChannel,
        handleRename,
        handleDeleteServer,
        handleKick
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
