import express from 'express';
import protect from "../middlewares/authMiddleware.js";
import Resume from '../models/Resume.js';
import upload from '../middlewares/uploadMiddleware.js';
import { parseResume } from "../services/resumeParser/pdfParser.js";
import { analyzeResume } from "../services/resumeAnalyzer/analyzeResume.js";
import{ getLatestResume, getAllResumes, deleteResume } from '../controllers/resumeController.js';
const router = express.Router();

// Upload and parse resume
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  async (req, res) => {
    try {
      const filePath = req.file.path;

      // 1️⃣ Extract text from PDF
      const extractedText = await parseResume(filePath);

      // 2️⃣ Analyze with AI (already returns OBJECT)
      const parsedResult = await analyzeResume(extractedText);

      // 3️⃣ Save to DB
      const resume = new Resume({
        userId: req.userId,
        fileName: req.file.originalname,
        filePath,
        extractedText,
        score: parsedResult.score,
        feedback: parsedResult
      });

      await resume.save();

      res.status(201).json({
        message: "Resume uploaded successfully",
        resumeId: resume._id,
        score: parsedResult.score
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Resume upload failed" });
    }
  }
);
// Get latest resume
router.get("/latest", protect, getLatestResume);
//get all resumes
router.get("/all", protect, getAllResumes);
//Delete resume
router.delete("/:id", protect, deleteResume);

export default router;
