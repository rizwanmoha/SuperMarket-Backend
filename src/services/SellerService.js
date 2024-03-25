const Product = require("../models/product");
const Order = require("../models/order")
const Cart=require("../models/cart");
const Analytics = require("../models/analytics");
const User = require("../models/User")

const getAllProductsService = async(user) =>{
    try{
        const products =  await Product.find({seller : user});

        return {success : true , status : 200 , products , message : "List of products"};

    }
    catch(error){
            return {success : false , status : 500 , message : "Internal server error "};

    }

}

const addProductService = async(productData) =>{
    try{
        const { productName, shortDescription, price, brand, stockQuantity, discount, length, width, height, description, imageUrls, tags,categories, colors } = productData;
        if (!productName ||
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
        //   return res.status(400).json({ msg: "Missing Information" });
        return {success : false ,status : 400 , message : "Missing information "};
        }
        const product = new Product({
          name: productName,
          shortDescription,
          description,
          price:parseInt(price),
          brand,
          tags:tags.map((tag) => { return tag.name }),
          categories: categories.map((category) => { return category.name }),
          images: imageUrls.map((image) => ({type: "image", source: image.name })),
          stockQuantity: parseInt(stockQuantity),
          seller: req.user._id,
          reviews: [],
          ratingCounts: {},
          discount,
          colours: colors.map((color) => (color.name)),
          dimensions: {
            length: parseFloat(length),
            width: parseFloat(width),
            height:parseFloat(height),
          }
        });
        await product.save();
        // return res.status(201).json({ msg: "Product Created Successfully" });
        return {success : true , status : 201 , message : "Product Created Successfully"};

    }
    catch(error){
        return {success : false ,status : 500 , message : "Internal Server error "};
    }

}

const updateProductService = async(productData) =>{
    try{
        const { id } = productData;
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
          seller_id
        } = productData;
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
          !colors ||
          !seller_id
        ) {
        //   return res.status(400).json({ msg: "Missing Information" });
        return {success : false , status : 400 , msg : "Missing Information"};
        }
        if (imageUrls.length == 0) {
        //   return res.status(400).json({ msg: "Missing Information" });
        return {success : false , status : 400 , msg : "Missing Information"};
        }
        if (seller_id !== String(req.user._id)) {
        //   return res.status(401).json({ msg: "Unauthorized" });
        return {success : false , status : 401 , msg : "Unauthorized"};
        }
        const product = {
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
    
        const newproduct = await Product.findByIdAndUpdate(id, product, {
          new: true,
        });
        if (!newproduct) {
        //   return res.status(404).json({ msg: "Product not found" });
        return {success : false , status : 404 , msg : "Product not found"};
        
        }
        // console.log(newproduct);
        // res.json(newproduct);
        return {success : true , status : 200 ,newproduct , msg : "Product Updated Successfully"};

    }
    catch(error){
        return {success : false , status : 500 , msg : "Internal server error"};
    }
}

const deleteProductService = async(productData) =>{
    try{
        const { id, seller_id } = productData;
    if (seller_id !== String(req.user._id)) {
    
    return {success : false , status : 401 , message : "Unauthorized"};
    }
    
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
    
    return {success : false , status : 404 , message : "Product not found"};
    }

    
    await Order.deleteMany({ "items.productId": id });

    
    await Cart.updateMany({}, { $pull: { items: { product: id } } });

    
    return {success : true , status : 200 , message : "Product deleted successfully"};
    }
    catch(error){
        return {success : false , status : 500 , message : "Internal server error"};
    }

}

const becomeSellerService = async(sellerData ,userId) =>{
    try{
        const { phone, accountNumber, upiId, about } = sellerData;
    if (!phone || !accountNumber || !upiId || !about) {
    //   return res.status(400).json({ msg: "Missing Information" });
    return {success : false , status : 400 , msg : "Missing Information"};
    }
    // const userId = req.user._id;
    const user = await User.findById(userId);
     if (!user) {
    //    return res.status(404).json({ msg: "User not found" });
    return {success : false , status : 404 , msg : "User not found"};
    }
    if (!user.roles.includes("seller")) {
      user.roles.push("seller");
      await user.save();
    }
    const analytic = new Analytics({
      items: [],
      seller_id: userId,
      phone,
      accountNumber,
      upiId,
      about
    })
    await analytic.save()
    // return res.status(201).json({ msg: "Became Seller Success" });
    return {success : true , status : 201 , msg : "Became Seller Successfully"};
    }
    catch(error){
        return {success : false , status : 500 , msg : "Internal server error"};
    }
}

const getSellerDetailService = async(sellerId) =>{

    try{
        const analytics = await Analytics.findOne({seller_id : sellerId});
        if (!analytics) {
            // return res
            //   .status(404)
            //   .json({ message: "Analytics data not found for this user" });
            return {success : false , status : 404 , message : "Analytics data not found for this user"};
          }
      
          const { phone, accountNumber, upiId, about } = analytics;
          
        //   res.json({ phone, accountNumber, upiId, about });
        return {success : true ,status : 200 , phone : phone ,accountNumber : accountNumber , upiId : upiId , about :about};

    }
    catch(error){
        return {success : false , status : 500 , message : "Internal server error"};
    }

}

const updateDetailService = async(sellerData , sellerId) =>{
    try{
        const { phone, accountNumber, upiId, about } = sellerData; 

       
        const updateObj = {
          phone,
          accountNumber,
          upiId,
          about,
        };

        
        const updatedAnalytics = await Analytics.findOneAndUpdate(
          { seller_id: sellerId },
          updateObj,
          {
            new: true, 
          }
        );

        if (!updatedAnalytics) {
       
        return {success : false , status : 404 , message  : "Analytics data not found for the seller"}
        }

       
        return {success : true , status : 200 , analytics :updatedAnalytics  , message : "Analytics details updated successfully"}

    }
    catch(error){
        return {success : false , status : 500 , message  : "Internal server error"};
    }
}



module.exports = {getAllProductsService , addProductService , updateProductService, deleteProductService , becomeSellerService , getSellerDetailService , updateDetailService};
