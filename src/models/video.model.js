import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const VideoSchema =new mongoose.Schema(
    {
        videoFile:{
            type:String,
            required:[true,"VideoFile is required"],
        },
        thumbnail:{
            type:String,
            required:true,
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"UserModel",
            required:true,
            trim:true,
        },
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        duration:{
            type:Number,//from the cloudnary 
            required:true,
        },
        views:{
            type:Number,//its from cloudnary
            default:0,
        },
        isPublished:{
            type:Boolean,
            default:true,
        },
    },{timestamps:true}
)

video.plugin(mongooseAggregatePaginate);//we add plugin in the agrregation piplelines

export const VidelModel =mongoose.model("VidelModel",VideoSchema)