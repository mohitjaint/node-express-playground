import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';
const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - eg fields not empty
    // check if user already exists
    // check for images, check for avatar
    // upload images to cloudinary
    // create user object - create entry in database
    // remove password and refresh token from response
    // check for user creation 
    // send response to frontend

    const {fullName, email, username, password} =req.body
    
    if(
        [fullName, email, username, password].some((field) => field ?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required");
    }

    const existingUSer = await User.findOne({
        $or: [{email}, {username}]
    })

    if(existingUSer){
        throw new ApiError(409, "User already exists" );
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("Avatar local path:", avatarLocalPath);
    const coverImageLocalPath =  req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Avatar upload result:", avatar);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if(!avatar){
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        username : username.toLowerCase(),
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken "
    )

    if(!createdUser){
        throw new ApiError(500, "User registration failed");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});


export {registerUser};