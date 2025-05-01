class Apierror extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",//this is parameter's that hold all {key:value} of different errors
        errors =[],//this holds all the defults error
        stack =""
    ){
        super(message)//this is inheritence property
        this.statusCode =statusCode
        this.data =null
        this.message =message;
        this.success =false
        this.errors =errors

        if(stack) {
            this.stack =stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
            //stack trace give info where the error is occure {file name,line number } in stack form in all the file
            //its helpful in debugging the error to the clients
        }
    }
}

export {Apierror}