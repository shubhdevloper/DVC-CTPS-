import User from "../models/User.js";

export const getAllUsers = async (
  req,
  res
) => {
  try {
    const users =
      await User.find().select(
        "-password"
      );

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};
export const approveManager = async (
  req,
  res
) => {
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "Active",
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message:
        "Manager approved",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};
export const rejectManager = async (
  req,
  res
) => {
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "Rejected",
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message:
        "Manager rejected",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};
export const toggleUserStatus =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      user.status =
        user.status === "Active"
          ? "Inactive"
          : "Active";

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "User status updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
 export const deleteUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    await User.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};