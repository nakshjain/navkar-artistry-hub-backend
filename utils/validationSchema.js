const Joi = require("joi");
const passwordComplexity=require("joi-password-complexity")
const signUpBodyValidation=(body)=>{
    const password='Password'
    const schema=Joi.object({
        name: Joi.string().required().label("Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password")
    }).messages({
        'string.email': 'Must be a valid email'
    });
    return schema.validate(body)
}

const loginBodyValidation=(body)=>{
    const schema=Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    }).messages({
        'string.email': 'Must be a valid email'
    });
    return schema.validate(body)
}


module.exports={signUpBodyValidation,
    loginBodyValidation,
}