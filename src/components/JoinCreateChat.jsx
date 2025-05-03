import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaComments } from "react-icons/fa";
import { createRooms, joinChatApi } from "../services/RoomService";
import useChatContext from "../ChatContext/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
  const [details, setDetails] = useState({
    roomId: "",
    userName: "",
  });

  const {
    roomId,
    setRoomId,
    currentUser,
    setCurrentUser,
    connected,
    setConnected,
  } = useChatContext();

  const navigate = useNavigate();

  function handleChange(e) {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  }

  async function joinChat() {
    if (validateForm) {
      try {
        const room = await joinChatApi(details.roomId);
        toast.success("Room joined successfully!", {
          duration: 2000,
          position: "bottom-center",
        });
        setRoomId(details.roomId);
        setCurrentUser(details.userName);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        toast.error(error.response.data, {
          duration: 2000,
          position: "top-center",
        });
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      try {
        const response = await createRooms({ roomId: details.roomId });
        toast.success("Room created successfully!", {
          duration: 2000,
          position: "bottom-center",
        });
        setCurrentUser(details.userName);
        setRoomId(response.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        console.error("Error creating room:", error);
        toast.error(error.response?.data || "Failed to create room", {
          duration: 2000,
          position: "top-center",
        });
      }
    }
  }

  function validateForm() {
    if (!details.roomId || !details.userName) {
      toast.error("Please fill in all fields", {
        duration: 2000,
        position: "top-center",
      });
      return false;
    }
    return true;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="bg-gray-800 shadow-lg flex flex-col gap-4 rounded-xl p-8 max-w-md w-full">
        <div className="flex justify-center items-center mb-4">
          <FaComments className="text-blue-400 text-5xl" />
        </div>

        <h1 className="text-4xl font-extrabold text-center mb-6">
          Join / Create a Chat
        </h1>

        <div>
          <label
            htmlFor="name"
            className="block text-gray-300 text-sm font-semibold mb-2"
          >
            Your Name
          </label>
          <input
            onChange={handleChange}
            value={details.userName}
            type="text"
            id="name"
            name="userName"
            className="w-full bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl p-3"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label
            htmlFor="roomId"
            className="block text-gray-300 text-sm font-semibold mb-2"
          >
            Room ID / New Room ID
          </label>
          <input
            onChange={handleChange}
            value={details.roomId}
            type="text"
            name="roomId"
            className="w-full bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent rounded-xl p-3"
            placeholder="Enter your room ID"
          />
        </div>

        <div className="flex justify-between gap-4">
          <button
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-300 w-full"
            onClick={joinChat}
          >
            Join Room
          </button>
          <button
            className="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition duration-300 w-full"
            onClick={createRoom}
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
