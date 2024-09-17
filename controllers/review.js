const Listing = require('../models/listing');
const Review = require('../models/reviews');
const {wrapAsync} = require('../util/wrapAsync');

module.exports.renderReviewPage=wrapAsync( async (req,res)=>{
    const {id} = req.params;
    res.redirect(`/listings/${id}`);
})


module.exports.createReview=wrapAsync( async (req,res)=>{
    const {id} = req.params;
    const data = req.body.data;
    const newReview = new Review({...data});
    newReview.owner = res.locals.currUser._id;
    await newReview.save();
    const listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await listing.save();    
    req.flash('success','Review created');
    res.redirect(`/listings/${id}`);
    console.log('Review Saved Successfully');
})


module.exports.deleteReview=wrapAsync(async(req,res)=>{
    const { id, reviewId} = req.params;
    const listing = await Listing.findByIdAndUpdate(id , { $pull: {reviews: reviewId}});
    await listing.save();
    const review = Review.findByIdAndDelete(reviewId);
    req.flash('success','Review deleted!');
    res.redirect(`/listings/${id}`);
})