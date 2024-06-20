import express from "express";
import { login, register } from "../../controllers/users/user-controller.js";

const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);

//토큰검증 필요시 (엔드포인트, 토큰검증, 다음콜백)
//router.get('/profile', authJWT, editProfile);

export default usersRouter;
