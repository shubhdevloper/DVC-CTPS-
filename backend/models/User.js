import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "security",
        "manager",
        "superadmin",
      ],
      required: true,
    },

    gate: {
      type: String,
      default: "All Gates",
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
        "Pending",
        "Rejected",
      ],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model(
  "User",
  userSchema
);

export default User;