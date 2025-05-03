import React from "react";
import { MdAttachFile, MdSend } from "react-icons/md";

const InputPageContainer = ({ input, setInput, sendMessage }) => {
  return (
    <div className="flex flex-col justify-end h-full w-full bg-gray-200 dark:bg-gray-900">
      {/* Message Input Box */}
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border-t border-gray-300 p-2 fixed w-full bottom-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full px-4 py-2 outline-none"
        />
        <button className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-full flex items-center justify-center transition duration-300">
          <MdAttachFile size={24} />
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center justify-center transition duration-300">
          <MdSend size={24} onClick={sendMessage} />
        </button>
      </div>
    </div>
  );
};

export default InputPageContainer;
