class Apierror extends Error{
    constructor(
         statusCode,
         message="Something went wrong!!",
         errors =[],//array of error
         stack ="",
    ){
        this.statusCode =statusCode,
        this.message =message,
        this.errors =errors,
        this.success =false,
        this.data =null;

        if(stack){//to trace the error on files
             this.stack =stack;
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {Apierror};