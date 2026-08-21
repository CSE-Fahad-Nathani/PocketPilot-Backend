import bcrypt from "bcryptjs";
import pool from "../db.js";
import {
  CREATE_USER,
  GET_USER_BY_EMAIL,
  GET_ACTIVE_CYCLE_ID_FOR_USER,
} from "../sql/userQueries.js";

const buildAuthPayload = async (user) => {
  const cycleResult = await pool.query(GET_ACTIVE_CYCLE_ID_FOR_USER, [user.id]);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    cycleId: cycleResult.rows[0]?.id || null,
  };
};

export const register = async ({ name, email, password }) => {
  const existing = await pool.query(GET_USER_BY_EMAIL, [email]);

  if (existing.rows.length) {
    const error = new Error("Email already registered.");
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(CREATE_USER, [
    name.trim(),
    email.trim().toLowerCase(),
    passwordHash,
  ]);

  return buildAuthPayload(result.rows[0]);
};

export const login = async ({ email, password }) => {
  const result = await pool.query(GET_USER_BY_EMAIL, [email]);

  if (!result.rows.length) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const user = result.rows[0];
  const matched = await bcrypt.compare(password, user.password_hash);

  if (!matched) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  return buildAuthPayload({
    id: user.id,
    name: user.name,
    email: user.email,
  });
};
