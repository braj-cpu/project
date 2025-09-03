import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //steps
    //get user details from frontend
    //validation - not empty
    //check if user already exist using username/email
    //check for img, avatar
    //upload them to cloudinary, check at cloudinary
    //create user object - create entry in db
    //remove password and refresh token from response
    //check for user creation
    //return response
    
    const {fullname, username, email, password} = req.body//destructuring .. : renaming
    console.log("email: ", email)

    //validation - not empty
    if(
        [fullname, email, username, password].some((field)=>field?.trim())===""//field?.trim() calls trim() only if field is not null/undefined.
    ){
        throw new ApiError(400, "All fields are required")
    }


    //check if user already exist using username/email
    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409, "Username or Email already exist")
    }


    //check for img, avatar from multer uploads
    const avatarLocalPath = req.files?.avatar[0]?.path;//[0] → gets the first uploaded file in the avatar array.
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }//check again


    //create user object - create entry in db
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //Checking if User is in db, _id is returned mongodb obj and remove password and refresh token from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //check for user creation
    if(!createdUser){
        throw new ApiError(500, "Error while registering user")
    }

    //return response
    // return res.status(201).json({createdUser}) OR
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )

});

export { registerUser };
