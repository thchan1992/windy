import express, { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();
router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(409).json({ message: "User already exists with this email" });
    } else {
      const newUser = new User({ email, password });
      await newUser.save();
      res.status(201).json({ message: "User created", userId: newUser._id });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user", error });
  }
});

router.get(
  "/verifySession",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      res.status(201).json({ message: "Verification successed." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error verifying your identify.", error });
    }
  }
);

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const jwtSecret: string = process.env.JWTSECRET!;
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      // secure: process.env.NODE_ENV !== "development",
      sameSite: "none", // against CSRF
      maxAge: 3600000, // Expires in 1 hour
    });

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
