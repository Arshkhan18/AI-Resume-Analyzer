import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import protect  from "./middlewares/authMiddleware.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import generatorRoutes from "./routes/generatorRoutes.js";


dotenv.config();
//connect to MongoDB
console.log("Connecting to MongoDB...", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

const app = express();
//middleware

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/auth", authRoutes);
// app.use((req, res, next) => {
//   console.log("Incoming request:", req.method, req.url);
//   next();
// });
app.use("/api/resume", resumeRoutes);
app.use("/api/generator", generatorRoutes);

app.get("/", (req, res) => {
  res.send("Resume AI Backend Running");
});
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Access granted", userId: req.userId });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
