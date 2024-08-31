import {
  getDdays,
  createDday,
  deleteDday,
  updateDday,
  updateDdayCarouselSetting,
  updateDdayOrder,
} from "../../services/widget/dday-service.js";

// 디데이 조회
export const getDdayList = async (req, res) => {
  const widgetId = req.params.widgetId;
  try {
    const results = await getDdays(widgetId);
    const isAuto = results[0].carousel_auto;

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No ddays found",
        isAuto: isAuto,
        ddayList: [],
      });
    }

    const formattedResults = results
      .filter((item) => item.dday_id !== "null")
      .map((item) => ({
        icon: item.icon,
        title: item.dday_title,
        date: item.d_day,
        id: item.dday_id,
        order: item.d_day_order,
      }));

    return res.status(200).json({
      success: true,
      message: "Dday list retrieved successfully",
      isAuto: isAuto,
      ddayList: formattedResults,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 디데이 추가
export const addDday = async (req, res) => {
  try {
    const { widgetId, title, icon, date } = req.body;

    if (!widgetId || !title || !icon || !date) {
      return res.status(400).json({
        success: false,
        message: "WidgetId, title, icon, date are required",
      });
    }

    const results = await createDday(req.body);

    if (!results) {
      return res.status(400).json({
        success: false,
        message: "Failed to create dday",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dday created successfully",
    });
  } catch (err) {
    console.error("Error creating dday:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 디데이 삭제
export const deleteDdayController = async (req, res) => {
  try {
    const ddayId = req.params.ddayId;
    const results = await deleteDday(ddayId);

    if (!results) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete dday",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dday deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 디데이 수정
export const updateDdayController = async (req, res) => {
  try {
    const ddayId = req.params.ddayId;
    const results = await updateDday(ddayId, req.body);

    if (!results) {
      return res.status(400).json({
        success: false,
        message: "Failed to update dday",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dday updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 디데이 재생 수정
export const updateDdayCarouselSettingController = async (req, res) => {
  try {
    const widgetId = req.params.widgetId;
    const results = await updateDdayCarouselSetting(widgetId, req.body);

    if (!results) {
      return res.status(400).json({
        success: false,
        message: "Failed to update carousel setting",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dday carousel setting updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 디데이 순서 수정
export const updateDdayOrderController = async (req, res) => {
  try {
    const results = await updateDdayOrder(req.body);
    if (!results) {
      return res.status(400).json({
        success: false,
        message: "Failed to update dday order",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Dday Order updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
