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
      return res.status(400).json({
        success: false,
        message: "Failed to create dashboard",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Dashboard created successfully",
    });
  } catch (err) {
    console.error("Error creating dashboard:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 대시보드 목록 조회
export const getBoardList = async (req, res) => {
  try {
    const results = await getDashboardList(req.id);

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No dashboards found for this user",
        boardList: [],
      });
    }

    const formattedResults = results.map((item) => ({
      title: item.dashboard_title,
      theme: item.theme,
      id: item.dashboard_id,
    }));

    return res.status(200).json({
      success: true,
      message: "Dashboard list retrieved successfully",
      boardList: formattedResults,
    });
  } catch (err) {
    console.error("Error retrieving dashboard list:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 대시보드 아이디로 해당 대시보드 전체 위젯 조회
export const getBoard = async (req, res) => {
  const boardId = req.params.boardId;

  try {
    const results = await getDashboard(boardId);

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No widgets found for this dashboard",
        lg: [],
      });
    }

    const formattedResults = results.map((item) => ({
      i: item.widget_id.toString(),
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      component: item.component_type,
      maxW: item.maxW,
      maxH: item.maxH,
      minW: item.minW,
      minH: item.minH,
    }));

    return res.status(200).json({
      success: true,
      message: "Dashboard retrieved successfully",
      lg: formattedResults,
    });
  } catch (err) {
    console.error("Error retrieving dashboard:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
