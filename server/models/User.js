import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true 
    },
    password:{
        type:String,
        required:false
    },
    googleId:{
        type:String,
        
    },
    authProvider:{
        type:String,
        enum:["local","google"],
        default:"local"
    }

},{timestamps:true}
);

export default mongoose.model("User",userSchema);