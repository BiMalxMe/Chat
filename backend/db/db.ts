import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.MONGO_URL || "")

const userSchema=new mongoose.Schema({
    userName:String,
    email:String,
    password:String
})

const accountSchema=new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },balance:{
        type: Number,
        required: true
    }
})
const Account=mongoose.model('Account',accountSchema)
const User=mongoose.model('Users',userSchema)
module.exports={
    User,
    Account
}