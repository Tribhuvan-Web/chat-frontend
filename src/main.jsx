import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import Approutes from "./routes/Approutes.jsx";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "./ChatContext/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster />
    <ChatProvider>
      <Approutes />
    </ChatProvider>
  </BrowserRouter>
);
