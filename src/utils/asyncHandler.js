const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  }
};

export { asyncHandler };

//Express won’t automatically catch error like DB is down. Without proper handling, the server crashes or the error isn’t passed to the error middleware. This is why it is used

// asyncHandler = wrapper for async route functions
// Automatically forwards errors to Express error-handling middleware
// Eliminates repetitive try-catch in every route



//const asyncHandler= (func)=>{()=> {}}//function further passed to another func

// const asyncHandler=(fn)=> async(req, res, next)=>{
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             succees: false,
//             message: error.message
//         })
//     }
// } 