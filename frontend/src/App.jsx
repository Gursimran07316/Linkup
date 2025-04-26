import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalProvider, GlobalContext } from './context/GlobalState';
import Home from './Home';
import AuthModal from './Components/AuthModal';
import InvitePage from './InvitePage';

const AppRoutes = () => {
  const { user, setUser } = useContext(GlobalContext);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<AuthModal />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/invite/:code" element={<InvitePage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <div className="h-screen bg-gray-900 text-white">
          <AppRoutes />
        </div>
      </GlobalProvider>
    </BrowserRouter>
  );
};

export default App;
