const Joi = require('joi');

const signupValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    roles: Joi.array().items(Joi.string()).optional() // Assuming roles is an array of strings
  });


  const signinValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  module.exports = {signupValidationSchema , signinValidationSchema};