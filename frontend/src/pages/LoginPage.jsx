import React, { useState } from "react";
import Interactivemodel from "../components/Interactivemodel";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
  const [currentState, setcurrentState] = useState("Sign up");
  const [signUpFormDetails, setsignUpFormDetails] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [loginFormDetails, setloginFormDetails] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const signUpFormChange = (e) => {
    e.preventDefault();
    setsignUpFormDetails({
      ...signUpFormDetails,
      [e.target.name]: e.target.value,
    });
  };
  const loginFormChange = (e) => {
    e.preventDefault();
    setloginFormDetails({
      ...loginFormDetails,
      [e.target.name]: e.target.value,
    });
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (currentState === "Sign up") {
        const response = await axios.post(
          "http://localhost:5000/user/signup",
          signUpFormDetails,
          {
            withCredentials: true,
          }
        );

        response.data.success
          ? navigate("/Home", {
              state: {
                user: response.data.user,
              },
            })
          : console.log(response.data.message);
        console.log(response.data);
      } else {
        const response = await axios.post("http://localhost:5000/user/login", loginFormDetails,{
          withCredentials:true,
        });
        response.data.success
          ? navigate("/Home", {
              state: {
                user: response.data.user,
              },
            })
          : console.log(response.data.message);
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="grid grid-cols-2 justify-center items-center h-full">
      {/* interactive model */}
      <div className="flex justify-center items-center h-full">
        <Interactivemodel />
      </div>

      {/* signUp/Login form */}
      <div className="flex justify-center items-center h-full">
        <form
          onSubmit={(e) => SubmitHandler(e)}
          className=" backdrop-blur-lg bg-white/10 border border-white/20 text-white p-6 flex flex-col gap-6 rounded-xl shadow-xl"
        >
          {currentState && (
            <>
              <h1>{currentState}</h1>

              {currentState === "Sign up" && (
                <input
                  type="text"
                  value={signUpFormDetails.fullname}
                  name="fullname"
                  onChange={(e) => signUpFormChange(e)}
                  className=" p-2 border border-gray-500 rounded-md focus:outline-none placeholder-black"
                  placeholder="Full Name"
                  required
                />
              )}

              <input
                type="email"
                value={
                  currentState === "Sign up"
                    ? signUpFormDetails.email
                    : loginFormDetails.email
                }
                name="email"
                onChange={(e) => {
                  currentState === "Sign up"
                    ? signUpFormChange(e)
                    : loginFormChange(e);
                }}
                className=" p-2 border border-gray-500 rounded-md focus:outline-none placeholder-black"
                placeholder="email@mail.com"
                required
              />

              <input
                type="text"
                value={
                  currentState === "Sign up"
                    ? signUpFormDetails.password
                    : loginFormDetails.password
                }
                name="password"
                onChange={(e) => {
                  currentState === "Sign up"
                    ? signUpFormChange(e)
                    : loginFormChange(e);
                }}
                className=" p-2 border border-gray-500 rounded-md focus:outline-none placeholder-black"
                placeholder="password"
                required
              />

              <button
                type="submit"
                
                className="cursor-pointer w-[60%] m-auto h-12 flex justify-center items-center pl-3 pr-3 bg-[#51074b] rounded-full text-white  "
              >
                {currentState == "Sign up" ? "Create Account" : "Login Now"}
              </button>

              {/* privacy policy message */}
              <div className="flex gap-2">
                <input type="checkbox" required className="cursor-pointer" />
                <p>Agree to terms of use and privacy policy.</p>
              </div>

              <div>
                {currentState === "Sign up"
                  ? "Already have an account ?"
                  : "Create an account "}
                <span
                  onClick={() =>
                    setcurrentState(
                      currentState === "Sign up" ? "Log In" : "Sign up"
                    )
                  }
                  className=" text-cyan-300 cursor-pointer"
                >
                  {currentState === "Sign up" ? "Login here" : "Click here"}
                </span>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
