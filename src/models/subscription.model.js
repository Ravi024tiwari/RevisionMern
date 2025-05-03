import mongoose from "mongoose";

const subscriptionSchema =new mongoose.Schema(
    {
    subscriber:{
        typer:mongoose.Schema.Types.ObjectId,//one who is subcribing
        ref:"UserModel"
       },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel"
       }//one who subscriber is subscriber is subscribing
    },
    {
        timestamps:true
    }
)

export const subscriptionModel =mongoose.model("subscriptionModel",subscriptionModel)