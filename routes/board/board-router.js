import express from "express";
import {
  getBoard,
  getBoardList,
} from "../../controllers/dashboard/dashboard-controller.js";
import { authJWT } from "../../auth/auth-jwt.js";
const boardRouter = express.Router();

// 대시보드 생성
//boardRouter.post("/create", createBoard);

// 대시보드 목록 조회
boardRouter.get("/list", authJWT, getBoardList);

// 대시보드 조회
boardRouter.get("/:id", authJWT, getBoard);

// 대시보드 수정
//boardRouter.post("/dashboard", createBoard);

//토큰검증 필요시 (엔드포인트, 토큰검증, 다음콜백)
//router.get('/profile', authJWT, editProfile);

export default boardRouter;
