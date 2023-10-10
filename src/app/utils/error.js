const errorHandler = (statusCode,message)=>{
    const error = new Error();
    error.code = statusCode;
    error.message = message;
    return error;
};

module.exports = errorHandler