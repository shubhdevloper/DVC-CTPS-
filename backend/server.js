import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import incomingRoutes from "./routes/incomingRoutes.js";
import outgoingRoutes from "./routes/outgoingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import path from "path";
dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/api/auth",
  authRoutes
);
app.use(
  "/api/test",
  testRoutes
);
app.use(
  "/api/users",
  usersRoutes
);
app.use(
  "/api/incoming",
  incomingRoutes
);
app.use(
  "/api/outgoing",
  outgoingRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use(
  "/api/activities",
  activityRoutes
);
app.use(
  "/api/announcements",
  announcementRoutes
);
app.use(
  "/uploads",
  express.static("uploads")
);
app.get("/", (req, res) => {
  res.send("Inventory Management Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});