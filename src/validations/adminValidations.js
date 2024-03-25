const Joi = require('joi');

const updateProductValidationSchema = Joi.object({
  id: Joi.string().required(),
  productName: Joi.string().required(),
  shortDescription: Joi.string().required(),
  price: Joi.number().required(),
  brand: Joi.string().required(),
  stockQuantity: Joi.number().required(),
  discount: Joi.number().required(),
  length: Joi.number().required(),
  width: Joi.number().required(),
  height: Joi.number().required(),
  description: Joi.string().required(),
  imageUrls: Joi.array(),  //.items(Joi.string()).required()
  tags: Joi.array() , // .items(Joi.string()).required(),
  categories: Joi.array() , // .items(Joi.string()).required(),
  colors: Joi.array()      // .items(Joi.string()).required()
});

module.exports =  { updateProductValidationSchema };