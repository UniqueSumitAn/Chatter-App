import React from "react";
import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";
const App = () => {
  return (
    // bg-[linear-gradient(135deg,#2E005C,#A020F0,#FF2EF3)]
    <div className=" h-screen w-full bg-[linear-gradient(135deg,#2E005C,#A020F0,#FF2EF3)]  bg-contain">
      <Routes>
        <Route path="/Home" element={<HomePage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/Profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default App;
