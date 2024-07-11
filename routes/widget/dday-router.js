import express from "express";
import { authJWT } from "../../auth/auth-jwt.js";
import {
  getDdayList,
  addDday,
  deleteDdayController,
  updateDdayController,
  updateDdayCarouselSettingController,
  updateDdayOrderController,
} from "../../controllers/widget/dday-controller.js";

const ddayRouter = express.Router();

// 디데이 생성
ddayRouter.post("/", authJWT, addDday);

// 디데이 목록 조회
ddayRouter.get("/:widgetId", authJWT, getDdayList);

// 디데이 삭제
ddayRouter.delete("/:ddayId", authJWT, deleteDdayController);

// 디데이 순서 수정
ddayRouter.put("/order", authJWT, updateDdayOrderController);

// 디데이 자동 재생 전환
ddayRouter.put("/:widgetId/auto", authJWT, updateDdayCarouselSettingController);

// 디데이 수정
ddayRouter.put("/:ddayId", authJWT, updateDdayController);

export default ddayRouter;
