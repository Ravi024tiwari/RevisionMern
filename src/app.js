import express from "express";
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

app.use(express.static("/public"))//here all the file and images store on the server

app.use(cookieParser());

export {app};//not by default