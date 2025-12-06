const express = require('express');
const router = express.Router();
const { createCashOrder, getOrders, getLoggedOrders, getLoggedUserOrderById, updateOrderStatusToPaid, updateOrderStatusToDelivered, GetCheckoutSession } = require('./order.controller');
const { createCashOrderValidator, getLoggedUserOrderByIdValidator, updateOrderStatusToDeliveredValidator, updateOrderStatusToPaidValidator, GetCheckoutSessionValidator } = require('./order.validators');
const { orderLimiter, checkoutLimiter } = require('./order.rateLimiter');
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

router.use(protect);

router
    .route('/checkout-session/:cartId')
    .get(
        authorizeRoles('user'),
        checkoutLimiter,
        GetCheckoutSessionValidator,
        GetCheckoutSession
    )
router
    .route("/:cartId")
    .post(
        authorizeRoles('user'),
        orderLimiter,
        createCashOrderValidator,
        createCashOrder
    )
/**
 * @desc  Get all orders - (admin & manager) 
 */

router
    .route('/')
    .get(
        authorizeRoles('admin', 'manager'),
        getOrders
    )
/**
 * @desc get logged-in user's orders - (user)
 */

router
    .route('/me')
    .get(
        authorizeRoles('user'),
        getLoggedOrders
    )

router
    .route('/me/:id')
    .get(
        authorizeRoles('user'),
        getLoggedUserOrderByIdValidator,
        getLoggedUserOrderById
    )

router
    .route('/:id/pay')
    .put(
        authorizeRoles('admin', 'manager'),
        updateOrderStatusToPaidValidator,
        updateOrderStatusToPaid
    )

router
    .route('/:id/deliver')
    .put(
        authorizeRoles('admin', 'manager'),
        updateOrderStatusToDeliveredValidator,
        updateOrderStatusToDelivered
    )

module.exports = router;