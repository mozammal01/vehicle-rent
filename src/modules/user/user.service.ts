import { pool } from "../../config/db";
import bcrypt from "bcryptjs";


const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};


const updateUser = async (name: string, email: string, age: number, phone: number, address: string, id: string) => {
  const result = await pool.query(`UPDATE users SET name=$1, email=$2, age=$3, phone=$4, address=$5 WHERE id=$6 RETURNING *`, [
    name,
    email,
    age,
    phone,
    address,
    id,
  ]);

  return result;
};

const deleteUser = async (id: string) => {
  // Check if user has any active bookings
  const activeBookings = await pool.query(`SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'`, [id]);

  if (activeBookings.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

  return result;
};

export const userServices = {
  getUser,
  updateUser,
  deleteUser,
};
