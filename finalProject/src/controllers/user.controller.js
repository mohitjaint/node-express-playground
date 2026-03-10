import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const generateTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false});

        return {accessToken, refreshToken};
    }
    catch(error){
        console.error("Error generating tokens:", error);
        throw new ApiError(500, "Token generation failed");
    }
}

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

const loginUser = asyncHandler(async (req, res) => {
    //get login details from frontend
    //validation of details
    //check if user exists
    //compare password
    //generate access token and refresh token and save refresh token in database
    //send cookies and response to frontend
    
    const {email, username, password} = req.body;

    if(!username && !email){
        throw new ApiError(400, "Email or username is required");
    }

    if(!password){
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne({
        $or: [{email}, {username}]
    })

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const passValid = await user.isPasswordCorrect(password);

    if(!passValid){
        throw new ApiError(401, "Invalid credentials");
    }

    const {accessToken, refreshToken} = await generateTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly : true,
        secure : true,   
    }

    return res.status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(200, loggedInUser, "Login successful")
    );

});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { 
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    );

    const options = {
        httpOnly : true,
        secure : true,   
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, null, "Logout successful")
    );
})

export {registerUser, loginUser, logoutUser};