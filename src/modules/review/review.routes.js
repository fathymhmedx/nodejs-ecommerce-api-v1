const express = require('express');
const router = express.Router({ mergeParams: true });
const { setProductIdAndUserIdToBody, createFilterObj, createReview, getReviews, getReview, updateReview, deleteReview } = require('./review.controller');
const { createReviewValidator, getReviewValidator, updateReviewValidator, deleteReviewValidator } = require('./review.validators');
const { createReviewLimiter, updateReviewLimiter, deleteReviewLimiter } = require('./review.rateLimiter');

const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

/**
 * @route   POST /api/v1/reviews
 * @desc    Create new Review
 * @access  private (protect - user)
 */
router
    .route('/')
    .post(
        protect,
        authorizeRoles('user'),
        createReviewLimiter,
        setProductIdAndUserIdToBody,
        createReviewValidator,
        createReview
    )
    /**
    * @route   GET /api/v1/reviews
    * @desc    Get All Reviews
    * @access  public
    */
    .get(
        createFilterObj,
        getReviews
    )

/**
* @route   GET /api/v1/reviews/:id
* @desc    Get Specific Review
* @access  public
*/
router
    .route('/:id')
    .get(
        getReviewValidator,
        getReview
    )
    /**
    * @route   PUT /api/v1/reviews/:id
    * @desc    Update specific Review
    * @access  private (protect - user)
    */
    .put(
        protect,
        authorizeRoles('user'),
        updateReviewLimiter,
        updateReviewValidator,
        updateReview
    )
    /**
    * @route   Delete /api/v1/reviews/:id
    * @desc    Delete specific Review
    * @access  private (protect - user - admin - manager)
    */
    .delete(
        protect,
        authorizeRoles('user', 'manager', 'admin'),
        deleteReviewLimiter,
        deleteReviewValidator,
        deleteReview
    )

module.exports = router;