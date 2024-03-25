const { json } = require("express");
const Product = require("../models/product");
const User = require("../models/User");
const {addReviewService} = require('../services/reviewServices');
const addReview = async (req, res, next) => {
    try {
        const { productData, newReview } = req.body;
        // const usr = await User.find({ email: newReview.userEmail });
        // let newNewReview = { ...newReview, "user": usr._id };
        // if (!productData || !newReview) {
        //     return res.status(400).json({ msg: "Missing Information" });
        // }
        // let currentReviews = productData.reviews;
        // currentReviews.push(newNewReview);
        // let newRatingCounts = { ...productData.ratingCounts };
        // newRatingCounts[`${newNewReview.rating}`] += 1
        // let newProduct = await Product.findByIdAndUpdate(productData._id, { reviews: currentReviews, ratingCounts: newRatingCounts });
        // console.log(newProduct);
        // res.status(201).json(newProduct);
        const result = await addReviewService(productData ,newReview);
        
        if(result.success){
           
            return res.status(result.status).json(result.newProduct);
        }

        return res.status(result.status).json({msg : result.message});
    } catch (error) {
        // console.log(error);
        next(error);

    }
}
module.exports = {
    addReview
};