const Cart = require('../models/cart');
const {getCartService , addToCartService , removeFromCartservice} = require('../services/cartService');


const getCart = async (req, res , next) => {
    try {
        
        const user = req.user._id;
        const result = await getCartService(user);
        if(result.success){
            return  res.status(result.status).json(result.cart);
        }

        return res.status(result.status).json({message : result.message});
    } catch (error) {
        
        next(error);
    }
};

const addToCart = async (req, res , next) => {
  
  try {
    const { productId, quantity } = req.body;
    const user = req.user._id;

    const result = await addToCartService(productId ,quantity ,user);
    if(result.success){
        return res.status(result.status).json(result.cart);

    }

    return res.status(result.status).json({message : result.message});
    
  } catch (error) {
    
    next(error);
  }
};



const removeFromCart = async (req, res , next) => {
    
    try {
        const { productId } = req.params;
        const user = req.user._id;

        const result = await removeFromCartservice(productId , user);
        if(result.success){
            return res.status(result.status).json(result.cart);
        }

        return res.status(result.status).json({message : result.message});

      

    } catch (error) {
        
        next(error);
    }

};

module.exports = {getCart ,addToCart ,removeFromCart};
