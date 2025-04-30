import { asyncHandler } from "../utils/asyncHandler.js";
import {Apierror} from "../utils/apierror.js"

//asyncHandler only do to avoid to write try catch and asyn fuction

const registerUser = asyncHandler(async(req,res)=>{
    res.status(200).json({
        message:"ok"
     })

    //now use the encrption of password

})

export {registerUser};