import { asyncHandler } from "../utils/asyncHandler.js";
import {Apierror} from "../utils/apierror.js"
import {ApiResponse} from "../utils/Apiresponse.js"
import jwt from "jsonwebtoken";

import {UserModel} from "../models/user.model.js"//its use to communicate with database

import {uploadOnCloudinary} from "../utils/cloudinary.js"

//asyncHandler only do to avoid to write try catch and asyn fuction
const generateAccessAndRefreshToken = async (userId) => {
  try {
     //pahle hamne user ko database se find kiya so await
     const user = await UserModel.findById(userId);//this is user from database
     //iss user ka access token and then save that refresh token to req body
     const accessToken = user.generateAccessToken();//get the access tokens and refesh tokens
     const refreshToken = user.generaterefreshToken();

     console.log("The generated AccessToken and refreshToken in gneAceeRefre:",accessToken,refreshToken)

     //now save the refresh token in the database
     user.refreshToken = refreshToken//this one from userSchema
     await user.save({ validateBeforeSave: false })//its save that refresh token

     return { accessToken, refreshToken };//its return access token and refersh token of user and return that
  }
  catch (err) {
    throw new Apierror(500, "Something went wrong while generating acces and ref token!")
  }
}
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
    console.log("Username:",username ,fullName,password);


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
    console.log("The req body:",req.body);
    //agar nhi registor hai then we registor that
    //now check for images 
    const {avatar ,coverImage} =req.files;//we have to find the path of multer
    // if([avatar ,coverImage].some((field)=> field?.trim()==="")){
    //     return new Apierror(400,"Avatar or Coverimage not upload by multer Successfully!!");
    // } 
    console.log("req files :",req.files);
    if(!avatar && !coverImage){
        return new Apierror(500,"Files is not uploaded successfully!!")
    }
    const avatarLocalPath =avatar[0]?.path;
    const coverImageLocalPath =coverImage[0]?.path;//here the upload file path on server
    console.log("Avatar Path:",avatarLocalPath);
    console.log("CoverImage Path:",coverImageLocalPath);

    if(!avatarLocalPath && !coverImageLocalPath){
        throw new Apierror(400,"Local file path is required!!")
    }

    //now upload them to Cloudnary the local file path
  const avatarUploadOnCloudnary = await uploadOnCloudinary(avatarLocalPath);
  const coverImageUploadOnCloudnary =await uploadOnCloudinary(coverImageLocalPath);//those upload on Cloudnary from multerpaht

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
        password:password,
    }
  )

const createdUser = await UserModel.findById(user._id).select("-password -refreshToken");//here is the _id
console.log("The new Created User is :",createdUser);

if(!createdUser){
    throw new Apierror(500,"Something went wrong while registering user!!")
}

//at the end return the api response

return res.status(201).json(
    new ApiResponse(201,createdUser,"User registered Successfully!!")
)

})

//Now login the user 
//Todos
//Take input credential for login {email,username ,password}
//if user is already exit in database then create the access and refesh token and saved in user and database
//if not then thow error

//TODOS OF LOGIN THE USER
//1->FIRSTLY CHECK ALL CREDENTIAL ARE PRESENT
//2->IS THERE ANY USER WHICH HAVE SAME EMAIL OR USERNAME
//3->IF NOT PRESENT THEN SEND API ERROR
//4->NOW WE HAVE TO GENERATE TOKEN AND COOKIE TO SET ON THEM
const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;//take that input from the user
  
    if (!username || username.trim() === "") {
      throw new Apierror(400, "Username is not present!");
    }
    if (!email || email.trim() === "") {
      throw new Apierror(400, "email is not present!");
    }
    if (!password || password.trim() === "") {
      throw new Apierror(400, "password is not present!");
    }
    
    const user = await UserModel.findOne({//here is the best approch 
      $or: [{ username }, { email }]//inn dono me se koi bhi find kar do from Userdatabase
    })
  
    if(!user){
      throw new Apierror(400,"User is not found in database!");
    }
    //check the password
  
    const passwordValid =await user.ispasswordCorrect(password);//maine password bhej diya
  
    if(!passwordValid){
      throw new Apierror(400,"Your password is invalid!");
    }
  
  
    //now here we get all credetnial 
  
  
   
    const userId =user._id;//here we get that it
    //the user id from here we get that user of that user id
  
    const {accessToken,refreshToken}= await generateAccessAndRefreshToken(userId);
    const loggedInUser = await UserModel.findById(user._id).select("-password -refreshToken")//ye hmm user ko bhejte hai response me ussme 
  //password and refreshToken include nhi karte
  //this is for cookies setup and send to user //in frontend
    const options = {
        httpOnly: true,
        secure: true
    }
    //the above mean that the cookie not be modified by the javascript frontend
  
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                 loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
  })


