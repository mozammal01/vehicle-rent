import { NextFunction, Request, Response } from "express";
import { pool } from "../config/db";

const autoReturnExpiredBookings = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const expiredBookings = await pool.query(`SELECT id, vehicle_id FROM bookings WHERE status = 'active' AND rent_end_date < NOW()`);

      if (expiredBookings.rows.length === 0) {
        return next();
      }

      for (const booking of expiredBookings.rows) {
        await pool.query(`UPDATE bookings SET status = 'returned' WHERE id = $1`, [booking.id]);
        await pool.query(`UPDATE vehicles SET availability_status = 'available' WHERE id = $1`, [booking.vehicle_id]);
      }

      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        details: error,
      });
    }
  };
};

export default autoReturnExpiredBookings;
