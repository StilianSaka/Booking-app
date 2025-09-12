import express from "express";
const router = express.Router();
import {
  addBookingItems,
  getMyBookings,
  getBookingById,
  updateBookingToPaid,
  updateBookingToDelivered,
  getBookings,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, addBookingItems)
  .get(protect, admin, getBookings);
router.route("/mine").get(protect, getMyBookings);
router.route("/:id").get(protect, getBookingById);
router.route("/:id/pay").put(protect, updateBookingToPaid);
router.route("/:id/deliver").put(protect, admin, updateBookingToDelivered);

export default router;
