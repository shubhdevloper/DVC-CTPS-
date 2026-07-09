import OutgoingRecord from "../models/OutgoingRecord.js";
import Activity from "../models/Activity.js";
export const createOutgoingRecord =
  async (req, res) => {
    try {
const {
  vehicleNo,
  gatePassNo,
  gatePassDate,
  materialType,
  materialDescription,
  quantity,
  purpose,
  authorisedBy,
  remarks,
} = req.body;

      const currentYear =
        new Date().getFullYear();

      const count =
        await OutgoingRecord.countDocuments();

      const recordNo =
        `OUT-${String(
          count + 1
        ).padStart(
          4,
          "0"
        )}-${currentYear}`;

      const record =
        await OutgoingRecord.create({
          recordNo,

          date:
            new Date()
              .toLocaleDateString(
                "en-GB"
              )
              .replace(
                /\//g,
                "-"
              ),
          timeOut:
              new Date()
                .toLocaleTimeString(
                  "en-IN",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }
                ),

 vehicleNo,
    gatePassNo,
    gatePassDate,
    materialType,
    materialDescription,
    quantity,
    purpose,
    authorisedBy,
    remarks,

          gate:
            req.user.gate,

          recordedBy:
            req.user.username,

          status:
            "Pending",
        });
        await Activity.create({
  message: `Outgoing ${record.recordNo} recorded by ${req.user.username}`,
});
      res.status(201).json({
        success: true,
        message:
          "Outgoing record created",
        record,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  export const getOutgoingRecords =
  async (req, res) => {
    try {
      const records =
        await OutgoingRecord.find()
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        records
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  export const verifyOutgoingRecord =
  async (req, res) => {
    try {
      const record =
        await OutgoingRecord.findById(
          req.params.id
        );

      if (!record) {
        return res.status(404).json({
          message:
            "Record not found",
        });
      }

      record.status =
        "Verified";

      record.verifiedBy =
        req.user.username;

      record.verifiedAt =
        new Date();

      await record.save();
      await Activity.create({
        message: `${record.recordNo} verified by ${req.user.username}`,
      });
      res.status(200).json({
        success: true,
        message:
          "Outgoing record verified",
        record,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  export const rejectOutgoingRecord =
  async (req, res) => {
    try {
      const record =
        await OutgoingRecord.findById(
          req.params.id
        );

      if (!record) {
        return res.status(404).json({
          message:
            "Record not found",
        });
      }

      record.status =
        "Rejected";

      record.verifiedBy =
        req.user.username;

      record.verifiedAt =
        new Date();

      await record.save();
      await Activity.create({
        message: `${record.recordNo} rejected by ${req.user.username}`,
      });
      res.status(200).json({
        success: true,
        message:
          "Outgoing record rejected",
        record,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };