import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import "dotenv/config"

export const JWTverify=asyncHandler(async(req,res,next)=>{
try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", " ")
    console.log("TOKEN HERE",token);
    if (!token){
      console.log("no token");
    }

    const decodedToken=  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    if (!decodedToken){
      console.log("not verified token");
    }
    const user=await User.findById(decodedToken?._id)
    req.user=user
    next()
} catch (error) {
  console.log("something went wrong");
  
}

})