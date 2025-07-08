import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContex";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setUserData(false);
      data.success && setIsLoggedin(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendVerifcationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp");
      if(data.success){
        navigate("/email-verify")
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <nav className="container mx-auto flex justify-between items-center py-3 px-4">
      <img src={assets.logo} alt="logo" />
      {userData ? (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white text-lg relative group cursor-pointer">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black pt-11 rounded">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm w-32">
              {!userData.isAccountVerified && (
                <li onClick={sendVerifcationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify Email
                </li>
              )}
              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex justify-center gap-1.5 font-medium border-2 border-gray-300 py-1.5 px-5 rounded-full"
        >
          Login
          <img src={assets.arrow_icon} alt="login" />
        </button>
      )}
    </nav>
  );
};

export default Navbar;
