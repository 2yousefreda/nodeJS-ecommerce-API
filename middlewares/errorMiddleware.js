const glopalError = (err,req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === 'dev'){
        sedErrorForDev(err,res)
    }else{
        sendErrorForProd(err,res)    
    }
    
}

const sedErrorForDev=(err,res)=>{
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

module.exports=glopalError