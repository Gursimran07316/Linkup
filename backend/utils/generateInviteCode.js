const generateInviteCode = () => {
    return Math.random().toString(36).substr(2, 6);
  };
  
  export default generateInviteCode;
  