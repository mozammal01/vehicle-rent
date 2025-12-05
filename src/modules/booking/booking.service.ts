import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  let tempStatus = "active";

  const vehicleInfo = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicle_id]);
  if (vehicleInfo.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  if (vehicleInfo.rows[0].availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);
  const diffTime = endDate.getTime() - startDate.getTime();
  const number_of_days = diffTime / (1000 * 60 * 60 * 24);

  const total_price = number_of_days * vehicleInfo.rows[0].daily_rent_price;

  const vehicle = {
    name: vehicleInfo.rows[0].vehicle_name,
    daily_rent_price: vehicleInfo.rows[0].daily_rent_price,
  };

  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, tempStatus]
  );

  const data = {
    ...result.rows[0],
    vehicle: vehicle,
  };
  return data;
};

const getBooking = async () => {
  const result = await pool.query(`SELECT * FROM bookings`);
  return result;
};

const updateBooking = async (
  customer_id: string,
  vehicle_id: string,
  rent_start_date: string,
  rent_end_date: string,
  total_price: number,
  status: string,
  id: string
) => {
  const result = await pool.query(
    `UPDATE bookings SET customer_id=$1, vehicle_id=$2, rent_start_date=$3, rent_end_date=$4, total_price=$5, status=$6 WHERE id=$7 RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, id]
  );

  return result;
};

export const bookingServices = {
  createBooking,
  getBooking,
  updateBooking,
};
