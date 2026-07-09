import express from "express";

import {
  getAllUsers,
  approveManager,
  rejectManager,
  toggleUserStatus,
  deleteUser,
} from "../controllers/usersController.js";

import {
  protect,
  isSuperAdmin,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.get(
  "/",
  protect,
  getAllUsers
);
router.patch(
  "/:id/approve",
  protect,
  isSuperAdmin,
  approveManager
);

router.patch(
  "/:id/reject",
  protect,
  isSuperAdmin,
  rejectManager
);

router.patch(
  "/:id/toggle-status",
  protect,
  isSuperAdmin,
  toggleUserStatus
);

router.delete(
  "/:id",
  protect,
  isSuperAdmin,
  deleteUser
);
export default router;