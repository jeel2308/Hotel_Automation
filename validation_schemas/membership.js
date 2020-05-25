const Joi = require("@hapi/joi");

const registerSchema = Joi.object({
    username : Joi.string().alphanum().min(2).required(),
    email : Joi.string().email().required(),
    password : Joi.string().min(8).required(),
    publicKey : Joi.string().required(),
    privateKey : Joi.string().required()
}).options({
    abortEarly : false
});

const loginSchema = Joi.object({
    username : Joi.string().alphanum().required(),
    password : Joi.string().required()
}).options({
    abortEarly : false
});

module.exports = {
    registerSchema,loginSchema
};