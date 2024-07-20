import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js"

// Algorithm 
// get login credentials from req.body
// check if user exists on the email that the user is providing 
// if user on the email is not available on the database then send error 
// if user is available then check if the password is correct  ===> we have already done that in the model
// give accesstoken in the response 


const generateAccessandRefreshToken =async(userId)=>{
    try {
       const user= await User.findById(userId)
       const accessToken=user.generateAccessToken()
       const refreshToken=user.generateRefreshToken()

       user.refreshToken=refreshToken
       await user.save({validateBeforeSave:false})

       return {accessToken,refreshToken}

        
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating access and refresh token")

        
    }
}



const registerUser = asyncHandler(async (req, res) => {

    // validating the required fields 

    const { name, email, username, fullname,password } = req.body;
    if (
        [username, fullname, email, name].some((field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "all fields must not be empty");

    }

    // checking user 
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "user already exists")
    }

    // Getting the local paths of avatar and coverImage 

    const avatarLocalPath = req.files?.avatar?.[0].path;
    const coverImageLocalPath = req.files?.coverImage?.[0].path

    // Checking if avatar is available or not 

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is compulsary")
    }

    // uploading avatar and cover image to cloudinary 

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    // checking if avatar is on local host 

    if(!avatar){
        throw new ApiError(400, "avatar is required")
    }

    // Creating User 
   const user=await User.create({
        fullname,
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // Removing refreshtoken and password 

    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser){
        throw new ApiError(500,"something went wrong while registering a user")
    }

    // Returning the response to the user 
    return res.status(201).json(
        new apiResponse(200,createdUser,"User created successfully")
    )

})
const loginUser=asyncHandler(async (req,res)=>{
    const {username,email,password}=req.body
    
   if (!email){
    throw new ApiError(401,"Please enter email")
   }
   if (!username){
    throw new ApiError(401,"Please enter username")
   }

    // checking the user on database 
    const user = await User.findOne({
        $or:[{email},{username}]
    })
    if (!user) {
        throw new ApiError(403,"invalid credentials")
    }
    
   const validPassword= await user.isPasswordCorrect(password)
   if (!validPassword){
    throw new ApiError(401,"wrong password");
   }
   const {accessToken,refreshToken}=await generateAccessandRefreshToken(user._id)

   const loggedinUser=await User.findById(user._id).select(
    "-password -refreshToken"
   )

//    Sending cookies 
const options={
    httpOnly:true,
    secure:true
}
return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
    new apiResponse(200,{
        loggedinUser
    },"user logged in successfully")
)

})

const logout=asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            },
           
        },
        {
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options)
    .json(new apiResponse(200,{},"User logged out successfully"))

})



export { registerUser,loginUser,logout }
