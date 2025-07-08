import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from './../context/AppContex';
import axios from "axios";
import { toast } from "react-toastify";


const EmailVerify = () => {
  axios.defaults.withCredentials =true;
  const {backendUrl ,  isLoggedin, userData, getUserData} = useContext(AppContext)
  const inputRef = React.useRef([]);
  const navigate = useNavigate();
  const handleInput = (e, index)=>{
    if(e.target.value.length > 0 && index < inputRef.current.length - 1){
      inputRef.current[index + 1].focus()
    }
  }
  const handleKeyDown = (e, index)=>{
    if(e.key === "Backspace" && e.target.value === "" && index > 0){
      inputRef.current[index - 1].focus()
    }
  }

  const handlePaste = (e)=>{
    const paste = e.clipboardData.getData("text")
    const pasteArray = paste.split("")
    pasteArray.forEach((char,index) => {
      if(inputRef.current[index]){
        inputRef.current[index].value= char;
      }
    });
  }
  const onSubmitHandler = async (e)=>{
    try {
      e.preventDefault();
      const otpArray = inputRef.current.map(e => e.value)
      const otp = otpArray.join("")

      const {data} = await axios.post(backendUrl + "/api/auth/verify-account", {otp})

      if(data.success){
        toast.success(data.message)
        getUserData()
        navigate('/')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }
  }
  useEffect(() => {
   isLoggedin && userData && userData.isAccountVerified && navigate('/')
    
  }, [isLoggedin,userData])
  
  return (
    <section className="flex justify-center  items-center px-5 min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt="logo"
        className="absolute left-20 top-5 cursor-pointer w-36"
        onClick={() => navigate("/")}
      />
      <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code send to your email id.{" "}
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => {
              return (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-10 h-10 rounded-md text-lg outline-none text-center bg-[#333A5C] text-white "
                  ref={(e) => (inputRef.current[index] = e)}
                  onInput = {(e)=>handleInput(e,index)}
                  onKeyDown={(e)=> handleKeyDown(e, index)}
                  
                />
              );
            })}
        </div>
        <button className="block mx-auto px-16 py-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-800 text-white">
          Verify Email
        </button>
      </form>
    </section>
  );
};

export default EmailVerify;
