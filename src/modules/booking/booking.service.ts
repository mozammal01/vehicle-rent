import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date, status } = payload;

  let newStatus = status || "active";

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
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, newStatus]
  );

  await pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`, [vehicle_id]);

  const data = {
    ...result.rows[0],
    vehicle: vehicle,
  };
  return data;
};

const getBooking = async (role: string, email?: string) => {

  let query = `
    SELECT 
      b.*,
      v.vehicle_name,
      v.registration_number,
      v.type as vehicle_type,
      u.name as customer_name,
      u.email as customer_email
    FROM bookings b
    LEFT JOIN vehicles v ON b.vehicle_id = v.id
    LEFT JOIN users u ON b.customer_id = u.id
  `;

  let result;

  if (role === "customer" && email) {
    const userResult = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (userResult.rows.length === 0) {
      throw new Error("User not found");
    }
    const customerId = userResult.rows[0].id;

    query += ` WHERE b.customer_id = $1`;
    result = await pool.query(query, [customerId]);
  } else {
    result = await pool.query(query);
  }

  const bookings = result.rows.map((row) => {
    const vehicleObj: any = {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
    };
    const customerObj: any = {
      name: row.customer_name,
      email: row.customer_email,
    };

    if (role === "customer") {
      vehicleObj.type = row.vehicle_type;
    }

    return {
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: row.total_price,
      status: row.status,
      ...(role === "admin" && { customer: customerObj }),
      vehicle: vehicleObj,
    };
  });

  if (role === "customer" && bookings.length === 0) {
    return {
      success: false,
      message: "No bookings found",
      data: [],
    };
  }

  return {
    success: true,
    message: "Bookings retrieved successfully",
    data: bookings,
  };
};



const updateBooking = async (status: string, id: string, role: string, email: string) => {
  const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [id]);

  if (bookingResult.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingResult.rows[0];

  const customerResult = await pool.query(`SELECT * FROM users WHERE id = $1`, [booking.customer_id]);

  // Customer
  if (role === "customer") {
    if (email === customerResult.rows[0].email) {
      if (status === "cancelled") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(booking.rent_start_date);
        startDate.setHours(0, 0, 0, 0);

        if (today >= startDate) {
          throw new Error("Cannot cancel booking after the start date");
        }

        const result = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`, [status, id]);

        await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);

        return {
          ...result.rows[0],
          vehicle: {
            availability_status: "available",
          },
        };
      } else {
        throw new Error("Invalid status . Customer can only cancel booking before the start date");
      }
    } else {
      throw new Error("You are not authorized to update this booking");
    }
  }

  // Admin
  if (role === "admin") {
    if (status === "returned") {
      const result = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`, [status, id]);

      await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);

      return {
        ...result.rows[0],
        vehicle: {
          availability_status: "available",
        },
      };
    } else {
      throw new Error("Invalid status . Admin can only mark booking as returned");
    }
  }

  const result = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`, [status, id]);

  return result.rows[0];
};

export const bookingServices = {
  createBooking,
  getBooking,
  updateBooking,
};
