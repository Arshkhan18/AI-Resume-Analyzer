
import mongoose from "mongoose";

const resumeSchema =new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true  
    },
    fileName:String,
    filePath:String,
    extractedText:String,
    score:Number,
    feedback:Object,
},{timestamps:true});

export default mongoose.model("Resume", resumeSchema);

