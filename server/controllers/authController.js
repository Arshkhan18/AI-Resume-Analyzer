import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
export const register=async(req,res)=>{
    const {name,email,password}=req.body;
    console.log(req.body);
    try{
        //check if user already exists
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        //hash password
        const hashedPassword =await bcrypt.hash(password,10);
        //create new user
        const user=await User.create({
            name,
            email,
            password:hashedPassword
        });

        res.status(201).json({message:"User registered successfully"});
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
};

// Login user
export const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        //check if user exists
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        //compare password
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        //create JWT token
        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )
        res.json({token});
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
}
