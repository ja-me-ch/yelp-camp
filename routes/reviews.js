const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const reviewsController = require('../controllers/reviews');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../utils/middleware')



router.post('/', isLoggedIn, validateReview, catchAsync(reviewsController.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReview));

module.exports = router;