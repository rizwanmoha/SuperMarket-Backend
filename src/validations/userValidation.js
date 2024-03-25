const Joi = require('joi');

const addAddressValidationSchema = Joi.object({
    name : Joi.string().required(),
    phoneNumber : Joi.string().required(),
    street : Joi.string().required(),
    city : Joi.string().required(),
    landmark : Joi.string().required(),
    state : Joi.string().required(),
    pincode : Joi.string().required()


})

const changePasswordValidation = Joi.object({
    oldPassword : Joi.string().required(),
    newPassword : Joi.string().required()
})


module.exports = {addAddressValidationSchema , changePasswordValidation};