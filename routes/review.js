const express = require('express');
const router = express.Router({ mergeParams:true  });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewsController = require('../controllers/reviews.js');

//Reviews Route
router.post('/',validateReview,isLoggedIn, wrapAsync(reviewsController.createReview));

//Delete Review Route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewsController.deleteReview));

module.exports = router;