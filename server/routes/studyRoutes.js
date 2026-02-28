import express from "express";
import protect from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
  uploadStudyResume,
  studyChat
} from "../services/study/studyServices.js";

const router = express.Router();

/* =====================================
   Upload Resume (Study Mode)
   🔐 Requires Login
===================================== */

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  async (req, res) => {

    try {
      const result = await uploadStudyResume(
        req.userId,
        req.file.path,
        req.file.originalname
      );

      res.status(201).json(result);

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);

/* =====================================
   Study Chat
   🔐 Requires Login
===================================== */

router.post("/chat", protect, async (req, res) => {

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const response = await studyChat(req.userId, message);

    res.json({ response });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;