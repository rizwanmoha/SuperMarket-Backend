const Joi = require('joi');

const addComplaintValidation = Joi.object({
    name : Joi.string().required(),
    email : Joi.string().required(),
    phone : Joi.string().required(),
    subject : Joi.string().required(),
    message : Joi.string().required()

})

module.exports = {addComplaintValidation}