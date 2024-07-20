import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const register = asyncHandler(async (req, res) => {

    // get username fields 
    // validate the fields
    // check if user is already registered
    // upload avatar and cover to cloudinary
    // Create User 
    // remove password and refresh token 
    // response 

    