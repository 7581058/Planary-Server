import pool from "../../database.js";

// 디데이 추가
export const createDday = async (ddayData) => {
  try {
    const { widgetId, icon, title, date } = ddayData;

    const lastOrder = await getLastOrderForWidget(widgetId);
    const nextOrder = lastOrder !== null ? lastOrder + 1 : 0;

    const sql = `INSERT INTO ddays (icon, dday_title, d_day, widget_id, d_day_order) VALUES (?, ?, ?, ?, ?)`;

    const [results] = await pool.query(sql, [
      icon,
      title,
      date,
      widgetId,
      nextOrder,
    ]);

    if (!results) {
      throw new Error("Database query error: Empty result");
    }

    return results;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 디데이 같은 위젯 마지막 순서 조회
export const getLastOrderForWidget = async (widgetId) => {
  try {
    const sql = `SELECT MAX(d_day_order) as lastOrder FROM ddays WHERE widget_id = ?`;
    const [results] = await pool.query(sql, [widgetId]);
    return results[0].lastOrder !== null ? results[0].lastOrder : -1;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 디데이 조회
export const getDdays = async (widgetId) => {
  try {
    const sql = `
    SELECT
      COALESCE(ddays.dday_id, 'null') as dday_id,
      ddays.dday_title,
      ddays.d_day,
      ddays.d_day_order,
      ddays.icon,
      settings.carousel_auto
    FROM
      dday_settings settings
    LEFT JOIN
      ddays ON ddays.widget_id = settings.widget_id
    WHERE
      settings.widget_id = ?
    ORDER BY
      ddays.d_day_order ASC`;
    const [results] = await pool.query(sql, [widgetId]);
    return results;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 디데이 삭제
export const deleteDday = async (ddayId) => {
  try {
    const sql = `DELETE FROM ddays WHERE dday_id = ?`;
    const [result] = await pool.query(sql, [ddayId]);
    return result;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 디데이 수정
export const updateDday = async (ddayId, data) => {
  try {
    const sql = `UPDATE ddays SET icon = ?, dday_title = ?, d_day = ? WHERE dday_id = ?`;
    const [result] = await pool.query(sql, [
      data.icon,
      data.title,
      data.date,
      ddayId,
    ]);
    return result;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 디데이 캐러셀 자동재생 수정
export const updateDdayCarouselSetting = async (widgetId, data) => {
  try {
    const sql = `UPDATE dday_settings SET carousel_auto = ? WHERE widget_id = ?`;
    const [result] = await pool.query(sql, [data.isAuto, widgetId]);
    return result;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 디데이 순서 수정
export const updateDdayOrder = async (datas) => {
  try {
    const results = [];
    for (const data of datas) {
      const sql = `UPDATE ddays SET d_day_order = ? WHERE dday_id = ?`;
      const [result] = await pool.query(sql, [data.order, data.id]);
      results.push(result);
    }
    return results;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 디데이 설정 테이블(dday_settings) 생성
// registration -> createwidgets 에 연계됨
export const createDdaySettings = async (widgetId, queryRunner) => {
  const sql = `INSERT INTO dday_settings (widget_id, carousel_auto) VALUES (?, ?)`;
  const [result] = await queryRunner.query(sql, [widgetId, 0]);
  if (!result.affectedRows) {
    throw new Error("Failed to create Dday settings: No rows affected");
  }
  return result.insertId;
};
