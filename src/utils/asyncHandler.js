const asyncHandler =async ()=>{
    try{
        const connectionInstance= await mongoose.connect(`mongodb://127.0.0.1:27017/${DB_NAME}`);//yha par mai .env se bhi le sakta hu 
         console.log(`MongoDB connectec Successfully !! DB HOST: ${connectionInstance.connection.host}`)
      }// connectionInstance.connection.host its gives port number or host
      catch(e){
        console.log("DataBase Connection Unsuccessfull! Try Again",e);
        process.exit(1);
      }
}
export {asyncHandler};