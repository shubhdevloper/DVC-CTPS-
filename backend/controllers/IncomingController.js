import IncomingRecord from "../models/IncomingRecord.js";
import Activity from "../models/Activity.js";
export const createIncomingRecord =
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
  returnable,
  remarks,
} = req.body;

      const currentYear =
        new Date().getFullYear();

      const count =
        await IncomingRecord.countDocuments();

      const recordNo =
        `IN-${String(
          count + 1
        ).padStart(
          4,
          "0"
        )}-${currentYear}`;

      const record =
        await IncomingRecord.create({
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
          timeIn:
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
    returnable,
    remarks,

          gate:
            req.user.gate,

          recordedBy:
            req.user.username,

          status:
            "Pending",
        });
await Activity.create({
  message: `Incoming ${record.recordNo} recorded by ${req.user.username}`,
});
      res.status(201).json({
        success: true,
        message:
          "Incoming record created",
        record,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  export const getIncomingRecords =
  async (req, res) => {
    try {
      const records =
        await IncomingRecord.find()
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
  export const verifyIncomingRecord =
  async (req, res) => {
    try {
      const record =
        await IncomingRecord.findById(
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
          "Record verified successfully",
        record,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  export const rejectIncomingRecord =
  async (req, res) => {
    try {
      const record =
        await IncomingRecord.findById(
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
          "Record rejected successfully",
        record,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };