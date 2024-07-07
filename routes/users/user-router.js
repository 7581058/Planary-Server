import express from "express";
import { login, register } from "../../controllers/users/user-controller.js";
import { createBoard } from "../../controllers/dashboard/dashboard-controller.js";
const usersRouter = express.Router();

// 회원가입
usersRouter.post("/register", register);

// 로그인
usersRouter.post("/login", login);

//토큰검증 필요시 (엔드포인트, 토큰검증, 다음콜백)
//router.get('/profile', authJWT, editProfile);

export default usersRouter;
