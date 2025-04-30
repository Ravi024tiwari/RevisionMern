import { asyncHandler } from "../utils/asyncHandler.js";
import {Apierror} from "../utils/apierror.js"
import {ApiResponse} from "../utils/Apiresponse.js"

import {UserModel} from "../models/user.model.js"

import {uploadOnCloudinary} from "../utils/cloudinary.js"

//asyncHandler only do to avoid to write try catch and asyn fuction

const registerUser = asyncHandler(async(req,res)=>{
    //TODOS
    //Take input from the user as a req body 
    //Check that all Credentials should be present from input side
    //Check User already exit in document ({username,emial})
    //Take the file path and save into avatar and coverImage into Collections
    //check that their path are present or not 
    //Upload on cloudnary the and set thieir path from string
    //Create User object to upload .Create entry in DB
    //remove password and refrsh Token field from response
    //Check for response after creation is created or not
    //return response after creation


    const {username,fullName,email,password} =req.body; //destruct from body
    console.log("Username:",username ,fullName);


    // if(username===""){
    //     throw new Apierror(404,"Username is not found!!");
    // }
    // if(fullName===""){
    //     throw new Apierror(404,"Fullname is not present!!");
    // }
    // if(email===""){
    //     throw new Apierror(404,"Email is not found!!");
    // }
    // if(password===""){
    //     throw new Apierror(404,"Password is not present!!");
    // }
    
    if([fullName,username,email,password].some((field)=>{
          return field?.trim()===""; 
    })){
        throw new Apierror(400,"All credentials is not present!!")
    }
    //now check that their is any already register user or not

    const alreadyRegistorUser =await UserModel.findOne({
        $or:[{email},{ username}]
    });

    if(alreadyRegistorUser){
        throw new Apierror(409,"This User is Already registored in DataBase!!")
    }
    //agar nhi registor hai then we registor that
    //now check for images 
    const {avatar ,coverImage} =req.files;//we have to find the path of multer
    if([avatar ,coverImage].some((field)=> field?.trim()==="")){
        return new Apierror(400,"Avatar or Coverimage not upload by multer Successfully!!");
    } 
    const avatarLocalPath =avatar[0]?.path;
    const coverImageLocalPath =coverImage[0]?.path;//here the upload file path on server
    console.log("Avatar Path:",avatarPath);
    console.log("CoverImage Path:",coverImage);

    if(!avatarLocalPath){
        throw new Apierror(400,"Avatar file is required!!")
    }

    //now upload them to Cloudnary the local file path
  const avatarUploadOnCloudnary = await uploadOnCloudinary(avatarLocalPath);
  const coverImageUploadOnCloudnary =await uploadOnCloudinary(coverImageLocalPath)//those upload on Cloudnary from multerpaht

  if(!avatarUploadOnCloudnary) {
    throw new Apierror(500,"Avatar uploadation is Failed on Cloudnary!!")
  }
  console.log("After uploadation Avatar:",avatarUploadOnCloudnary)

  if(!coverImageUploadOnCloudnary) {
    throw new Apierror(500,"CoverImage uploadation is Failed on Cloudnary!!")
  }
  //from here we get out string from cloudnary 

  //now make object of Database 
 const user = await UserModel.create(//set that object on MongoDB
    {   
        username:username,
        fullName:fullName,
        email:email,
        avatar:avatarUploadOnCloudnary.url,
        coverImage:coverImageUploadOnCloudnary.url,
    }
  )

const createdUser = await UserModel.findById(user._id).select("-password -refreshToken");//here is the _id

if(!createdUser){
    throw new Apierror(500,"Something went wrong while registering user!!")
}

//at the end return the api response

return res.status(201).json(
    new ApiResponse(201,createdUser,"User registered Successfully!!")
)

})

export {registerUser};