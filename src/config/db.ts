import { Pool } from "pg";
import config from "./index";

export const pool = new Pool({
  connectionString: config.connection_str,
  ssl: { rejectUnauthorized: false },
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'customer')),
        email VARCHAR(150) NOT NULL UNIQUE CHECK (email = LOWER(email)),
        password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
        age INT,
        phone VARCHAR(100) NOT NULL,
        address TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'suv')),
        registration_number VARCHAR(100) NOT NULL UNIQUE,
        daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(50) NOT NULL CHECK (availability_status IN ('available', 'booked'))
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
        total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
        status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned'))
      )
    `);
  } catch (error) {
    throw new Error("DB INIT ERROR");
  }
};

export default initDb;
