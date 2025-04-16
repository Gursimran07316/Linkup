import React, { useState, useEffect } from 'react';
import Home from './Home';
import AuthModal from './Components/AuthModal';

const App = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="h-screen bg-gray-900 text-white">
      {user ? (
        <Home user={user} />
      ) : (
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
      )}
    </div>
  );
};

export default App;
