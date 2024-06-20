import { tokenVerify } from "../utils/jwt-util.js";

export const authJWT = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split("Bearer ")[1];
    const result = tokenVerify(token);
    if (result.success) {
      req.id = result.id;
      req.role = result.role;
      next();
    }
  } else {
    res.status(401).send({
      success: false,
      message: result.message,
    });
  }
};
