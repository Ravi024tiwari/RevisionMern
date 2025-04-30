//require('dotenv).config({path:"/.env"})

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import mongoose from "mongoose";
import {app} from "./app.js"

dotenv.config(//configuration of dotenv
    {
        path:"/.env"
    }
)

connectDB()//its call that and then connect them
.then((res)=>{
    app.listen(process.env.PORT ||8000,()=>{
        console.log(`Server is listening at the port :${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log('Mongo db connection failed!!',err)
})
