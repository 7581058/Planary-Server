import {
  createDashboard,
  getDashboard,
  getDashboardList,
} from "../../services/dashboard/dashboard-service.js";

// 대시보드 생성
export const createBoard = async (req, res) => {
  try {
    const results = await createDashboard(req.body);

    if (!results) {
      return res.json({
        success: false,
        message: "Internal server error",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Create Dashboard successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 대시보드 목록
export const getBoardList = async (req, res) => {
  try {
    const results = await getDashboardList(req.id);
    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No dashboards found",
      });
    }

    const formattedResults = results.map((item) => ({
      title: item.dashboard_title,
      theme: item.theme,
      id: item.dashboard_id,
    }));

    return res.status(200).json({
      success: true,
      message: "Get Dashboard List successfully",
      boardList: formattedResults,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 대시보드
export const getBoard = async (req, res) => {
  if (req.id) {
    const boardId = req.params.id;
    try {
      const results = await getDashboard(boardId);

      if (!results) {
        return res.json({
          success: false,
          message: "Internal server error",
        });
      }

      const formattedResults = results.map((item) => ({
        i: item.widget_id.toString(),
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        component: item.component_type,
      }));

      return res.status(200).json({
        success: true,
        message: "Get Dashboard successfully",
        lg: formattedResults,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
