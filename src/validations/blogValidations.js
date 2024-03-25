const Joi = require('joi');


const createBlogValidationSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

module.exports = {createBlogValidationSchema};
