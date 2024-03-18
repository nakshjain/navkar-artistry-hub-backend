const User = require("../model/userSchema");
const isAuthenticated=(req, res)=>{
    res.status(200).json({message:'User Authenticated'})
}

const getUserDetails= async (req, res)=>{
    await User.findById(req.user._id).then((user)=>{
        if(!user){return res.status((404)).end()}
        user.password=''
        res.status(200).json(user)
    })
}

module.exports={
    isAuthenticated,
    getUserDetails
}