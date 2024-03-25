const Product = require("../models/product");
const User = require("../models/User");
const { json } = require("express");

const addReviewService = async(productData, newReview) =>{
    try{
        const usr = await User.find({ email: newReview.userEmail });
        let newNewReview = { ...newReview, "user": usr._id };
        if (!productData || !newReview) {
            // return res.status(400).json({ msg: "Missing Information" });
            return {success : false , status : 400 ,message : "Missing Information"};
        }
        let currentReviews = productData.reviews;
        currentReviews.push(newNewReview);
        let newRatingCounts = { ...productData.ratingCounts };
        newRatingCounts[`${newNewReview.rating}`] += 1
        let newProduct = await Product.findByIdAndUpdate(productData._id, { reviews: currentReviews, ratingCounts: newRatingCounts });
        // console.log(newProduct);
        // res.status(201).json(newProduct);
        return {success : true , status : 200 , newProduct};

    }
    catch(error){
        return {success : false , status : 500 , message : "Interval server error"};
    }

}

module.exports = {addReviewService};
