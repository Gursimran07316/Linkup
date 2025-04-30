
export default (state, action) => {
    switch (action.type) {
      case 'SET_USER':
        return { ...state, user: action.payload };
      case 'LOGOUT_USER':
        return { ...state, user: null };
      case 'SET_SERVER':
        return { ...state, selectedServer: action.payload };
        case 'SET_SERVERS':
            return { ...state, servers: action.payload };
      case 'SET_CHANNEL':
        return { ...state, currentChannel: action.payload };
        case 'SET_MEMBERS':
        return { ...state, selectedServer: {...state.selectedServer,members: action.payload} };
      case 'SET_MESSAGES':
        return { ...state, messages: action.payload };
      case 'SET_TYPING_USER':
        return { ...state, typingUser: action.payload };
      default:
        return state;
    }
  };
  