import Resume from "../models/Resume.js";

export const getLatestResume =async(req,res)=>{

    console.log("User ID:", req.userId);
    try{
    
         // Debugging line
        const resume =await Resume.findOne({userId:req.userId })

       .sort({createdAt:-1});
        //No resume found
        if(!resume){
            return res.status(404).json({message:"No resume Uploaded Yet"});
        }
        res.json(resume);
    }catch(error){
        res.status(500).json({message:"Server Error"});

    }
}

export const getAllResumes =async(req,res)=>{

    try{
        const resumes =await Resume.find({userId:req.userId})
        .sort({createdAt:-1});
        res.json(resumes);

    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
}

export const deleteResume =async(req,res)=>{

    try{
        const resume =await Resume.findOneAndDelete({
            _id:req.params.id,
            userId:req.userId
        });
        if(!resume){
            return res.status(404).json({message:"Resume not found"});
        }
        res.json({message:"Resume deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
}