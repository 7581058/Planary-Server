import db from "../../database.js";
import { defaultWidgets } from "../../constants/defaultWigets.js";

export const createWidgets = async (dashboardId, widgetsData) => {
  try {
    const widgetSql = `INSERT INTO dashboard_widgets (dashboard_id, i, x, y, w, h, minW, maxW, minH, maxH, component_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    for (const widget of widgetsData) {
      const { i, x, y, w, h, minW, maxW, minH, maxH, component } = widget;

      const [results] = await db.execute(widgetSql, [
        dashboardId,
        i,
        x,
        y,
        w,
        h,
        minW,
        maxW,
        minH,
        maxH,
        component,
      ]);

      if (!results || results.affectedRows === 0) {
        throw new Error("Database query error: Empty result");
      }
    }

    return true;
  } catch (error) {
    console.error("Error in createDashboard:", error);
    throw new Error(`Database query error: ${error.message}`);
  }
};

export const createDashboard = async (boardData) => {
  try {
    const { dashboard_title, user_id, theme } = boardData;
    const sql = `INSERT INTO dashboards (dashboard_title, user_id, theme, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

    const [results] = await db.execute(sql, [dashboard_title, user_id, theme]);

    if (!results) {
      throw new Error("Database query error: Empty result");
    }
    const dashboardId = results.insertId;
    await createWidgets(dashboardId, defaultWidgets);

    return dashboardId;
  } catch (error) {
    console.error("Error in createDashboard:", error);
    throw new Error(`Database query error: ${error.message}`);
  }
};

export const getDashboardList = async (id) => {
  try {
    const sql = `SELECT dashboard_id, dashboard_title, theme FROM dashboards WHERE user_id = ?`;
    const [results] = await db.execute(sql, [id]);
    return results;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

export const getDashboard = async (dashboardId, userId) => {
  try {
    const sql = `SELECT * FROM dashboard_widgets WHERE dashboard_id = ?`;
    const [results] = await db.execute(sql, [dashboardId]);
    return results;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

export const updateDashboard = async (data) => {
  try {
    const sql = `UPDATE dashboards SET theme = ?, dashboard_title = ? WHERE dashboard_id = ?`;
    const [result] = await db.execute(sql, [data.theme, data.dashboard_title]);
    return result;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

export const deleteDashboard = async (id) => {
  try {
    const sql = `DELETE FROM dashboards WHERE dashboard_id = ?`;
    const [result] = await db.execute(sql, [id]);
    return result;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};
