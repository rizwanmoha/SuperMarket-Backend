const Cart = require('../models/cart');

const getCartService = async(user) =>{
    try{
        const cart = await Cart.findOne({user : user}).populate('items.product');
        return {success : true , status : 200 , message : "Cart items" , cart};

    }
    catch(error){

        return {success : false , status : 500 , message : "Internal server error"};
    }
}

const addToCartService = async(productId ,quantity , user) =>{
    try{
        let cart = await Cart.findOne({user : user});
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }
  
        
        const existingItemIndex = cart.items.findIndex(item => item.product == productId);
  
        if (existingItemIndex !== -1) {
          
            cart.items[existingItemIndex].quantity += parseInt(quantity, 10); // Set quantity to the new value
        } else {
            
            cart.items.push({ product: productId, quantity });
        }
        
        await cart.save();
        

        return {success : true , status : 200 , cart , message : "Cart details"};

    }
    catch(error){
        return {success : false , status : 500 , message : "Internal server error"};
    }
}

const removeFromCartservice = async(productId , user) =>{
    try{
        let cart = await Cart.findOne({ user: user });

        if (!cart) {
            
            return {success : false , status : 404 , message: 'Cart not found'};
        }

        cart.items = cart.items.filter(item => item.product != productId);
        await cart.save();
        
        return  {success : true , cart ,status : 200 , message : "item remove from the cart"};

    }
    catch(error){
        return {success : false , status : 500 , message: 'Internal server error'};
    }
}

module.exports = {getCartService , addToCartService , removeFromCartservice};