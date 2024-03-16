const express=require('express')
const auth=require('../middleware/auth')
const User=require('../model/userSchema')
const router=express.Router();

router.get('/isAuthenticated',auth,(req, res)=>{
    // console.log(req.user._id)
    // const user=User.findById(req.user._id).then((user)=>{
    //     console.log(user)
    // })
    res.status(200).json({message:'User Authenticated'})
})

router.get('/getUserDetails',auth,(req, res)=>{
    console.log(req.user._id)
    User.findById(req.user._id).then((user)=>{
        console.log(user)
        if(!user){return res.status((404)).end()}
        user.password=''
        res.status(200).json(user)
    })
})

module.exports=router