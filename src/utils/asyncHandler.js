
const asyncHandler =(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).//call the requesthandler
        catch((err)=>next(err))
         }
}


export {asyncHandler};