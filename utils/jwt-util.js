import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const tokenVerify = (token) => {
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      success: true,
      id: decoded.id,
      role: decoded.role,
    };
  } catch (error) {
    return {
      success: false,
      message: err.message,
    };
  }
};
