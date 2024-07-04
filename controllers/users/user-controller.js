import {
  createUser,
  getUserByUserEmail,
} from "../../services/users/user-service.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { createDashboard } from "../../services/dashboard/dashboard-service.js";
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

    try {
      const userResult = await createUser(req.body);
      if (userResult) {
        try {
          const dashboardResult = await createDashboard({
            dashboard_title: "myDashboard",
            user_id: userResult.insertId,
            theme: "default",
          });
          if (dashboardResult) {
            res.status(201).json({
              success: true,
              message: "User and dashboard registered successfully",
            });
          }
        } catch (err) {
          console.error("Error creating dashboard:", err);
          return res.status(500).json({
            success: false,
            message: "Internal server error during dashboard creation",
          });
        }
      }
    } catch (err) {
      console.error("Error creating user:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error during user creation",
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
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
