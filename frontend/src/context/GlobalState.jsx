import React, { createContext, useReducer, useEffect } from 'react';
import AppReducer from './AppReducer';
import axios from '../api/axios';

// Initial State
const initialState = {
  user: null,
  selectedServer: null,
  servers: [],
  members: [],
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
