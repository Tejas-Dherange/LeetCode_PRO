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
      secure: true, // Always true in production
      sameSite: "none", // Required for cross-domain
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

    console.log("User found:", user.email);
    console.log("User has password:", !!user.password);
    console.log("User has googleId:", !!user.googleId);

    // Check if user has a password (OAuth users may not have one)
    if (!user.password) {
      console.log("Login rejected: No password set for user");
      return res.status(400).json({
        oauthOnly: true,
        message: "Account created with Google. Use Google login or set a password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);
    
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

    console.log("Login successful for:", user.email);

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

const setPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    console.log("Setting password for user:", userId);
    console.log("New password provided:", !!newPassword);

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    if (!confirmPassword) {
      return res.status(400).json({ message: "Confirm password is required" });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("Password hashed successfully");

    // Update user password
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    console.log("User password updated:", updatedUser.id);
    console.log("Password field is now:", updatedUser.password ? "SET" : "NULL");

    return res.status(200).json({
      success: true,
      message: "Password set successfully. You can now login with email and password.",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        hasPassword: !!updatedUser.password
      }
    });
  } catch (error) {
    console.error("Error setting password:", error);
    return res.status(500).json({ 
      message: "Something went wrong",
      error: error.message 
    });
  }
};

const googleCallback = async (req, res) => {
  try {
    // User is attached by passport after successful authentication
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.CLIENT_HOME_URL}/login?error=authentication_failed`);
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // Required for cross-domain
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });

    // Redirect to client home page
    const frontendURL = process.env.FRONTEND_URL || "https://www.codeloom.software";
    return res.redirect(`${frontendURL}/dashboard`);
  } catch (error) {
    console.log(error);
    return res.redirect(`${process.env.CLIENT_HOME_URL}/login?error=server_error`);
  }
};

export { register, login, logout, me, editProfile, setPassword, googleCallback };
