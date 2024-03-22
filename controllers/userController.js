const User = require("../model/userSchema");

const getUserDetails= async (req, res)=>{
    await User.findById(req.user._id).then((user)=>{
        if(!user){return res.status((404)).end()}
        const{_id,password,__v,...userWithoutId}=user.toObject()
        res.status(200).json(userWithoutId)
    })
}

module.exports={
    getUserDetails
}