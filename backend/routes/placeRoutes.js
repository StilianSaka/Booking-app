import express from "express";
const router = express.Router();
import {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  createPlaceReview,
  getTopPlaces,
} from "../controllers/placeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getPlaces).post(protect, admin, createPlace);
router.route("/:id/reviews").post(protect, createPlaceReview);
router.get("/top", getTopPlaces);
router
  .route("/:id")
  .get(getPlaceById)
  .put(protect, admin, updatePlace)
  .delete(protect, admin, deletePlace);

export default router;
