const express = require("express")
const router = express.Router();

const { createCoupon, getCoupons, getCoupon, updateCoupon, deleteCoupon, activateCoupon, deactivateCoupon } = require('./coupon.controller');
const { createCouponValidator, updateCouponValidator, couponIdValidator } = require('../coupon/coupon.validators');
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

// Apply authorizeRoles for all routes.
router.use(protect, authorizeRoles('admin', 'manager'));

router
    .route('/')
    .get(
        getCoupons
    )
    .post(
        createCouponValidator,
        createCoupon
    )

router
    .route('/:id')
    .get(
        couponIdValidator,
        getCoupon
    )
    .put(
        updateCouponValidator,
        updateCoupon
    )
    .delete(
        couponIdValidator,
        deleteCoupon
    )

router
    .route('/activate/:id')
    .patch(
        couponIdValidator,
        activateCoupon
    );

router
    .route('/deactivate/:id')
    .patch(
        couponIdValidator,
        deactivateCoupon
    );


module.exports = router;