//Now for Logout Method
//we use the verifyjWT middleware to write the middleware code to push the login user in req body
//In this we will use these cookie to get the login User
//find their id from the cookies
//so for logout me have to clear these cookies from the browser   

const logoutUser = asyncHandler(async (req, res) => {//yha req me hamara cur looged in used hai
  //we have to find out the user which is logged in already to get logged out
  await UserModel.findByIdAndUpdate(//to update the refresh Token
     req.user._id,//yhi to user hai
     {
        $unset: {
           refreshToken: 1//unset that refresh Token//here we logout from the browser also
        }
     },
     {
        new: true//here we get new value of token is deleted
     }
  )//return 
 
  //set the cookies to clear them from http securly from browser
  const options = {//set new options
     httpOnly: true,
     secure: true,
  }

  return res
     .status(200)
     .clearCookie("accessToken", options)//yha he nhi set krna tha isilie bss clar kar diye from browser
     .clearCookie("refreshToken", options)
     .json(new ApiResponse(200, {}, "User logged out Successfully!"))
})

//Now RefreshAccessToken
//Firstly its case when access and Refresh Token got expired 
//Firstly by use of refresh Token we generate new access token and update the cookies 
//Its case same as the logout case ki JWT ka use krke hum refreshToken ke sath karenge
//
const refreshAccessToken =asyncHandler(async(req,res)=>{
  
    const incomingRefreshToken =req.cookies?.refreshToken ||req.body.refreshToken;;//here we get that refresh Token from logged in user  cookie
    if(!incomingRefreshToken){
      throw new Apierror(401,"Token is not found From refrehsToken!!");
    }
    console.log("The token is",incomingRefreshToken);//thsi is refresh token
    
    try {
      const decodedRefreshToken =await jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);//here we verify that
    
      if(!decodedRefreshToken){
        throw new Apierror(409,"Decoded token is not regenerated Successfully!!");
      }
      console.log("The docoded Token is:",decodedRefreshToken._id);
    
      //now get that user from the decoded jwt verify
      const user =await UserModel.findById(decodedRefreshToken._id);//here we get that uuid from mongodb
      if(!user){//fictitious token
        throw new Apierror(501,"Decoded User is not found!!");
      }
      console.log("The user searched frm database:",user);
      console.log("The user token is:",user.refreshToken);
      //For comparision of RefreshToken from the user and well as  the cookie we compare that
      if(incomingRefreshToken !==user?.refreshToken){
        throw new Apierror(402,"RefreshToken is not matched in user res cookies and from the databse!!");
      }
      console.log("User RefereshToken and token RefreshToken got matched succesfully");
      console.log("The logged in User is:",user._id);
    
      const {newAccessToken,newRefreshToken} =await generateAccessAndRefreshToken(user?._id);//here we send that
      console.log("newLy generated Token:",newAccessToken,newRefreshToken)
      //now from that generated access and refreshToken set in the user
  
  
    
      if(!newAccessToken || !newRefreshToken){
        throw new Apierror(401,"Newly generated access token and Refresh Token is not found!!");
      }
  
      console.log("Access token and refreshToken generated Succesfully!!");
      const resUser =await UserModel.findById(user._id).select("-password -refreshToken");
    
      if(!resUser){
        throw new Apierror(402,"resUser is not generated Successfully!!");
      }
      console.log("This is reUser send:",resUser);
    //here we set the cookies for the 
      const options ={
        httpOnly:true,
        secure:true,
      }
    
      res 
      .status(200)
      .cookie("accessToken",newAccessToken,options)
      .cookie("refreshToken",newRefreshToken,options)
      .json(200,
        {resUser,newAccessToken,newRefreshToken},
        "Successfully Regenerate The AccessToken and RefreshToken"
        
      ) 
    } catch (error) {
       throw new Apierror(401,"Error while regenerating the refresh and AccessToken!!")
    }
})

export {registerUser,loginUser,logoutUser,refreshAccessToken};