import express from "express";
import {
  getBoard,
  getBoardList,
} from "../../controllers/dashboard/dashboard-controller.js";
import { authJWT } from "../../auth/auth-jwt.js";
const boardRouter = express.Router();

// 대시보드 생성 '/dashboard/create'
boardRouter.post("/create", createBoard);

// 대시보드 목록 조회 '/dashboard/list'
boardRouter.get("/list", authJWT, getBoardList);

// 대시보드 조회 '/dashboard/22'
boardRouter.get("/:boardId", authJWT, getBoard);

// 대시보드 수정 '/dashboard/22
//boardRouter.put("/:boardId", createBoard);

// 대시보드 수정 '/dashboard/22
//boardRouter.delete("/boardId", createBoard);

export default boardRouter;
