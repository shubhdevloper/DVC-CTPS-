import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import {
  protect,
  isSuperAdmin,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.get(
  "/",
  protect,
  getAnnouncements
);

router.post(
  "/",
  protect,
  isSuperAdmin,
  upload.single("pdf"),
  createAnnouncement
);

router.delete(
  "/:id",
  protect,
  isSuperAdmin,
  deleteAnnouncement
);

export default router;