import express from "express";
import fs from "fs";
import protect from "../middlewares/authMiddleware.js";
import { generateResume } from "../services/resumeGenerator/generateResume.js";
const router = express.Router();

router.post("/generate",protect,async(req,res)=>{
    try{
        const formData=req.body;
        
        const pdfPath = await generateResume(formData);
        res.download(pdfPath, () => {
     try {
    fs.unlinkSync(pdfPath);
       } catch (err) {
    console.log("Cleanup error:", err.message);
  }
});

    }catch(error){
        console.error(error);
        res.status(500).json({message:"Resume generation failed"});
    }
})

export default router;
