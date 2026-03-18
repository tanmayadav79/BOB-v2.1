import { Request, Response } from "express";
import { db } from '../config/prismaClient';
import bcrypt from 'bcryptjs';
import { sign, verify } from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { username , mobileNo, college, password } = req.body;
  try {
    if (!username || !mobileNo || !college || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const mobileRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!mobileRegex.test(mobileNo)) {
      return res.status(400).json({ message: "Invalid mobile number." });
    }

    const existingUser = await db.user.findFirst({ where: { mobileNo } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this mobile number." });
    }

    const existingUserName = await db.user.findUnique({ where: { username } });
    if (existingUserName) {
      return res.status(400).json({ message: "Username is already taken." });
    }

    const isValidPassword = (pwd: string) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+{};:,<.>]).{8,}$/;
      return passwordRegex.test(pwd);
    };

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: "Password is not strong enough." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.user.create({
      data: {
        username: username,
        mobileNo: mobileNo,
        college: college,
        password: hashedPassword,
        role: 'student',
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await db.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid username, user not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password, please try again." });
    }

    const data = { 
      id: user.id, 
      username: user.username, 
      mobileNo: user.mobileNo, 
      college: user.college,
      role: user.role
    };
    const token = sign(data, process.env.JWT_SECRET as string, { expiresIn: "2h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      message: "user signed in successfully",
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const session = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = verify(token, process.env.JWT_SECRET as string);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await db.user.findUnique({ where: { id: (decoded as any).id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ authenticated: true, user: decoded });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie('token', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 0,
      expires: new Date(0)
    });
    return res.json({ message: "User logged out successfully", success: true }); 
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
}