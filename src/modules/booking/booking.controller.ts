import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

const getBooking = async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).user?.role;
    const userEmail = (req as any).user?.email;
    const result = await bookingServices.getBooking(userRole, userEmail);

    res.status(200).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const { status } = req.body;
  const {role, email} = (req as any).user;

  try {
    const result = await bookingServices.updateBooking(status, req.params.id as string, role, email);

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    } else {
      // Determine appropriate message based on status
      let message = "Booking updated successfully";
      if (status === "returned") {
        message = "Booking marked as returned. Vehicle is now available";
      } else if (status === "cancelled") {
        message = "Booking cancelled successfully. Vehicle is now available";
      }

      res.status(200).json({
        success: true,
        message: message,
        data: result,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

export const bookingController = {
  createBooking,
  getBooking,
  updateBooking,
};
