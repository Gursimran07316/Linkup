import React, { useState } from 'react';
import axios from '../api/axios';

const AuthModal = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const avatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${form.username}`;
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { ...form, avatar };

      const { data } = await axios.post(endpoint, payload);
      localStorage.setItem('userInfo', JSON.stringify(data));
      onSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-sm shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{isLogin ? 'Log In' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full p-2 bg-gray-700 rounded"
              value={form.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 bg-gray-700 rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 bg-gray-700 rounded"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-green-600 py-2 rounded">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
          <button onClick={toggleMode} className="text-blue-400 hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
