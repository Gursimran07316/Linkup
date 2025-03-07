import React from 'react'
import { FaAngleDown } from "react-icons/fa";
const ChannelBar = () => {
  return (
    <div className="w-60 bg-gray-850 p-4 bg-gray-800">
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Linkup</h2>
        <FaAngleDown className="cursor-pointer"/>
        </div>
    <div className="mt-4">
      <input
        type="text"
        placeholder="Search"
        className="w-full p-2 bg-gray-700 text-white rounded-md text-sm"
      />
    </div>
    <div className="mt-4">
      <h3 className="text-gray-400 uppercase text-xs">Text Channels</h3>
      <div className="mt-2 bg-gray-700 p-2 rounded-md flex items-center justify-between cursor-pointer">
        <span># general</span>
        <span className="text-gray-400 text-sm">🔒</span>
      </div>
    </div>
  </div>
  )
}

export default ChannelBar