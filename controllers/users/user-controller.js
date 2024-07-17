import {
  getUserByUserEmail,
  registration,
} from "../../services/users/user-service.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password, birth, agree } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      !birth ||
      typeof agree !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Username, email, password, birth and agree are required",
      });
    }

    const result = await registration(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const results = await getUserByUserEmail(email);

    if (!results) {
      return res.status(402).json({
        success: false,
        message: "Invalid Email or Password",
      });
    } else {
      const isMatch = await bcrypt.compare(password, results.password);
      if (isMatch) {
        const token = jwt.sign(
          { userId: results.user_id },
          process.env.JWT_SECRET,
          {
            expiresIn: "36h",
          }
        );
        return res.status(200).json({
          success: true,
          message: "Login successfully",
          token: token,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid Email or Password",
        });
      }
    }
  } catch (err) {
    console.error("Error logging in:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
