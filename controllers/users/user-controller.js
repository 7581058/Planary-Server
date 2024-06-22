import {
  createUser,
  getUserByUserEmail,
} from "../../services/users/user-service.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { createDashboard } from "../../services/dashboard/dashboard-service.js";

dotenv.config();

const saltRounds = 10;
export const register = async (req, res) => {
  try {
    const { username, email, password, birth } = req.body;

    if (!username || !email || !password || !birth) {
      return res.status(400).json({
        success: false,
        message: "Username, email, password, and birth are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = { ...req.body, password: hashedPassword };
    const userResult = await createUser(userData);

    await createDashboard({
      dashboard_title: "myDashboard",
      user_id: userResult.insertId,
      theme: "default",
    });

    res.status(200).json({
      success: true,
      message: "User and dashboard registered successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
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
      return res.json({
        success: false,
        message: "Invalid ID or Password",
      });
    }

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
        message: "Invalid ID or Password",
      });
    }
  } catch (err) {
    console.error("Error logging in:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
