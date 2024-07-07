import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const result = jwt.verify(token, process.env.JWT_SECRET);
      req.id = result.userId;
      req.role = result.role;
      next();
    } catch (err) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Authorization header missing",
    });
  }
};
