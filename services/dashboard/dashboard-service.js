import pool from "../../database.js";
import { createDdaySettings } from "../widget/dday-service.js";

// 위젯 생성
export const createWidgets = async (dashboardData, widgetsData, connection) => {
  const queryRunner = connection || pool;
  try {
    const widgetSql = `INSERT INTO dashboard_widgets 
      (dashboard_id, i, x, y, w, h, minW, maxW, minH, maxH, component_type) 
      VALUES ?`;

    const values = widgetsData.map((widget) => [
      dashboardData.id,
      widget.i,
      widget.x,
      widget.y,
      widget.w,
      widget.h,
      widget.minW,
      widget.maxW,
      widget.minH,
      widget.maxH,
      widget.component,
    ]);

    const [results] = await queryRunner.query(widgetSql, [values]);

    if (!results.affectedRows) {
      throw new Error("Failed to create widgets: No rows affected");
    }

    const ddayWidgetIds = [];
    for (let i = 0; i < widgetsData.length; i++) {
      if (widgetsData[i].component === "dday") {
        ddayWidgetIds.push(results.insertId + i);
      }
    }

    for (const ddayWidgetId of ddayWidgetIds) {
      await createDdaySettings(ddayWidgetId, queryRunner);
    }

    return {
      id: results.insertId,
      ddayWidgetIds,
    };
  } catch (error) {
    console.error("Error in create Widget:", error);
    if (!connection) {
      throw new Error("Failed to create Widget");
    }
    throw error;
  }
};

// 대시보드 생성
export const createDashboard = async (boardData, connection) => {
  const queryRunner = connection || pool;
  try {
    const { dashboard_title, user_id, theme } = boardData;

    const lastOrder = await getLastOrderForDashboard(user_id);
    const nextOrder = lastOrder !== null ? lastOrder + 1 : 0;

    const sql = `INSERT INTO dashboards (dashboard_title, user_id, theme,dashboard_order, created_at, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

    const [results] = await queryRunner.query(sql, [
      dashboard_title,
      user_id,
      theme,
      nextOrder,
    ]);

    if (!results.affectedRows) {
      throw new Error("Failed to create dashboard: No rows affected");
    }

    return { id: results.insertId, ...boardData };
  } catch (error) {
    console.error("Error in create Dashboard:", error);
    if (!connection) {
      throw new Error("Failed to create Dashboard");
    }
    throw error;
  }
};

// 유저 대시보드 마지막 순서 조회
export const getLastOrderForDashboard = async (userId) => {
  try {
    const sql = `SELECT MAX(dashboard_order) as lastOrder FROM dashboards WHERE user_id = ?`;
    const [results] = await pool.query(sql, [userId]);
    return results[0].lastOrder !== null ? results[0].lastOrder : -1;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 유저아이디로 대시보드 목록 조회
export const getDashboardList = async (id) => {
  try {
    const sql = `SELECT dashboard_id, dashboard_title, theme FROM dashboards WHERE user_id = ?`;
    const [results] = await pool.query(sql, [id]);
    return results;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 대시보드 아이디로 대시보드 위젯 전체 조회
export const getDashboard = async (dashboardId) => {
  try {
    const sql = `SELECT * FROM dashboard_widgets WHERE dashboard_id = ?`;
    const [results] = await pool.query(sql, [dashboardId]);
    return results;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 대시보드 정보(테마, 타이틀) 수정
export const updateDashboard = async (data) => {
  try {
    const sql = `UPDATE dashboards SET theme = ?, dashboard_title = ? WHERE dashboard_id = ?`;
    const [result] = await pool.query(sql, [data.theme, data.dashboard_title]);
    return result;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 대시보드 삭제
export const deleteDashboard = async (id) => {
  try {
    const sql = `DELETE FROM dashboards WHERE dashboard_id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};
