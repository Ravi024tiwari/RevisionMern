import { Router } from "express";
import { loginUser, registerUser,logoutUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const Userrouter =Router()

Userrouter.route("/register").post(upload.fields(//use of middleware during upload files
    [{name :'avatar',maxCount :1},
    {name:'coverImage',maxCount:1}
]),
    registerUser)

//Now make routes for logn the user
 Userrouter.route("/login").get(loginUser);//here render the get request from the app.js

 Userrouter.route("/logout").post(verifyJWT,logoutUser);

export default Userrouter;