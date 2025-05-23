import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors"


const app =express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,//HERE IT SET THE ORIGN OF CONNECTION 
    Credential:true
}))
//setting for decoding of incoming data from different parts

app.use(express.json({limit:"16kb"}));//from json data form

app.use(express.urlencoded({extened:true,limit:"16kb"}));//its with data coming with url 

app.use(express.static(path.join(process.cwd(),"public")))//here all the file and images store on the server
//hum static file ko public se le sakte hai

app.use(cookieParser());

//routes import
import userRouter from "./routes/user.route.js"//isko import kiya
import { TweetRouter } from "./routes/tweet.routes.js";
import {LikeRouter} from "./routes/like.routes.js"

//routes declaration 
//this is company based routing
app.use("/api/v1/user",userRouter)//its act as a middleware for the routes
//after tracking /api/v1/user it transfrom to userRouter
//now we use the route path 
app.use("/api/v1/tweet",TweetRouter);

//now we use the likeRouter 

app.use("/api/v1/like",LikeRouter);

export {app};//not by default