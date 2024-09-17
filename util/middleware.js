
const {reviewSchema} = require('./schema');
const {listingSchema} = require('./schema');
const { wrapAsync } = require('./wrapAsync');
const Listing = require('../models/listing');
const Review = require('../models/reviews');

module.exports.isloggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error','You must be login!');
        res.redirect('/login');
    }else{
        next();
    }
}
module.exports.redirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        return next();
    }else{
        return next();
    }
}
module.exports.listValidation=function(req, res, next) {
    const result = listingSchema.validate(req.body);
    if (result.error) {
        throw (400, result.error);
    }
    next();
}
module.exports.reviewValidation=function(req, res, next) {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
        throw (400, result.error);
    }
    next();
}
module.exports.isOwner=wrapAsync(async(req,res,next)=>{
    const { id } = req.params;
    const list = await Listing.findById(id);
    if(!list){
        req.flash("error","List doesn't exist!");
        return res.redirect(`/listings`);
    }
    if(!list.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you don't have autherization!");
        return res.redirect(`/listings/${id}`);
    }
    return next();
})
module.exports.isReviewOwner=wrapAsync(async(req,res,next)=>{
    const { id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.owner._id.equals(res.locals.currUser._id)){
        req.flash('error',"You don't have authorization!");
        return res.redirect(`/listings/${id}`);
    }
    return next();
})