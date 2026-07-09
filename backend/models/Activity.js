import mongoose from "mongoose";

const activitySchema =
  new mongoose.Schema(
    {
      message: {
        type: String,
        required: true,
      },

      expireAt: {
        type: Date,
        default: () =>
          new Date(
            Date.now() +
              24 * 60 * 60 * 1000
          ),
        expires: 0,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Activity",
  activitySchema
);