import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from  "jsonwebtoken"

const UserSchema =new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            lowerCase :true,
            unique:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowerCase :true,
            trim:true,
            
        },
        fullName:{
            type:String,
            required:true,
            lowerCase :true,
            trim:true,
        },
        avatar:{
            type:String,//ye cloundnary ka url use karenge
            required:true,
        },
        coverImage:{
            type:String,
        },
        watchHistory:[
           { 
            type:mongoose.Schema.Types.ObjectId,
            ref:"VidelModel"
        }
        ],
        password:{
            type:String,
            required:[true,"Password is required!!"]
        },
        refreshToken:{
            type:String,
        }

        

    },{timestamps:true}
)
//firstly hash the passwords //use as a middleware
UserSchema.pre("save",async function(next){//ye userShema par encrption chal rha hai
  if(!this.isModified("password")){
    return next();//iske badd aage badh jaao
  }
  try{
    //const salt =await bcrypt.getSalt(10);
    this.password =await bcrypt.hash(this.password,10);//save the hash password
    next();//save krne jab ja rhe ho pahle isko kar lena then next() chala lena
  }
  catch(err){
    next(err);
  }
})

//now make some methods on UserSchame
//kyuki se hamesa kaam nhi karna its only when verify user
UserSchema.methods.ispasswordCorrect =async function(password){//ye password user bhejega
   return  await bcrypt.compare(password, this.password);
  //return true or false value during comparing the incoming and store  password
}

//make a another method to generate the Access Token in UserSchema

 UserSchema.methods.generateAccessToken =function(){
   return  jwt.sign(//ye payload se hame ye info of that user mil sakti by use of accesstoken
        {
            _id:this._id,
            username:this.username,
            email :this.email,
            fullname:this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,//given the secret for the making of accesstoken
        {
            expiresIn :process.env.ACCESS_TOKEN_EXPIRY//this is how it set the accestokn
        }
    )
}

UserSchema.methods.refreshToken =function(){
    return jwt.sign(//ye payload se hame ye info of that user mil sakti by use of accesstoken
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,//given the secret for the making of accesstoken
        {
            expiresIn :process.env.REFRESH_TOKEN_EXPIRY//this is how it set the accestokn
        }
    )
}

//these are access by users Schema

export const UserModel =mongoose.model("UserModel",UserSchema)