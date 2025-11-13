import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useLocation } from "react-router-dom";
const EmptyChat = ({currentUser }) => {
  const location = useLocation();
  const  user  = location.state || {};
  return (
    <div className="flex-1 h-full min-h-0 rounded-xl shadow-xl backdrop-blur-lg bg-white/10 border border-white/20 flex justify-center items-center flex-col ">
      <div className=" aspect-square ">
        <p>hello{currentUser.fullname}</p>
        <DotLottieReact
          src="https://lottie.host/04215c45-db7c-463f-bfb9-6432e21a9e1d/btsvuZ6ZCN.lottie"
          loop
          autoplay
        />
      </div>
      <div className=" flex gap-1 text-white">
        <img
          src="https://img.icons8.com/?size=100&id=82747&format=png&color=FFFFFF"
          className="aspect-square w-5 "
        />
        <p> Your personal messages are end-to-end encrypted</p>
      </div>
    </div>
  );
};

export default EmptyChat;
