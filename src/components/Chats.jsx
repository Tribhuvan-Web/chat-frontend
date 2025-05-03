import React, { useRef, useEffect } from "react";

const Chats = ({ messages, currentUser }) => {
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const messageArray = Array.isArray(messages) ? messages : [];

  return (
    <div
      ref={chatBoxRef}
      className="flex flex-col gap-4 p-4 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-inner scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-600"
    >
      {messageArray.length > 0 ? (
        messageArray.map((message, index) => (
          <div
            key={message.id || index}
            className={`flex ${
              message.sender === currentUser ? "justify-end" : "justify-start"
            } animate-fade-in-up`}
          >
            <div
              className={`relative max-w-xs lg:max-w-xl px-4 py-2 rounded-xl shadow-lg transition-all duration-300 ${
                message.sender === currentUser
                  ? "bg-blue-500 text-white hover:bg-blue-600 hover:scale-[1.02] origin-right"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-[1.02] origin-left"
              }`}
              style={{
                transformOrigin:
                  message.sender === currentUser ? "right" : "left",
                animation: "fadeInUp 0.3s ease-out",
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-xs font-medium opacity-90">
                  {message.sender}
                </span>
                <span className="text-[0.65rem] opacity-75">
                  {message.timestamp &&
                    new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </span>
              </div>
              <div className="text-sm leading-relaxed break-words">
                {message.content}
              </div>

              {/* Chat bubble triangle */}
              <div
                className={`absolute top-3 w-2 h-2 transform rotate-45 ${
                  message.sender === currentUser
                    ? "bg-blue-500 -right-1"
                    : "bg-gray-100 dark:bg-gray-700 -left-1"
                }`}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-8 text-gray-400 dark:text-gray-500">
          <span className="text-4xl mb-2">👋</span>
          <p className="text-sm font-medium">No messages yet.</p>
          <p className="text-xs">Start the conversation!</p>
        </div>
      )}
    </div>
  );
};

export default Chats;
