const bcrypt=require("bcrypt")
const User=require('../model/userSchema')
const nodemailer=require('nodemailer')
const Mailgen=require('mailgen')
const jwt = require("jsonwebtoken");
const {signUpBodyValidation, loginBodyValidation} = require("../utils/validationSchema");
const generateOTP = require("../utils/generateOTP");

const sendOTP=(req,res)=>{
    const userEmail=req.body.email
    let config={
        service:'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
    }

    const OTP=generateOTP()
    let transporter = nodemailer.createTransport(config)
    let MailGenerator= new Mailgen({
        theme:"default",
        product:{
            name:"Navkar Artistry Hub",
            link:"https://navkarartistryhub.com"
        }
    })

    let response={
        body:{
            intro:`Your OTP is ${OTP}`
        },
        outro:"Looking forward to do more business"
    }

    let mail=MailGenerator.generate(response)
    let message={
        from: process.env.EMAIL,
        to:userEmail,
        subject:"Place Order",
        html: mail
    }
    transporter.sendMail(message).then(()=>{
        return res
            .status(201)
            .json({message:"e-mail sent"})
    }).catch(error=>{
        return res.status(500).json(error)
    })
}

const signUp= async (req, res)=>{
    console.log(req.body)
    // const {name, email, password}=req.body;
    // if(!name || !email || !password){
    //     return res.status(422).json({error :'PLs fill'})
    // }

    const {error}=signUpBodyValidation(req.body);
    if(error){
        console.log(error)
        return res.status(400).json({error:error});
    }
    const user= await User.findOne({email: req.body.email})
    if(user){
        return res.status(400).json({error:true,message:"User Already Exists"})
    }

    const salt=await bcrypt.genSalt(Number(process.env.SALT))
    const hashPassword= await bcrypt.hash(req.body.password, salt)

    await new User({...req.body, password: hashPassword}).save()

    res.status(201).json({error:false, message:"Account created successfully"})
}

const login=async (req, res)=> {
    try{
        const {error}=loginBodyValidation(req.body);
        if(error){
            console.log(error)
            return res.status(400).json({error:error});
        }
        const user= await User.findOne({email: req.body.email})
        if(!user){
            return res.status(401).json({error:true,message:"Invalid email or password"})
        }

        const verifiedPassword= await bcrypt.compare(req.body.password,user.password)
        if(!verifiedPassword){
            return res.status(401).json({error:true,message:"Invalid email or password"})
        }
        const payload={_id:user._id, roles: user.roles};
        const token=jwt.sign(
            payload,
            process.env.TOKEN_PRIVATE_KEY,
            {expiresIn:"86400"}
        )

        user.password=''
        res.status(200).json({
            error:false,
            token,
            message:"Logged in successfully",
            user: user
        })
    }catch (err){
        console.log(err);
        res.status(500).json({error:true,message:"Internal Server Error"})
    }
}

module.exports={sendOTP, signUp, login}