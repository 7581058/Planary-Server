import bcrypt from "bcrypt";
import db from "../../database.js";

const saltRounds = 10;

export const createUser = async (userData) => {
  try {
    const { username, email, password, birth, agree } = userData;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sql = `INSERT INTO user (username, email, password, birth, agree, create_time) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;

    const [results] = await db.execute(sql, [
      username,
      email,
      hashedPassword,
      birth,
      agree,
    ]);

    if (!results) {
      throw new Error("Database query error: Empty result");
    }

    return results;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

export const getUsers = async () => {
  try {
    const sql = `SELECT user_id, username, email, birth, agree, create_time FROM user`;
    const [results] = await db.execute(sql);
    return results;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

export const getUserByUserID = async (id) => {
  try {
    const sql = `SELECT username, email, birth FROM user WHERE user_id = ?`;
    const [results] = await db.execute(sql, [id]);
    return results[0];
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

export const getUserByUserEmail = async (email) => {
  try {
    const sql = `SELECT * FROM user WHERE email = ?`;
    const [results] = await db.execute(sql, [email]);
    return results[0];
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};

export const updateUser = async (data) => {
  try {
    const sql = `UPDATE user SET username = ?, email = ?, password = ?, birth = ?, agree = ?, WHERE user_id = ?`;
    const [result] = await db.execute(sql, [
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

export const deleteUser = async (id) => {
  try {
    const sql = `DELETE FROM user WHERE user_id = ?`;
    const [result] = await db.execute(sql, [id]);
    return result;
  } catch (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
};
