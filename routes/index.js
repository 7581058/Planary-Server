import express from "express";
import usersRouter from "./users/user-router.js";
import boardRouter from "./board/board-router.js";
import ddayRouter from "./widget/dday-router.js";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/dashboard", boardRouter);
router.use("/dday", ddayRouter);
export default router;
