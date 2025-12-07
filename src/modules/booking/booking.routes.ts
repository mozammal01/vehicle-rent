import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingController } from "./booking.controller";
import autoReturnExpiredBookings from "../../middleware/autoReturn";

const router = Router();

router.post("/", auth("admin", "customer"), autoReturnExpiredBookings(), bookingController.createBooking);

router.get("/", auth("admin", "customer"), autoReturnExpiredBookings(), bookingController.getBooking);

router.put("/:bookingId", auth("admin", "customer"), autoReturnExpiredBookings(), bookingController.updateBooking);

export const bookingRoutes = router;
