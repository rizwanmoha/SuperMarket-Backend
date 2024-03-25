const Product = require("../models/product");

const getProductByIdService = async(productId) =>{
    try{
        const product = await Product.findById(productId);
        return {success : true , status : 200 , product};

    }
    catch(error){
        return {success : false , status : 500 , message : "Internal server error"};
    }
}

const getAllProductService = async() =>{
    try{
        const products = await Product.find();
        return {success : true ,status : 200 , products , message : "List of all products"};

    }
    catch(error){
        return {success : false , status : 500 , message : "Error while fetching the products"};
    }

}

module.exports = {getProductByIdService , getAllProductService};