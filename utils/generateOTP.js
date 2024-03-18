const otpGenerator=require('otp-generator')

const generateOTP=()=>{
    const OTP=otpGenerator.generate(6,{
        digits:true,
        lowerCaseAlphabets:false,
        upperCaseAlphabets:false,
        specialChars:false
    })

    const validity=new Date(Date.now() + 15 * 60 * 1000)
    return { OTP, validity };
}

module.exports=generateOTP