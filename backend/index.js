import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);

app.listen(process.env.PORT ||9000, () => {
  console.log("Server running on port 9000");
});