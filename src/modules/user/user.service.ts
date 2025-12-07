import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const updateUser = async (
  name: string,
  email: string,
  updatedEmail: string,
  updatedRole: string,
  age: number,
  phone: number,
  role: string,
  address: string,
  id: string
) => {
  const userResult = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

  if (userResult.rows.length === 0) {
    throw new Error("User is not found");
  }

  const user = userResult.rows[0];

  const customerResult = await pool.query(`SELECT * FROM users WHERE id = $1`, [user.id]);

  // Customer
  if (role === "customer") {
    if (email === customerResult.rows[0].email) {
      const result = await pool.query(`UPDATE users SET name=$1, email=$2, age=$3, role=$4, phone=$5, address=$6 WHERE id=$7 RETURNING *`, [
        name,
        updatedEmail,
        age,
        updatedRole,
        phone,
        address,
        id,
      ]);
      const data = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone,
        role: result.rows[0].role,
      };
      return data;
    } else {
      throw new Error("You are not authorized to update this user");
    }
  }

  // Admin
  if (role === "admin") {
    const result = await pool.query(`UPDATE users SET name=$1, email=$2, age=$3, role=$4, phone=$5, address=$6 WHERE id=$7 RETURNING *`, [
      name,
      updatedEmail,
      age,
      updatedRole,
      phone,
      address,
      id,
    ]);

    const data = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      phone: result.rows[0].phone,
      role: result.rows[0].role,
    };

    return data;
  }

  throw new Error("You are not authorized to update this user");
};

const deleteUser = async (id: string) => {
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
