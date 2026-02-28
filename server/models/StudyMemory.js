import mongoose from "mongoose";

const studyMemorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  summary: {
    type: String,
    default: "",
  },
  messages: [
    {
      role: String,
      content: String,
    }
  ]
});

export default mongoose.model("StudyMemory", studyMemorySchema);