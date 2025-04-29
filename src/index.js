//require('dotenv).config({path:"/.env"})

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import mongoose from "mongoose";

dotenv.config(//configuration of dotenv
    {
        path:"/.env"
    }
)

connectDB();//its call that and then connect them