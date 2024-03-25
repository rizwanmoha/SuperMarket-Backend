const Wishlist = require("../models/wishlist");
const Cart = require("../models/cart");

const getwishlistService = async(userId) =>{
    try{
        const wishlist = await Wishlist.findOne({user : userId}).populate("items.productId");
        return {success : true ,status : 200 , wishlist , message : "Wishlist data"};
    }
    catch(error){
        return {success : false , status : 500 , message : "Error while getting the wishlist data" };
    }


}

const addToWishlistService = async(productId , userId) =>{
    try{
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            
            wishlist = new Wishlist({ user: userId, items: [productId] });
          } else {
            
            const isPresent = wishlist.items.findIndex((item )=> item === productId);
            
            if (isPresent !== -1) {
              return {success : false , status : 400 , message : "Item is already there in the wishlist"};
            //   console.log("Item is already in the wishlist");
            } else {
              
              wishlist.items.push(productId)
            }
          }
          await wishlist.save();
          
          return {success : true , status : 200 ,  message : "Item added in the wishlist"}


    }
    catch(error){
            return {success : false , status : 500 , message : "Internal server error"};
    }
}

module.exports = {getwishlistService , addToWishlistService};