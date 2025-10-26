const ApiError=require('../utils/apiError')

const sendErrorForDev=(err,res)=>{
    return res.status(err.statusCode).json({
        status: err.status,
        err:err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorForProd=(err,res)=>{
    if(err.isOperational){
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
    })
}
const jwtInvalidSignature=()=>{
    return new ApiError('Invalid token. Please log in again',401)
}
const jwtExpiredToken = () => {
    return new ApiError('Token has expired. Please log in again', 401)
}
const globalError = (err,req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === 'dev'){
        sendErrorForDev(err,res)
    }else{
        if(err.name === 'JsonWebTokenError')
            err=jwtInvalidSignature()
        if(err.name === 'TokenExpiredError')
            err=jwtExpiredToken()
        
        sendErrorForProd(err,res)    
    }
    
}



module.exports=globalError