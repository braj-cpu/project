const asyncHandler = (requestHandler) =>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}

export{asyncHandler}



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