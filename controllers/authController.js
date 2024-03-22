const bcrypt=require("bcrypt")
const User=require('../model/userSchema')
const OTP=require('../model/userOTPSchema')
const nodemailer=require('nodemailer')
const Mailgen=require('mailgen')
const jwt = require("jsonwebtoken");
const {signUpBodyValidation, loginBodyValidation} = require("../utils/validationSchema");
const generateOTP = require("../utils/generateOTP");

const sendOTP=async (req,res)=>{
    const userEmail=req.body.email
    const name=req.body.name
    const user= await User.findOne({email: req.body.email})
    if(user){
        return res.status(400).json({error:true,message:"User Already Exists"})
    }
    let config={
        service:'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        },
        from: '"Navkar Artistry Hub" <' + process.env.EMAIL + '>'
    }
    const {OTP: generatedOTP,validity: validity}=generateOTP()
    let transporter = nodemailer.createTransport(config)
    let MailGenerator= new Mailgen({
        theme:"default",
        product:{
            name:"Navkar Artistry Hub",
            link:"https://navkarartistryhub.com"
        }
    })
    let response = {
        body: {
            name: name,
            intro: [`Thank you for registering an account with Navkar Artistry Hub!`,`Your One-Time Password (OTP) for Account Registration: ${generatedOTP}`],
            instructions: "Please enter this OTP on the registration page to verify your email address and activate your account.",
            action: {
                instructions: "If you did not request this OTP or have any questions, please contact our support team immediately.",
                button: {
                    text: "Contact Support",
                    link: "mailto:navkarartistryhub@gmail.com"
                }
            },
            outro: "Looking forward to doing more business."
        }
    }

    let mail=MailGenerator.generate(response)
    let message={
        from: process.env.EMAIL,
        to:userEmail,
        subject:" Your One-Time Password (OTP) for Account Registration",
        html: mail
    }

    await OTP.deleteOne({email: userEmail})
    const generatedOTPInt=parseInt(generatedOTP)
    await new OTP({ email: userEmail, OTP: generatedOTPInt, validity }).save()
    transporter.sendMail(message).then(()=>{
        return res
            .status(201)
            .json({message:"OTP sent"})
    }).catch(error=>{
        return res.status(500).json(error)
    })
}
const checkOTPValidity= async (userEmail, otpProvided, res) =>{
    const otp = await OTP.findOne({ email: userEmail, OTP: otpProvided });
    if (!otp) {
        res.status(400).json({error:true,message:"Invalid OTP"});
        return false
    }
    if (otp.validity < Date.now()) {
        res.status(400).json({error:true,message:"OTP expired"});
        return false
    }
    await OTP.deleteOne({ email: userEmail, OTP: otpProvided })
    return true;
}

const signUp= async (req, res)=>{
    const {error}=signUpBodyValidation(req.body);
    if(error){
        console.error(error)
        return res.status(400).json({error:error});
    }
    const user= await User.findOne({email: req.body.email})
    if(user){
        return res.status(400).json({error:true,message:"User Already Exists"})
    }

    const isValid=await checkOTPValidity(req.body.email, req.body.otp, res)
    if(isValid){
        const salt=await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword= await bcrypt.hash(req.body.password, salt)
        await new User({...req.body, password: hashPassword}).save()
        return res.status(201).json({error:false, message:"Account created successfully"})
    }
    else{
        return res
    }
}

const login=async (req, res)=> {
    try{
        const {rememberMe}=req.query
        const {error}=loginBodyValidation(req.body);
        if(error){
            console.error(error)
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

        let expiry="86400"
        if(rememberMe){
            expiry="604000"
        }
        const payload={_id:user._id, roles: user.roles};
        const token=jwt.sign(
            payload,
            process.env.TOKEN_PRIVATE_KEY,
            {expiresIn:expiry}
        )
        const{_id,password,__v,...userWithoutId}=user.toObject()
        res.status(200).json({
            error:false,
            token,
            message:"Logged in successfully",
            user: userWithoutId
        })
    }catch (err){
        console.error(err);
        res.status(500).json({error:true,message:"Internal Server Error"})
    }
}

const isAuthenticated=(req, res)=>{
    res.status(200).json({message:'User Authenticated'})
}

module.exports={sendOTP, signUp, login, isAuthenticated}