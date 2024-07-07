import express from "express";
import usersRouter from "./users/user-router.js";
import boardRouter from "./board/board-router.js";
const router = express.Router();

router.use("/users", usersRouter);
router.use("/dashboard", boardRouter);

export default router;
