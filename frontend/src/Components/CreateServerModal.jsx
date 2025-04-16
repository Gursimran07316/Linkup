import React, { useState } from 'react';
import axios from '../api/axios';
import { FaCloudUploadAlt } from 'react-icons/fa';

const CreateServerModal = ({ user, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null); // optional

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      const { data } = await axios.post('/servers', {
        name,
        userId: user._id,
      });

      onCreated(data); // callback to update sidebar
      onClose();
    } catch (err) {
      alert('Failed to create server');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md text-white shadow-lg">
        <h2 className="text-xl font-bold mb-4">Customize your server</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-center border border-dashed border-gray-600 rounded-md p-4 cursor-pointer">
            <FaCloudUploadAlt className="text-3xl mx-auto mb-2 text-gray-400" />
            <span className="text-blue-400">Choose file or drag and drop</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          <input
            type="text"
            placeholder="Server Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded bg-gray-700"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 py-2 rounded font-medium"
          >
            Create
          </button>
        </form>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default CreateServerModal;
