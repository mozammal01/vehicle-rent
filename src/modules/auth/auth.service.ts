import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signupUser = async (name: string, role: string, email: string, password: string, age: number, phone: string, address: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users(name, role, email, password, age, phone, address) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, role, email, hashedPassword, age, phone, address]
  );

  const data = {
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
    phone: result.rows[0].phone,
    role: result.rows[0].role,
  };
  
  return data;
};

const loginUser = async (email: string, password: string) => {
  console.log({ email });
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

  console.log({ result });
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  const userData = result.rows[0];

  const match = await bcrypt.compare(password, userData.password);

  console.log({ match, userData });
  if (!match) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ name: userData.name, email: userData.email, role: userData.role }, config.jwtSecret as string, {
    expiresIn: "7d",
  });
  console.log({ token });

  const user = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    role: userData.role,
  };
  return { token, user };
};

export const authServices = {
  loginUser,
  signupUser,
};
