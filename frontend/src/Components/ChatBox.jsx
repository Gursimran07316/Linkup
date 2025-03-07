import React from 'react'

const ChatBox = () => {
  return (
    <div className="flex-1 flex flex-col bg-gray-850 bg-gray-900">
        <div className="border-b border-gray-700 p-4 text-lg font-semibold">
          # general
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-gray-400">Loading messages...</span>
        </div>
        <div className="p-4 border-t border-gray-700">
          <input
            type="text"
            placeholder="Message #general"
            className="w-full p-3 bg-gray-700 text-white rounded-md"
          />
        </div>
      </div>
  )
}

export default ChatBox