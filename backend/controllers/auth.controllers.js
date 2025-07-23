import db from "../libs/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "../src/generated/prisma/index.js";
import { uploadImage } from "../libs/cloudinary.lib.js";

const register = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;
    console.log("name ", name);

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        image,
        role: UserRole.USER,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not created" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });

    return res
      .status(200)
      .json({ message: "User logged in successfully", token, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies?.token;

    console.log(token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const me = async (req, res) => {
  try {
    const user = req?.user;
    // console.log("user in me controller:", user);
    
    return res.status(200).json({
      sucess: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const editProfile = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const body = req.body || {};
    const { name, email } = body;
    const userId = req.user.id;
    let imageUrl = undefined;

    // If file is present, upload to Cloudinary and get URL
    if (req.file) {
      const result = await uploadImage(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // Update user in DB
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        ...(imageUrl ? { image: imageUrl } : {}),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export { register, login, logout, me, editProfile };
