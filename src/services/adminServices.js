const Product = require("../models/product.js");
const User = require('../models/User.js');
const Order = require('../models/order.js');
const Cart = require('../models/cart.js');
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

  const getUserByIDService = async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {success : false};
      }
      return {success : true , user};
    } catch (err) {
      return {success : false}
    }
  };

  const updateProductService = async (productData) => {
    try {
      // const { id, ...product } = productData;
      // const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
  
      // if (!updatedProduct) {
      //   return { success: false, message: 'Product not found' };
      // }
  
      // return { success: true, updatedProduct };
      const {id , productName ,shortDescription , price ,brand , stockQuantity ,discount , length ,width , height , description , imageUrls , tags , categories , colors } = productData;

           const product ={
       name: productName,
       shortDescription,
       description,
       price: parseInt(price),
       brand,
       tags: tags.map((tag) => {
         return tag.name;
       }),
       categories: categories.map((category) => {
         return category.name;
       }),
       images: imageUrls.map((image) => ({
         type: "image",
         source: image.name,
       })),
       stockQuantity: parseInt(stockQuantity),
       discount,
       colours: colors.map((color) => color.name),
       dimensions: {
         length: parseFloat(length),
         width: parseFloat(width),
         height: parseFloat(height),
       },
    };
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });

     if (!updatedProduct) {
        return { success: false, message: 'Product not found' };
      }
  
      return { success: true, updatedProduct };

    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteProductService = async (productId) => {
    try {
      
      const product = await Product.findByIdAndDelete(productId);
  
      if (!product) {
        return { success: false, message: "Product not found" };
      }
  
    
      await Order.deleteMany({ "items.productId": productId });
  
      
      await Cart.updateMany({}, { $pull: { items: { productId } } });
  
      return { success: true, message: "Product deleted successfully" };
    } catch (err) {
      return { success: false, message: error.message };
    }
  };





module.exports = {allProductsService , updateUserProfileService , getUserByIDService , updateProductService , deleteProductService};