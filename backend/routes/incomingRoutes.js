import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createIncomingRecord,
  getIncomingRecords,
  verifyIncomingRecord,
  rejectIncomingRecord
} from "../controllers/IncomingController.js";
const router = express.Router();

router.post(
  "/",
  protect,
  createIncomingRecord
);
router.get(
  "/",
  protect,
  getIncomingRecords
);
router.patch(
  "/:id/verify",
  protect,
  verifyIncomingRecord
);
router.patch(
  "/:id/reject",
  protect,
  rejectIncomingRecord
);
export default router;