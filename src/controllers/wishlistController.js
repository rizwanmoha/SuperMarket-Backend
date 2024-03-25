const Wishlist = require("../models/wishlist");
const Cart = require("../models/cart");
const {getwishlistService , addToWishlistService} = require('../services/wishlistService');

const getwishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // const wishlist = await Wishlist.findOne({ user: userId }).populate(
    //   "items.productId"
    // );
    // res.json(wishlist);
    const result = await getwishlistService(userId);
    if(result.success){
      return res.status(result.status).json(result.wishlist);
    }

    return res.status(result.status).json({message : result.message});
  } catch (error) {
    next(error);
  }
};
const addTowishlist = async (req, res, next) => {
  try {
    console.log("success in making the wishlist");

    // Extract productId from the request body
    const { productId} = req.params;
    // Extract userId from the authenticated user
    const userId = req.user.id;
    
    
    // // Find the wishlist for the user
    // let wishlist = await Wishlist.findOne({ user: userId });
    
    // if (!wishlist) {
    //   // If the wishlist doesn't exist for the user, create a new one
    //   wishlist = new Wishlist({ user: userId, items: [productId] });
    // } else {
    //   // Check if the product already exists in the wishlist
    //   const isPresent = wishlist.items.findIndex((item )=> item === productId);
    //   console.log(isPresent);
    //   if (isPresent !== -1) {
    //     // Product is already in the wishlist
    //     console.log("Item is already in the wishlist");
    //   } else {
    //     // Add the productId to the wishlist items array
    //     wishlist.items.push(productId)
    //   }
    // }

    // // Save the updated wishlist
    // await wishlist.save();
    // res.send("Success in making the wishlist");
    const result = await addToWishlistService(productId , userId);
    if(result.success){
      return res.status(result.status).json({message : result.message});
    }
    return res.status(result.status).json({message : result.message});



  } catch (e) {
    console.log(e);
    next(e);
  }
};


// const addtoCart = async (req, res, next) => {
//   try {
//     const { productId, quantity } = req.body;
//     const userId = req.user.id;
//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       cart = new Cart({ user: userId, items: [] });
//     }

//     const existingItemIndex = cart.items.findIndex(
//       (item) => item.productId.toString() === productId
//     );
//     if (existingItemIndex !== -1) {
//       cart.items[existingItemIndex].quantity += quantity;
//     } else {
//       cart.items.push({ productId, quantity: 1 });
//     }

//     await cart.save();
//     res.json(cart);
//   } catch (error) {
//     next(error);
//   }
// };

const addtoCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};


const deleteItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item !== productId
    );

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

const emptywishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "wishlist not found" });
    }

    wishlist.items = [];

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getwishlist,
  addTowishlist,
  addtoCart,
  deleteItem,
  emptywishlist,
};
