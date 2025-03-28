import connectDB from "../config/connectDB.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import transporter from "../config/nodemailer.js";
import crypto from "crypto";

connectDB();

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: "Data is required" });
  }

  try {
    const isExistUser = await userModel.findOne({ email });

    if (isExistUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const routeId = crypto.randomUUID();

    const user = new userModel({ name, email, password: hashedPassword, routeId });
    await user.save();

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });

    const savedUser = await userModel.findById(user._id).select("-password");

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Data is required" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "Email is not defined" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Password" });
    }

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, routeId: user.routeId },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User is not defined" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyOtp = otp;
    await user.save();

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verification Code :)",
      text: `Your Verification Code: ${otp}`,
    });

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const checkOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Data is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User is not defined" });
    }

    if (user.verifyOtp === otp) {
      user.verifyOtp = "";
      await user.save();
      return res.status(200).json({ success: true, message: "OTP verified" });
    } else {
      return res.status(400).json({ success: false, message: "Wrong OTP" });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });
  return res.status(200).json({ message: "Logout successful" });
};

export const resetPassword = async (req,res) => {
  const {newPassword,email} = req.body

  if (!newPassword || !email ) {
    return res.status(400).json({success:false,message:"Data are required"})
  }

  try {
    const user = await userModel.findOne({ email });
 
    if (!user) {
       return res.status(400).json({ success: false, message: "User not found" });
    }
 
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
 
    return res.status(200).json({ success: true, message: 'Password successfully changed' });
 
 } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
 }
 

}