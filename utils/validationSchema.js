const Joi = require("joi");
const signUpBodyValidation=(body)=>{
    const password='Password'
    const schema=Joi.object({
        name: Joi.string().required().label("Name"),
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
        otp: Joi.required().label('OTP')
    });
    return schema.validate(body)
}

const loginBodyValidation=(body)=>{
    const schema=Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    });
    return schema.validate(body)
}


module.exports={signUpBodyValidation,
    loginBodyValidation,
}