import React, { useState, useContext } from 'react';
import axios from '../api/axios';
import { GlobalContext } from '../context/GlobalState';

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(null);

  const { setUser } = useContext(GlobalContext);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setImage(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'linkup_users'); 

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/ddugtzsol/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);

      const endpoint = isLogin ? '/auth/login' : '/auth/register';

      let avatar = '';
      if (!isLogin) {
        avatar = image
          ? await handleImageUpload()
          : `https://api.dicebear.com/7.x/identicon/svg?seed=${form.username}`;
      }

      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { ...form, avatar };

      const { data } = await axios.post(endpoint, payload);

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);  // <-- using Global Context to set user ✅

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-sm shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{isLogin ? 'Log In' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full p-2 bg-gray-700 rounded"
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                type="file"
                accept="image/*"
                className="w-full bg-gray-700 text-white text-sm p-1 rounded"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </>
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
          <button
            type="submit"
            className="w-full bg-green-600 py-2 rounded disabled:opacity-50"
            disabled={uploading}
          >
            {uploading
              ? 'Uploading...'
              : isLogin
              ? 'Log In'
              : 'Sign Up'}
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
