const Product = require("../models/product.js");
const User = require('../models/User.js');
const allProductsService = async () => {
    try {
      const products = await Product.find();
      return {success : true , products};
    } catch (err) {
      return {success : false};
    }
  };

  const updateUserProfileService = async (id, update) => {
    try {
      const user = await User.findByIdAndUpdate(id, update, { new: true });
  
      if (!user) {
        return {success : false};
      }

      return {success : true , user};
    } catch (err) {
      return {success : false}
    }
  };



module.exports = {allProductsService , updateUserProfileService}