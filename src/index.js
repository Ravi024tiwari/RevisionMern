//require('dotenv).config({path:"/.env"})

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import mongoose from "mongoose";

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
    console.log()
})
.catch((err)=>{
    console.log('Mongo db connection failed!!')
})
