import React, { useState, useEffect, useContext } from "react";
import {
  FaAngleDown,
  FaUserPlus,
  FaPlus,
  FaTrash,
  FaCrown,
  FaTimes,
  FaPen,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";
import InviteModal from "./InviteModal";
import CreateChannelModal from "./CreateChannelModal";
import { GlobalContext } from "../context/GlobalState";
import RenameChannelModal from "./RenameChannelModal";
const ChannelBar = ({onChannelSelect}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [channelToRename, setChannelToRename] = useState(null);
  const {
    selectedServer,
    currentChannel,
    user,
    setServer,
    setChannel,
    handleDeleteChannel,
    handleKick,
    handleDeleteServer,
    handleLeaveServer,
  } = useContext(GlobalContext);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  if (!selectedServer) return null; // no server selected

  return (
    <div className="w-full md:w-60 bg-gray-850 p-4 bg-gray-800 relative flex flex-col space-y-6 overflow-y-auto">
      {/* Server Title */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 rounded"
        onClick={toggleDropdown}
      >
        <h2 className="text-lg font-semibold truncate">
          {selectedServer.name}
        </h2>
        <FaAngleDown />
      </div>

      {/* Dropdown Options */}
      {showDropdown && (
        <div className="absolute z-50 left-4 top-20 w-52 bg-gray-900 border border-gray-700 rounded shadow-lg text-sm overflow-hidden">
          <div
            onClick={() => {
              setShowInviteModal(true);
              setShowDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 cursor-pointer"
          >
            <FaUserPlus /> Invite People
          </div>

          <div
            onClick={() => {
              setShowChannelModal(true);
              setShowDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 cursor-pointer"
          >
            <FaPlus /> Create Channel
          </div>

          {selectedServer.admin._id === user._id && (
            <div
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white cursor-pointer"
              onClick={() =>
                handleDeleteServer(selectedServer._id, selectedServer.name)
              }
            >
              <FaTrash /> Delete Server
            </div>
          )}

          {selectedServer.admin._id != user._id && (
            <div
              onClick={() => handleLeaveServer()}
              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-600 hover:text-white cursor-pointer"
            >
              <FaSignOutAlt /> Leave Server
            </div>
          )}
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          inviteCode={selectedServer.inviteCode}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      {/* Create Channel Modal */}
      {showChannelModal && (
        <CreateChannelModal
          serverId={selectedServer._id}
          onClose={() => setShowChannelModal(false)}
          onCreated={(updatedServer) => {
            setServer(updatedServer);
          }}
        />
      )}

      {/* Channel List */}
      <div>
        <h3 className="text-gray-400 uppercase text-xs mb-2">Text Channels</h3>
        {selectedServer.channels.map((channel) => (
          <div
            key={channel._id}
            className={`mt-2 p-2 rounded-md flex items-center justify-between cursor-pointer group ${
              currentChannel === channel.name
                ? "bg-gray-700"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => {
              setChannel(channel.name);
              onChannelSelect(); 
            }}
          >
            <span># {channel.name}</span>

            {/* Icons appear only for Admin */}
            {selectedServer.admin._id === user._id &&
              channel.name.toLowerCase() != "general" && (
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition">
                  <FaPen
                    className="text-gray-400 hover:text-blue-400 cursor-pointer"
                    onClick={() => {
                      setChannelToRename(channel);
                      setShowRenameModal(true);
                    }}
                  />
                  <FaTrash
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                    onClick={() => handleDeleteChannel(channel._id)}
                  />
                </div>
              )}
            {channel.name.toLowerCase() === "general" && (
              <FaLock
                className="text-gray-400"
                title="Cannot modify general channel"
              />
            )}
          </div>
        ))}
      </div>

      {showRenameModal && (
        <RenameChannelModal
          serverId={selectedServer._id}
          channel={channelToRename}
          onClose={() => setShowRenameModal(false)}
        />
      )}
      {/* Members */}
      <div className="mt-4">
        <h3 className="text-gray-400 uppercase text-xs mb-2">Members</h3>
        {selectedServer.members.map((member) => (
          <div
            key={member._id}
            className="flex items-center space-x-2 p-2 text-sm text-white hover:bg-gray-700 rounded justify-between"
          >
            <div className="flex items-center space-x-2">
              <img
                src={member.avatar}
                alt={member.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="truncate">
                {member.username}
                {selectedServer.admin._id === member._id && (
                  <FaCrown
                    className="inline text-yellow-400 ml-2"
                    title="Admin"
                  />
                )}
              </span>
            </div>

            {/* Kick Button if Viewer is Admin and not kicking themselves */}
            {selectedServer.admin._id === user._id &&
              member._id !== user._id && (
                <FaTimes
                  className="inline text-red-500 ml-2 cursor-pointer"
                  title="Remove Member"
                  onClick={() => handleKick(member._id)}
                />
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelBar;
