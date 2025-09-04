import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        //we keep refresh token in db
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Cannoy genrate Access/Refresh Token")
    }
}

//asyncHandler used when web request are there
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

    //re.body se data le aao
    const { fullname, username, email, password } = req.body//destructuring .. : renaming

    //validation - not empty
    if (
        [fullname, email, username, password].some((field) => field?.trim()) === ""//field?.trim() calls trim() only if field is not null/undefined.
    ) {
        throw new ApiError(400, "All fields are required")
    }


    //check if user already exist using username/email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "Username or Email already exist")
    }


    //check for img, avatar from multer uploads
    const avatarLocalPath = req.files?.avatar[0]?.path;//[0] → gets the first uploaded file in the avatar array.
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatarLocalPath) {
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
    if (!createdUser) {
        throw new ApiError(500, "Error while registering user")
    }

    //return response
    // return res.status(201).json({createdUser}) OR
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )

});

const loginUser = asyncHandler(async (req, res) => {
    // req.body se data leaao
    const { username, email, password } = req.body;

    // username or email 
    if (!username && !email) {
        throw new ApiError(400, "username/email is required")
    }

    // check whether username exist
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "Username/Email not exists")
    }


    // check password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Wrong Password")
    }


    // access and refresh token
    const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    // send cookie (info to user)
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                }, "user logged in successfully"
            )
        )

});


//LOG OUT USER
const logOutUser = asyncHandler(async (req, res) => {

    //remove tokens by identifying user
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {//kya kya update karna h
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    //remove cookies 
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

//Refreshing Access Token from  Refresh Token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized access");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Unauthorized access");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token expired or invalid");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
});


export { 
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken
 };
