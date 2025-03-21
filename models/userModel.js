import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true,unique:true},
    password:{type:String,require:true},
    routeId:{type:String,required:true},
    verifyOtp:{type:String}
})

const userModel = mongoose.model('user',userScheme)

export default userModel

