import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true//makes field searcheable
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String,
        required: true
    },
    coverImage:{
        type: String,
    },
    watchHistory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken:{
        type: String
    }    
} , {timestamps: true})

userSchema.pre("save", async function (next){ // aage pass kardo
    if(!this.isModified("password")) return next();//this refers to the document being saved

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
//Hooks are functions that run before or after certain Mongoose model actions.
// Express middleware → works on HTTP request/response flow. Mongoose hooks → work on the database lifecycle (querying, saving, deleting docs).

userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password, this.password)//returns true/false
}


// Header: The header contains the type of token and the algorithm used to produce it. Payload: The payload contains the user details. Signature: The signature is for authenticating the valid user.
userSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
            _id: this.id,
            email: this. email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id: this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)