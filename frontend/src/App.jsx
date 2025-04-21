import React, { useState, useEffect } from 'react';
import Home from './Home';
import AuthModal from './Components/AuthModal';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InvitePage from './InvitePage';
const App = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);
  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="h-screen bg-gray-900 text-white">
        <Routes>
          {user ? (
            <>
              <Route
                path="/"
                element={
                  <Home
                    user={user}
                    selectedServer={selectedServer}
                    setSelectedServer={setSelectedServer}
                  />
                }
              />
              <Route
                path="/invite/:code"
                element={
                  <InvitePage
                    user={user}
                    onJoin={(server) => setSelectedServer(server)}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-full">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-blue-600 px-4 py-2 rounded"
                  >
                    Login / Register
                  </button>
                  {showAuthModal && (
                    <AuthModal
                      onSuccess={(u) => {
                        setUser(u);
                        setShowAuthModal(false);
                      }}
                    />
                  )}
                </div>
              }
            />
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
  }
  

export default App;
