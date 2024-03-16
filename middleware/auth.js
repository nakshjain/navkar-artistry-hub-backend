const jwt=require('jsonwebtoken')

const auth=async (req,res, next)=>{
    const token=req.header('authorization')
    if(!token){
        return res
            .status(403)
            .json({error:true, message:"Access Denied: No token provided"})
    }
    try {
        const tokenDetails=jwt.verify(
            token,
            process.env.TOKEN_PRIVATE_KEY
        )
        req.user=tokenDetails
        next()
    }catch (err){
        console.log(err)
        return res
            .status(403)
            .json({error:true, message:"Access Denied: Invalid token"})
    }
}

module.exports=auth