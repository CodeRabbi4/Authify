import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContex";
import axios from "axios";
import { toast } from "react-toastify";


const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin,getUserData} = useContext(AppContext);
  const [state, setState] = useState("Signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submitHandler = async(e)=>{
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true
      if (state === "Signup") {
       const {data} =  await axios.post(backendUrl + "/api/auth/register", {name,email,password})
       if(data.success){
        toast.success("Account created successfully!")
        setIsLoggedin(true)
        getUserData()
        navigate('/')
       }else{
        toast.error(data.message)
      
       }
      } else {
        const {data} =  await axios.post(backendUrl + "/api/auth/login", {email,password})
       if(data.success){
        setIsLoggedin(true)
        getUserData()
        navigate('/')
      }else{
        toast.error(data.message)
      
       }
      }
      
    } catch (error) {
      toast.error(error.message)
      
    }
  }

  return (
    <section className="flex justify-center  items-center px-5 min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt="logo"
        className="absolute left-20 top-5 cursor-pointer w-36"
        onClick={() => navigate("/")}
      />
      <div className="bg-slate-900 w-full sm:w-96 lg:w-1/3 p-10 rounded-lg shadow-lg text-sm text-white">
        <h2 className="text-2xl font-semibold mb-3 text-center">
          {state === "Signup" ? "Create Account" : "Login"}
        </h2>
        <h2 className="text-sm mb-6 text-center">
          {state === "Signup" ? "Create your account" : "Login your account"}
        </h2>
        <form onSubmit={submitHandler}>
          {state === "Signup" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="fullname" />
              <input
                type="text"
                placeholder="Fullname"
                required
                className="bg-transparent outline-none w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="fullname" />
            <input
              type="email"
              placeholder="Email"
              required
              className="bg-transparent outline-none w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="fullname" />
            <input
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p
            className="text-xs mb-4 text-indigo-500 cursor-pointer"
            onClick={() => navigate("/reset-password")}
          >
            Forget Password?
          </p>

          <button className="block mx-auto px-16 py-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-800">
            {state}
          </button>
        </form>
        {state === "Signup" ? (
          <p className="text-xs text-gray-400 text-center mt-3">
            Already have an account?
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 underline cursor-pointer"
            >
              {" "}
              Login
            </span>
          </p>
        ) : (
          <p className="text-xs text-gray-400 text-center mt-3">
            don't have an account?
            <span
              onClick={() => setState("Signup")}
              className="text-blue-400 underline cursor-pointer"
            >
              {" "}
              Signup
            </span>
          </p>
        )}
      </div>
    </section>
  );
};

export default Login;
