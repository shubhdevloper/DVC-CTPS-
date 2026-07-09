import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createOutgoingRecord,
  getOutgoingRecords,
  verifyOutgoingRecord,
  rejectOutgoingRecord
} from "../controllers/outgoingController.js";
const router = express.Router();

router.post(
  "/",
  protect,
  createOutgoingRecord
);
router.get(
  "/",
  protect,
  getOutgoingRecords
);

router.patch(
  "/:id/verify",
  protect,
  verifyOutgoingRecord
);
router.patch(
  "/:id/reject",
  protect,
  rejectOutgoingRecord
);
export default router;