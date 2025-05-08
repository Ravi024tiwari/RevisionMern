import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {Apierror} from "../utils/apierror.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const tweetId = req.params?.tweetId;//here we get that tweetId from the frontEnd
    const userId =req.user._id.toString();//here we get that user that like the tweet
    console.log("The user id is:",userId);
    console.log("The user is:",req.user);
    if(!userId){
        throw new Apierror(401,"Logged in user Not found!!");
    }
    //TODO: toggle like on tweet
    //we pass the like with verify jwt so the user must be logged in the plateform
    //if that tweetId not found in likedatabase then add it otherwise delete that

    if(!tweetId){
        throw new Apierror(501,"Server Error no Like by Users!!");
    }

    const alreadyLike =await Like.findOne({tweet:tweetId});//here we found that in
    const LikeId =alreadyLike?._id;//here we found that id from the database 

    //console.log("The")
    //if this is found in database of likeModel then the tweet is already like
    if(alreadyLike){
      const disLikeTweet=  await Like.deleteOne({_id:LikeId});//delete or dislike by using the id of Liketweet
      if(!disLikeTweet){
        throw new Apierror(401,"Disliking of tweet is failded!!");
      }
      //now send response 
      return res
      .status(200)
      .json(new ApiResponse(201,
       {disLikeTweet},
       "Successfully dislike that tweet!!")
       )}
    else{//if the already not like the tweet then we have to like that tweet
           //here the documents not formed already we have to firstly formed that then update that
    const newLikeTweet= await Like.create(//here we create a new docs to like a tweet
            {
                tweet:tweetId,//in tweet we save the tweet id and 
                likedBy:userId,//in liked by we saved that logged in userId
            }
           )

         const SaveLikeTweet=await  newLikeTweet.save({validateBeforeSave:false})
         if(!SaveLikeTweet){
            throw new Apierror(401,"Liking of Tweet is failed!!");
         }

         return res
         .status(200)
         .json(new ApiResponse(201,
            {SaveLikeTweet},
            "Successfully Like the tweet!!"
         ))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}