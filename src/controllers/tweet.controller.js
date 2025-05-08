import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {UserModel} from "../models/user.model.js"
import {Apierror} from "../utils/apierror.js"
import {ApiResponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    //Now we have to create the tweet 
    //Firstly the user should be logged in 
    //With the help of Postman we send the tweet from there
    //Here we use req.body to fetch the tweet
    const {content} =req.body;

    if(!content){
        throw new Apierror(401,"Tweet is not posted its empty!");
    }

     //first put the content
    
    const newTweet =await Tweet.create(
        {
            content :content,
            owner:req.user._id,//because when its only when we use verify jwt as a middleware to show that the user is logged in 
        }
    )
    await newTweet.save({ validateBeforeSave:false});//to save new tweet 
    if(!newTweet){
        throw new Apierror(401,"Forming of new Tweet is Failded!!")
    }
  //if it get formed new tweet in data base
 //then set response tho
  return res
  .status(200)
  .json(new ApiResponse(201,
    {newTweet},
    "Congratulation You created new Tweet SuccessFully!!")
  );
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    //now we have to get the logged in User who were just post that tweet
    //firstly we use verigy the JWT to get the logged in user
    //then send the response of that logged in user

    const currUserId =req.user?._id;//here we get that user
    if(!currUserId){
        throw new Apierror(401,"There is no Logged in User!!");
    }

    console.log("The current user id:",currUserId);//thisis the curr user id
    //Now find that user  from the database
    const CurrUserTweet =await Tweet.find({owner:currUserId})//agar hame sirf current user hi find krna hai

    if(CurrUserTweet.length===0){
        throw new Apierror(402,"No tweeted User is Found in DB!!");
    }
    console.log(("Here all the tweets of CurrentLogged in User:",CurrUserTweet));

    //now send response
    return res
    .status(200)
    .json(new ApiResponse((201),
    {CurrUserTweet},
    "SuccessFully get all the tweet of logged in User!!")
);
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    //firstly we get tweetId from the req.params 
    //secodly we fetch that tweet from the database
    //then save the new tweet from the frontend
    //save that updated tweet 

    const {tweetId} =req.params;//here we get that id 
    console.log("The tweet id is:",tweetId);
    const {content} =req.body;
    if(!tweetId){
        throw new Apierror(401,"TweetId not send with the url!!");
    }
    console.log("the Updating tweet from req.body:",content);
    const targetTweet =await Tweet.findByIdAndUpdate(tweetId, 
        { $set:{
            content :content,//here we set that new tweet from reqbody
         }},
        {new :true} );//here it set and as well as save this

        if(!targetTweet){
            throw new Apierror(401,"Get and update is failed!!");
        }
        console.log("The target Updated tweet is:",targetTweet);

    const saveUpdatedTweet = await targetTweet.save({validateBeforeSave:false});//now save the updated tweet 
    console.log("After saving the tweet in mongoDb:",saveUpdatedTweet);

    if(!saveUpdatedTweet){
        throw new Apierror(402,"SaveUpdatedTweet failded!!");
    }


    //if all this happen now send the response
    res
    .status(200)
    .json(new ApiResponse(201,
        {targetTweet},
        "Successfully updated your tweet!!",
    ))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    //for deleting that tweet is same as updating the tweet 
    //firstly get the tweetid from the frontEnd
    //if its correctly found then deleteThat from the database
    //Return the response of the deleted Tweet
    const {dltweetId} =req.params;//this tweet id from the route we use
    if(!dltweetId){
        throw new Apierror(401,"TweetId is not present!!");
    }
    //here is not content from the frontEnd

    const targetTweet =await Tweet.findById(dltweetId);
    if(!targetTweet){
        throw new Apierror(401,"Target tweet is not found in database!!");
    }

    const deletingTweet =await Tweet.deleteMany({_id:dltweetId});

    if(!deletingTweet){
        throw new Apierror(401,"Deletion of tweet get failded!!");
    }
    

    return res
    .status(201)
    .json(new ApiResponse(201,
        {deletingTweet},
        "Successfully deleted the tweeet!!"
    ))
    
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}