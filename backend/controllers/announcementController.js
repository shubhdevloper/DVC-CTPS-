import Announcement from "../models/Announcement.js";

export const createAnnouncement =
  async (req, res) => {
    try {
      const {
        title,
        type,
        content,
        linkUrl,
        expiresAt,
      } = req.body;

      const expiryDate =
        new Date(expiresAt);

      expiryDate.setHours(
        23,
        59,
        59,
        999
      );

      const announcement =
        await Announcement.create({
          title,
          type,
          content,

          pdfUrl:
            req.file
              ? `/uploads/${req.file.filename}`
              : "",

          linkUrl,

          expiresAt:
            expiryDate,

          createdBy:
            req.user.username,
        });

      res.status(201).json(
        announcement
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const getAnnouncements =
  async (req, res) => {
    try {
      const announcements =
        await Announcement.find({
          active: true,
          expiresAt: {
            $gt: new Date(),
          },
        }).sort({
          createdAt: -1,
        });

      res.status(200).json(
        announcements
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const deleteAnnouncement =
  async (req, res) => {
    try {
      await Announcement.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };