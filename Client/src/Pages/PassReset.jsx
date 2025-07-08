import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContex";
import { toast } from "react-toastify";

const PassReset = () => {
  const {backendUrl} = useContext(AppContext)

  axios.defaults.withCredentials= true;
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassowrd] = useState("");
  const [isEmailSent, setEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);
  const inputRef = React.useRef([]);
  const navigate = useNavigate();
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e)=>{
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + "/api/auth/send-reset-otp", {email})
      data.success ? toast.success(data.message) :toast.error(data.message)
      data.success && setEmailSent(true)
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOTP = async(e)=>{
      e.preventDefault();
      const otpArray = inputRef.current.map(e=>e.value)
      setOtp(otpArray.join(""))
      setIsOtpSubmited(true)
  }
  const onSubmitNewPassword = async (e) =>{
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + "/api/auth/reset-password", {email, otp, newPassword})
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate("/login")
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
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address.{" "}
          </p>
          <div className="mb-6 flex items-center gap-3 w-full px-5 py-2.5  rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="w-3 h-3" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="bg-transparent outline-none w-full text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="block mx-auto px-16 py-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-800 text-white">
            Submit
          </button>
        </form>
      )}
      {!isOtpSubmited && isEmailSent && (
        <form onSubmit={onSubmitOTP} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset password OTP
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
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                );
              })}
          </div>
          <button className="block mx-auto px-16 py-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-800 text-white">
            Submit
          </button>
        </form>
      )}
      {/*  */}

      {isOtpSubmited && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your new password.{" "}
          </p>
          <div className="mb-6 flex items-center gap-3 w-full px-5 py-2.5  rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="w-3 h-3" />
            <input
              type="password"
              name="password"
              placeholder="New Password"
              className="bg-transparent outline-none w-full text-white"
              value={newPassword}
              onChange={(e) => setNewPassowrd(e.target.value)}
              required
            />
          </div>
          <button className="block mx-auto px-16 py-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-800 text-white">
            Submit
          </button>
        </form>
      )}
    </section>
  );
};

export default PassReset;
