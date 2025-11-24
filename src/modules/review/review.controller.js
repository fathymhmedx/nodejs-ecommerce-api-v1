/** @type {import('mongoose').Model} */
const Review = require('../review/review.model');
const factory = require('../../shared/utils/handlers/handlerFactory');

// middleware: set productId aand userId in body if coming from nested route;
exports.setProductIdAndUserIdToBody = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;

    next();
};

// Nested Route GET /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
    let filterObj = {};

    if (req.params.productId) filterObj = { product: req.params.productId };

    req.filterObj = filterObj;
    next();
}

/**
 * @route   POST /api/v1/reviews
 * @desc    Create new Review
 * @access  private (protect - user)
 */
exports.createReview = factory.createOne(Review);

/**
 * @route   GET /api/v1/reviews
 * @desc    Get All Reviews
 * @access  public
 */
exports.getReviews = factory.getAll(Review);

/**
 * @route   GET /api/v1/reviews/:id
 * @desc    Get Specific Review
 * @access  public
 */
exports.getReview = factory.getOne(Review);

/**
 * @route   PUT /api/v1/reviews/:id
 * @desc    Update specific Review
 * @access  private (protect - user)
 */
exports.updateReview = factory.updateOne(Review);

/**
 * @route   Delete /api/v1/reviews/:id
 * @desc    Delete specific Review
 * @access  private (protect - user - admin - manager)
 */
exports.deleteReview = factory.deleteOne(Review);