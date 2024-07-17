import bcrypt from "bcrypt";
import pool from "../../database.js";
import {
  createDashboard,
  createWidgets,
} from "../dashboard/dashboard-service.js";
import { defaultWidgets } from "../../constants/defaultWigets.js";
const saltRounds = 10;

// 유저 생성,추가
export const createUser = async (userData, connection) => {
  const queryRunner = connection || pool;
  const { username, email, password, birth, agree } = userData;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const convertedAgree = agree ? 1 : 0;

  const sql = `INSERT INTO user (username, email, password, birth, agree, create_time) 
               VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;

  const [result] = await queryRunner.query(sql, [
    username,
    email,
    hashedPassword,
    birth,
    convertedAgree,
  ]);

  if (!result.affectedRows) {
    throw new Error("Failed to create user: No rows affected");
  }

  return { id: result.insertId, ...userData };
};

// 유저들 전부 조회
export const getUsers = async () => {
  try {
    const sql = `SELECT user_id, username, email, birth, agree, create_time FROM user`;
    const [results] = await pool.query(sql);
    return results;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 유저 아이디로 유저 조회 (이름, 이메일, 생년월일)
export const getUserByUserID = async (id) => {
  try {
    const sql = `SELECT username, email, birth FROM user WHERE user_id = ?`;
    const [results] = await pool.query(sql, [id]);
    return results[0];
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 유저 이메일로 유저 조회 (이름, 이메일, 비밀번호, 생년월일, 약관동의)
export const getUserByUserEmail = async (email) => {
  try {
    const sql = `SELECT * FROM user WHERE email = ?`;
    const [results] = await pool.query(sql, [email]);
    return results[0];
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 유저 수정
export const updateUser = async (data) => {
  try {
    const sql = `UPDATE user SET username = ?, email = ?, password = ?, birth = ?, agree = ?, WHERE user_id = ?`;
    const [result] = await pool.query(sql, [
      data.username,
      data.email,
      data.password,
      data.birth,
      data.user_id,
      data.agree,
    ]);
    return result;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// 유저 삭제
export const deleteUser = async (id) => {
  try {
    const sql = `DELETE FROM user WHERE user_id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

// (유저생성 -> 대시보드생성 -> 기본위젯생성 -> 디데이설정 생성)
// 트랜잭션 o
export const registration = async (userData) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userResult = await createUser(userData, connection);
    if (!userResult) throw new Error("Failed to create user");

    const dashboardResult = await createDashboard(
      {
        dashboard_title: "myDashboard",
        user_id: userResult.id,
        theme: "default",
      },
      connection
    );
    if (!dashboardResult) throw new Error("Failed to create dashboard");

    const widgetResults = await createWidgets(
      dashboardResult,
      defaultWidgets,
      connection
    );
    if (!widgetResults) throw new Error("Failed to create widgets");

    await connection.commit();
    return {
      userId: userResult.id,
      dashboardId: dashboardResult,
      widgets: widgetResults,
    };
  } catch (error) {
    await connection.rollback();
    console.error("Registration error:", error);
    throw error;
  } finally {
    connection.release();
  }
};
