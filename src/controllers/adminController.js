const Product = require("../models/product.js");
const Analytics = require("../models/analytics.js");
const User = require("../models/User.js");
const Order = require("../models/order.js")
const Cart=require("../models/cart.js")
const {allProductsService , updateUserProfileService} = require("../services/adminServices.js")

const getAllProducts = async (req, res, next) => {
  try {
    
    const result = await allProductsService();
    if (result.success) {
      
      return res.json(result.products);
    } else {
     
      throw new Error("Failed to fetch products");
    }

  } catch (err) {
    next(err);
  }
};
const updateUserProfile = async (req, res, next) => {
  try {
    const { id } = req.body
    const {update} = req.body;
    
    const result = await updateUserProfileService(id, update);
    if(result.success){
      return res.json(result.user);
    }
    else{
      return res.status(404).json({ msg: "User not found" });
    }

  } catch (err) {
    next(err);
  }
};
const getUserbyID = async(req, res, next) =>{
     try {
       const id = req.query.userId;
       const user = await User.findById(id);

       if (!user) {
         return res.status(404).json({ msg: "User not found" });
       }

       return res.json(user);
     } catch (err) {
       next(err);
     }
}
const updateProduct = async (req, res, next) => {
  try {
    const { id }=req.body
    const {
      productName,
      shortDescription,
      price,
      brand,
      stockQuantity,
      discount,
      length,
      width,
      height,
      description,
      imageUrls,
      tags,
      categories,
      colors,
    } = req.body;
    if (
      !id ||
      !productName ||
      !shortDescription ||
      !price ||
      !brand ||
      !stockQuantity ||
      !discount ||
      !length ||
      !width ||
      !height ||
      !description ||
      !imageUrls ||
      !categories ||
      !colors
    ) {
      return res.status(400).json({ msg: "Missing Information" });
    }
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
    
    const newproduct = await Product.findByIdAndUpdate(id, product, { new: true });
    if (!newproduct) {
      return res.status(404).json({ msg: "Product not found" });
    }
    console.log(newproduct)
     res.json(newproduct)
  } catch (error) {
    next(error);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.body;

    // Delete the product
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Delete all orders containing this product
    await Order.deleteMany({ "items.productId": id });

    // Remove the product from users' carts
    await Cart.updateMany({}, { $pull: { items: { product: id } } });

    return res.json({ msg: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  updateUserProfile,
  getUserbyID,
  updateProduct,
  deleteProduct
};