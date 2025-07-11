import bcrypt, { truncates } from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/usermodels.js";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE , PASSWORD_RESET_TEMPLATE, REGISTER_TEMPLATE } from "../config/emailConfig.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Details missing" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashedPassword });

    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    // Sending Mail
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Authify",
      // text: `Welcome to Rabbi's website. Your account has been create by this email id: ${email}`,
      html:REGISTER_TEMPLATE.replace("{{name}}", user.name)
    };
    await transporter.sendMail(mailOption);
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Send verification otp on the user's email

export const sendVerifyOtp = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id)
    // const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification Otp",
      // text: `Your Otp is ${otp}. Verify your acconut using this OTP`,
      html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    };
    await transporter.sendMail(mailOption);
    return res.json({
      success: true,
      message: "Verification Otp send on Email",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const {otp } = req.body;

  if (!otp) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid Otp" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "Otp is expired" });
    }
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const isAuthencated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Password Reset Opt

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: true, message: "User not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      // text: `Your OTP is resetting your password is ${otp}. Use this OTP to reseting your password.`,
      html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    };
    await transporter.sendMail(mailOption);
    return res.json({ success: true, message: "OTP send your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Reset User Password

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if ((!email, !otp, !newPassword)) {
    return res.json({
      success: false,
      message: "Email, OTP, and new Password are required",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    (user.resetOtp = ""), (user.resetOtpExpireAt = 0);
    await user.save();
    return res.json({success:true, message:"Password has been reset successfully"})
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
