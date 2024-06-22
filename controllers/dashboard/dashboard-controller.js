import { createDashboard } from "../../services/dashboard/dashboard-service.js";

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
