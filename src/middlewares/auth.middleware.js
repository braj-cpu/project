import ApiError from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async (req, res, next) => {//next--carry further
    //this midware will verify whether there is user or not on basis of token given at login
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        //decodedtoken contains all info(-id, email, uname, fname) check genrrateAccessToken jwt.sign method
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user;//Now downstream handlers can access req.user without re-checking the token.
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token")
    }
})