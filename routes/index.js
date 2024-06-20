import express from "express";
import usersRouter from "./users/user-router";

const router = express.Router();

router.use("/users", usersRouter);

export default router;
