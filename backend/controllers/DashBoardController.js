import IncomingRecord from "../models/IncomingRecord.js";
import OutgoingRecord from "../models/OutgoingRecord.js";

export const getDashboardStats =
  async (req, res) => {
    try {
      const totalIncoming =
        await IncomingRecord.countDocuments();

      const totalOutgoing =
        await OutgoingRecord.countDocuments();

      const pendingIncoming =
        await IncomingRecord.countDocuments({
          status: "Pending",
        });

      const pendingOutgoing =
        await OutgoingRecord.countDocuments({
          status: "Pending",
        });

      const pendingReview =
        pendingIncoming +
        pendingOutgoing;

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const todayIncoming =
        await IncomingRecord.countDocuments({
          createdAt: {
            $gte: today,
          },
        });

      const todayOutgoing =
        await OutgoingRecord.countDocuments({
          createdAt: {
            $gte: today,
          },
        });

      const todayMovements =
        todayIncoming +
        todayOutgoing;

      res.status(200).json({
        success: true,
        totalIncoming,
        totalOutgoing,
        pendingReview,
        todayMovements,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };