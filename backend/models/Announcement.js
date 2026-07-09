import mongoose from "mongoose";

const announcementSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        enum: [
          "text",
          "pdf",
          "link",
        ],
        default: "text",
      },

      content: {
        type: String,
        default: "",
      },

      pdfUrl: {
        type: String,
        default: "",
      },

      linkUrl: {
        type: String,
        default: "",
      },

      expiresAt: {
        type: Date,
        required: true,
      },

      active: {
        type: Boolean,
        default: true,
      },

      createdBy: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Announcement",
  announcementSchema
);