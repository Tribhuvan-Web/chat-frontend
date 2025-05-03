import React from "react";
import { Route, Routes } from "react-router";
import App from "../App";
import About from "../components/About";
import ChatPage from "../components/ChatPage";

const Approutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<About />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
};

export default Approutes;
