import React, { useState } from 'react';
import axios from '../api/axios';
import { FaCloudUploadAlt } from 'react-icons/fa';

const CreateServerModal = ({ user, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null); // optional

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('userId', user._id);
    if (image) formData.append('icon', image);
  
    try {
      const { data } = await axios.post('/servers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      onCreated(data);
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
  {/* Upload Box */}
  {!image ? (
    <label className="block text-center border border-dashed border-gray-600 rounded-md p-4 cursor-pointer hover:bg-gray-800 transition">
      <FaCloudUploadAlt className="text-3xl mx-auto mb-2 text-gray-400" />
      <span className="text-blue-400">Choose file or drag and drop</span>
      <input
        type="file"
        className="hidden"
        onChange={(e) => setImage(e.target.files[0])}
        accept="image/*"
      />
    </label>
  ) : (
    <div className="relative border border-gray-700 rounded-md p-3 flex items-center justify-between bg-gray-800">
      <div className="flex items-center gap-3">
        <img
          src={URL.createObjectURL(image)}
          alt="Preview"
          className="w-10 h-10 object-cover rounded-full"
        />
        <span className="text-sm text-gray-300 truncate max-w-[160px]">{image.name}</span>
      </div>
      <button
        type="button"
        className="text-red-400 hover:text-red-600 text-sm"
        onClick={() => setImage(null)}
      >
        ✖
      </button>
    </div>
  )}

  {/* Server Name Input */}
  <input
    type="text"
    placeholder="Server Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full p-3 rounded bg-gray-700"
    required
  />

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded font-medium"
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
