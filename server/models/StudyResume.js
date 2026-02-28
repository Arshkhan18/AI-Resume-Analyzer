import mongoose from "mongoose";

const studyResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  extractedText: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("StudyResume", studyResumeSchema);