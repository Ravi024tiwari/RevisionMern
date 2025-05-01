import { Apierror } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        //these cookies set into req object of express
        //console.log("The token is :",req);
        if (!token || token.trim() === "") {
            throw new Apierror(401, "Unauthorized request! Token is missing.");
        }        //hame chahe cookies se token mil jaenge ya phir jo headers bhejenge usse use kar lenge
        //user ki identification ke lie
       
        if (!token) {
            throw new Apierror(401, "Unauthorized request!");//if not get authorised access
        }
        //with the help of these APISECRET AND THEIR SIGNATURE it verity the token
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await UserModel.findById(decodedToken?._id).select("-password -refreshToken")
        //remove the password nd refreshToken from the user
        console.log("The user of current Login is:",user);

        if (!user) {
            //TODO NEXT_VIDEO:disscuss about frontend
            throw new Apierror(401, "Invalid AccessToken");
        }
        //yha par hamne us user ko req object me store kar diya
        req.user = user;//add new object user on req object
        //this is doen by using cookie-parser
        next()//after pushing the curr login user into req object
        //go to next middleware
    } catch (error) {
        console.log("yhi par error hai");
        throw new Apierror(401, error?.message || "Invalid access token");
    }

})
