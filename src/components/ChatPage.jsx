import React, { useState, createRef, useEffect, useCallback } from "react";
import InputPageContainer from "./InputPageContainer";
import Chats from "./Chats";
import useChatContext from "../ChatContext/ChatContext";
import { useNavigate } from "react-router";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import SockJS from "sockjs-client";
import { getMessages } from "../services/RoomService";

const ChatPage = () => {
  const navigate = useNavigate();
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const inputRef = createRef();
  const chatBoxRef = createRef();

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessages(roomId);
        setMessages(messages);
      } catch (error) {}
    }
    if (connected) {
      loadMessages();
    }
  }, []);

  const loadMessages = useCallback(async () => {
    if (!roomId) {
      console.error("Room ID is missing");
      toast.error("Room ID is missing. Please rejoin the room.");
      navigate("/");
      return;
    }

    try {
      const messages = await getMessages(roomId);
      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages.");
    }
  }, [roomId, navigate]);

  useEffect(() => {
    if (connected && roomId) {
      loadMessages();
    }
  }, [connected, roomId, loadMessages]);

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      const shouldScroll =
        chatBox.scrollHeight - chatBox.clientHeight - chatBox.scrollTop < 100;
      if (shouldScroll) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }
  }, [messages, chatBoxRef]);

  useEffect(() => {
    let client;
    let sock;

    const connectWebSocket = () => {
      sock = new SockJS(`${import.meta.env.VITE_BACKEND_URL}chat`);
      client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected");

        const subscription = client.subscribe(
          `/topic/room/${roomId}`,
          (message) => {
            const newMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, newMessage]);
          }
        );

        // Return cleanup for this effect
        return () => {
          subscription.unsubscribe();
        };
      });
    };

    if (connected) {
      connectWebSocket();
    }

    // Global cleanup function
    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
      if (sock) {
        sock.close();
      }
    };
  }, [roomId, connected]);

  // In the sendMessage function, fix the destination path
  // In sendMessage function
  const sendMessage = () => {
    if (stompClient && input.trim() !== "") {
      const message = {
        sender: currentUser,
        content: input,
        timestamp: new Date().toISOString(),
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`, // roomId from context
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  };

  const handleLeaveRoom = () => {
    if (stompClient && stompClient.connected) {
      stompClient.disconnect(() => {
        setConnected(false);
        navigate("/");
      });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Header */}
      <header className="flex fixed w-full top-0 justify-between items-center bg-gray-300 dark:bg-gray-800 p-4 shadow-md">
        <h1 className="text-md font-semibold">
          Room:{" "}
          <span className="font-bold text-blue-500">
            {roomId || "Family Room"}
          </span>
        </h1>
        <h1 className="text-md font-semibold">
          User: <span className="font-bold text-green-500">{currentUser}</span>
        </h1>
        <button
          onClick={handleLeaveRoom}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition duration-200"
        >
          Leave Room
        </button>
      </header>

      {/* Chat Container */}
      <div className="flex-1 mt-16 overflow-y-auto p-4 mb-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-600">
        <Chats messages={messages} currentUser={currentUser} />
      </div>

      {/* Fixed Input at Bottom */}
      <div className="fixed w-full bottom-0">
        <InputPageContainer
          setMessages={setMessages}
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatPage;
