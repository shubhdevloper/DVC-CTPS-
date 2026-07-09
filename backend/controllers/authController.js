import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const registerUser = async (
  req,
  res
) => {
  try {
    const {
      fullName,
      username,
      password,
      role,
      gate,
      accessCode,
    } = req.body;

    const existingUser =
      await User.findOne({
        username,
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          "Username already exists",
      });
    }

    if (
      role === "superadmin" &&
      accessCode !==
        "DVC-SUPER-2026"
    ) {
      return res.status(400).json({
        message:
          "Invalid Super Admin Access Code",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        fullName,
        username,
        password:
          hashedPassword,
        role,
        gate:
          role ===
          "security"
            ? gate
            : "All Gates",

        status:
          role ===
          "manager"
            ? "Pending"
            : "Active",
      });

const userResponse = {
  _id: user._id,
  fullName: user.fullName,
  username: user.username,
  role: user.role,
  gate: user.gate,
  status: user.status,
};

res.status(201).json({
  success: true,
  message:
    "User registered successfully",
  user: userResponse,
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (
  req,
  res
) => {
  try {
    const {
      username,
      password,
    } = req.body;

    const user =
      await User.findOne({
        username,
      });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Invalid credentials",
      });
    }

    if (
      user.status ===
      "Pending"
    ) {
      return res.status(403).json({
        message:
          "Awaiting Super Admin approval",
      });
    }

    if (
      user.status ===
      "Rejected"
    ) {
      return res.status(403).json({
        message:
          "Registration request rejected",
      });
    }

    if (
      user.status ===
      "Inactive"
    ) {
      return res.status(403).json({
        message:
          "Account is inactive",
      });
    }

    const token =
      jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

    res.status(200).json({
      success: true,
      token,

      user: {
        _id: user._id,
        fullName:
          user.fullName,
        username:
          user.username,
        role: user.role,
        gate: user.gate,
        status:
          user.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};
export const forgotPassword =
  async (req, res) => {
    try {
      const {
        username,
        defaultPassword,
      } = req.body;

      const user =
        await User.findOne({
          username,
        });

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      if (
        defaultPassword !==
        process.env.DEFAULT_PASSWORD
      ) {
        return res.status(400).json({
          message:
            "Invalid default password",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Verification successful",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  export const resetPassword =
  async (req, res) => {
    try {
      const {
        username,
        newPassword,
      } = req.body;

      const user =
        await User.findOne({
          username,
        });

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password =
        hashedPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Password reset successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };