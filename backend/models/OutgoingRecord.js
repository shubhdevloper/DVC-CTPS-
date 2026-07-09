import mongoose from "mongoose";

const outgoingRecordSchema =
  new mongoose.Schema(
    {
      recordNo: {
        type: String,
        required: true,
        unique: true,
      },

      date: {
        type: String,
        required: true,
      },

      vehicleNo: {
        type: String,
        required: true,
      },
      timeOut: {
  type: String,
  default: "",
},
gatePassDate: {
  type: String,
  default: "",
},

materialType: {
  type: String,
  default: "",
},

returnable: {
  type: String,
  default: "",
},

remarks: {
  type: String,
  default: "",
},
gatePassNo: {
  type: String,
  default: "",
},
      materialDescription: {
        type: String,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
      },
purpose: {
  type: String,
  default: "",
},

authorisedBy: {
  type: String,
  default: "",
},

      gate: {
        type: String,
        required: true,
      },

      recordedBy: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        default: "Pending",
      },

      verifiedBy: {
        type: String,
        default: "",
      },
      verifiedAt: {
  type: Date,
  default: null,
},
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "OutgoingRecord",
  outgoingRecordSchema
);