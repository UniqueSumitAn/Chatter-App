import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

import { UserContext } from "./context/UserContext";

const App = () => {
  const [currentUser, setcurrentUser] = useState(null);

  return (
    <UserContext.Provider value={{ currentUser, setcurrentUser }}>
      <div className="h-screen w-full bg-[linear-gradient(135deg,#2E005C,#A020F0,#FF2EF3)] bg-contain">
        <Routes>
          <Route path="/Home" element={<HomePage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/Profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
};

export default App;
