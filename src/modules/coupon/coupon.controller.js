const asyncHandler = require('express-async-handler');

/**@type {import ('mongoose').Model} */
const Coupon = require('./coupon.model');
const ApiError = require('../../shared/errors/ApiError');

const factory = require('../../shared/utils/handlers/handlerFactory');

/**
 * @route   POST /api/v1/coupons
 * @desc    Create new coupon
 * @access  private - Admin, Manager
 */
exports.createCoupon = factory.createOne(Coupon);

/**
 * @route   GET /api/v1/coupons
 * @desc    Get all Coupons
 * @access  private - Admin, Manager
 */
exports.getCoupons = factory.getAll(Coupon);


/**
 * @route   GET /api/v1/coupons/:id
 * @desc    Get specific Coupon
 * @access  private - Admin, Manager
 */
exports.getCoupon = factory.getOne(Coupon);

/**
 * @route   PUT /api/v1/coupons/:id
 * @desc    Update specific Coupon
 * @access  private - Admin, Manager
 */
exports.updateCoupon = factory.updateOne(Coupon);

/**
 * @route   DELETE /api/v1/coupons/:id
 * @desc    Delete specific Coupon
 * @access  private - Admin, Manager
 */
exports.deleteCoupon = factory.deleteOne(Coupon);

/**
 * @route   PATCH /api/v1/coupons/activate/:id
 * @desc    Activate a specific coupon (set isActive = true)
 * @access  Private - Admin, Manager
 */
exports.activateCoupon = async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
        return next(new ApiError('Coupon not found', 404));
    }

    coupon.isActive = true;
    await coupon.save();

    res.status(200).json({
        status: 'success',
        message: 'Coupon activated'
    });
};

/**
 * @route   PATCH /api/v1/coupons/deactivate/:id
 * @desc    Deactivate a specific coupon (set isActive = false)
 * @access  Private - Admin, Manager
 */
exports.deactivateCoupon = async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return next(new ApiError('Coupon not found', 404));

    coupon.isActive = false;
    await coupon.save();

    res.status(200).json({
        status: 'success',
        message: 'Coupon deactivated'
    });
};

