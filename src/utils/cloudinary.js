import { v2 as cloudinary } from 'cloudinary';

import fs from "fs"

    // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUD_SECRECT_KEY  // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
    const uploadOnCloudinary =async (localfilePath)=>{//jisko upload krna hai uska path bhej 
        try{
            if(!localfilePath) return null;
            const uploadResult =await cloudinary.uploader.upload(localfilePath,{
                resource_type:"auto"//type of file we upload
            });//file path

           console.log("Successfully uploaded the file on Cloudinary!",uploadResult);//here we get all res of file uploaded
           return uploadResult;//after uploading its over
          // fs.unlinkSync(localfilePath);
        }
        catch(err){
            fs.unlinkSync(localfilePath)//its unlink the path
            console.log("Uploadation is unsuccessful!!",err);
            return null;
        }
    }

    export {uploadOnCloudinary};//here we export that file
     

