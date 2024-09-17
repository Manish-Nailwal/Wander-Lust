const express = require('express');
const router = express.Router({mergeParams: true});

const {isloggedIn , reviewValidation,isReviewOwner} = require('../util/middleware');
const reviewController=require('../controllers/review');

router.get('/',isloggedIn,reviewController.renderReviewPage)
//create
router.post('/',isloggedIn,reviewValidation,reviewController.createReview)


//delete
router.delete('/:reviewId',isloggedIn, isReviewOwner,reviewController.deleteReview)


module.exports = router;