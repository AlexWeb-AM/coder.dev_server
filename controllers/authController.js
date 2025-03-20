import connectDB from "../config/connectDB.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

connectDB();

export const Register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ success: false, message: "Data is required" });
  }

  try {
    const isExistUser = await userModel.findOne({ email });

    if (isExistUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const routeId = crypto.randomUUID();

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      routeId,
    });

    await user.save();

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const savedUser = await userModel.findById(user._id).select("-password");

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Data is required" });
  }

  try {
    const user = await userModel.findOne({email})

    if (!user) {
        return res.status(404).json({ success: false, message: "Email is Not defined" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Password" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          routeId: user.routeId,
        },
      });
      

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
