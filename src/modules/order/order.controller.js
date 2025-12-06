const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const asyncHandler = require('express-async-handler');

const mongoose = require('mongoose');

/**@type {import ('mongoose').Model} */
const Order = require('./order.model');
/**@type {import ('mongoose').Model} */
const Cart = require('../cart/cart.model');
/**@type {import ('mongoose').Model} */
const Product = require('../product/product.model');
/**@type {import ('mongoose').Model} */
const PricingSettings = require('../pricingSettings/pricingSettings.model');

const ApiError = require('../../shared/errors/ApiError');
const factory = require('../../shared/utils/handlers/handlerFactory');
/*
*   (Mongoose(MongoDB) = Transactions + atomic operations) => They solve overselling problems
*/

/**
 * @route   POST /api/v1/orders/:cartId
 * @desc    Create cash order 
 * @access  protected - user
 */
exports.createCashOrder = asyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // app setting (Admin can be add taxPrice and shippingPrice)
        const settings = await PricingSettings.findOne();
        const shippingPrice = settings?.shippingPrice || 0;
        const taxPercentage = settings?.taxPercentage || 14;

        const { cartId } = req.params;

        // 1) Get cart depend on cartId
        const cart = await Cart.findById(cartId).session(session);
        if (!cart) {
            return next(new ApiError(`There is no cart with this id: ${cartId}`, 404));
        }

        // Ownership Check
        if (cart.user.toString() !== req.user._id.toString()) {
            return next(new ApiError('You are not allowed to access this cart', 403))
        }

        // 2) Get order price depend on cart price "Check if coupon applied"

        const cartPrice = cart.isDiscountApplied === false
            ? cart.totalCartPrice
            : cart.totalPriceAfterDiscount;

        const taxPrice = (cartPrice * taxPercentage) / 100;
        const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

        // 3) Create order with default paymentMethodType("cash")
        const order = await Order.create([{
            user: req.user._id,
            cartItems: cart.cartItems,
            shippingAddress: req.body.shippingAddress,
            totalOrderPrice
        }], {
            session
        });

        // 4) After creating order (Update stock using bulkWrite), decrement product quantity and increment product sold

        const bulkOption = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: {
                    $inc: {
                        quantity: -item.quantity,
                        sold: item.quantity
                    }
                },
            },
        }));

        const bulkResult = await Product.bulkWrite(bulkOption, { session });

        // Check overselling
        if (bulkResult.modifiedCount !== cart.cartItems.length) {
            return next(new ApiError("One of the products is out of stock", 400));
        }

        // 5) Clear cart depend on cartId  
        await Cart.findByIdAndDelete(cartId).session(session);

        // 6) Commit transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            status: "success",
            data: {
                order: order[0]
            }
        });

    } catch (err) {
        // Rollback all DB writes
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
});

/**
 * @route   GET /api/v1/orders
 * @desc    Get all orders
 * @access  protected - Admin
 */

exports.getOrders = factory.getAll(Order, [
    { path: 'user', select: 'name email profileImage phone' },
    { path: 'cartItems.product', select: 'title price imageCover' }
]);

/**
 * @route   GET /api/v1/orders
 * @desc    Get Logged user orders
 * @access  protected - user
 */
exports.getLoggedOrders = asyncHandler(async (req, res, next) => {
    const order = await Order.find({ user: req.user._id });

    if (!order) {
        return next(new ApiError(`No found orders for this user: ${req.user._id}`, 404));
    }

    res.status(200).json({
        status: "success",
        results: order.length,
        data: {
            order
        }
    })
});

/**
 * @route   GET /api/v1/orders
 * @desc    Get Logged user order
 * @access  protected - user
 */

exports.getLoggedUserOrderById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findOne({
        _id: id,
        user: req.user._id,
    });

    if (!order) {
        return next(new ApiError("Order not found or you don't have access to it", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            order
        }
    })
});

/**
 * @route   PUT /api/v1/orders/:id/pay
 * @desc    Update order paid status 
 * @access  protected - admin, manager
 */

exports.updateOrderStatusToPaid = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
        return next(new ApiError(`No order found for this id: ${id}`, 404));
    }

    // Update order to paid
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({
        status: "success",
        data: {
            updatedOrder
        }
    })
});

/**
 * @route   PUT /api/v1/orders/:id/deliver
 * @desc    Update order delivered status 
 * @access  protected - admin, manager
 */
exports.updateOrderStatusToDelivered = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
        return next(new ApiError(`No order found for this id: ${id}`, 404));
    }

    // Update order to delivered
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({
        status: "success",
        data: {
            updatedOrder
        }
    })
});

/**
 * @route   GET /api/v1/orders/checkout-session/:cartId
 * @desc    Get checkout session from stripe and send it as response
 * @access  protected - user
 */
exports.GetCheckoutSession = asyncHandler(async (req, res, next) => {
    // app setting (Admin can be add taxPrice and shippingPrice)
    const settings = await PricingSettings.findOne();
    const shippingPrice = settings?.shippingPrice || 0;
    const taxPercentage = settings?.taxPercentage || 14;

    const { cartId } = req.params;

    // 1) Get cart depend on cartId
    const cart = await Cart.findById(cartId);
    if (!cart) {
        return next(new ApiError(`There is no cart with this id: ${cartId}`, 404));
    }

    // Ownership Check
    if (cart.user.toString() !== req.user._id.toString()) {
        return next(new ApiError('You are not allowed to access this cart', 403))
    }

    // 2) Get order price depend on cart price "Check if coupon applied"

    const cartPrice = cart.isDiscountApplied === false
        ? cart.totalCartPrice
        : cart.totalPriceAfterDiscount;

    const taxPrice = (cartPrice * taxPercentage) / 100;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    // 3) Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: 'Your Order',
                        description: `Order for user ${req.user.name}`
                    },
                    unit_amount: Math.round(totalOrderPrice * 100) // piasters(القرش)
                },
                quantity: 1
            }
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: req.user.email,
        client_reference_id: cartId,
        metadata: {
            userId: req.user._id.toString()
        }
    });

    // 4) Send session to response
    res.status(200).json({
        status: "success",
        data: {
            session
        }
    })
});



/**
* @desc Create an order from Stripe session safely, Prevent duplicates and manage stock atomically
*/
const createCardOrder = async (session) => {
    const sessionDb = await mongoose.startSession();
    sessionDb.startTransaction();

    try {
        const settings = await PricingSettings.findOne().session(sessionDb);
        const shippingPrice = settings?.shippingPrice || 0;
        const taxPercentage = settings?.taxPercentage || 14;

        const cartId = session.client_reference_id;
        const userId = session.metadata.userId;

        // 1) Check for existing order for this Stripe session
        const existingOrder = await Order.findOne({ stripeSessionId: session.id }).session(sessionDb);
        if (existingOrder) return existingOrder;

        // 2) Get cart
        const cart = await Cart.findById(cartId).session(sessionDb);
        if (!cart) throw new Error(`No cart found with id: ${cartId} `);

        // 3) Calculate total
        const cartPrice = cart.isDiscountApplied === false
            ? cart.totalCartPrice
            : cart.totalPriceAfterDiscount;

        const taxPrice = (cartPrice * taxPercentage) / 100;
        const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

        // 4) Create order
        const order = await Order.create([{
            user: userId,
            cartItems: cart.cartItems,
            shippingAddress: cart.shippingAddress || {},
            totalOrderPrice,
            paymentMethodType: "card",
            isPaid: true,
            paidAt: Date.now(),
            stripeSessionId: session.id
        }], { session: sessionDb });

        // 5) Update stock atomically
        const bulkOption = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: item.quantity } }
            }
        }));
        const bulkResult = await Product.bulkWrite(bulkOption, { session: sessionDb });

        if (bulkResult.modifiedCount !== cart.cartItems.length) {
            throw new Error("One of the products is out of stock");
        }

        // 6) Delete cart
        await Cart.findByIdAndDelete(cartId).session(sessionDb);

        // 7) Commit transaction
        await sessionDb.commitTransaction();
        sessionDb.endSession();

        return order[0];

    } catch (err) {
        await sessionDb.abortTransaction();
        sessionDb.endSession();
        throw err;
    }
};

/**
* @desc Stripe webhook handler, Handles checkout.session.completed, Prevents duplicate orders
  */
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);
    } catch (err) {
        console.log(err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        if (process.env.NODE_ENV === 'development') {
            console.log("Checkout Session Completed:", session.id);
            console.log("Cart ID:", session.client_reference_id);
            console.log("User ID:", session.metadata.userId);
        }

        try {
            const order = await createCardOrder(session);
            if (process.env.NODE_ENV === 'development') {
                console.log("Order created from Stripe webhook:", order._id);
            }
        } catch (err) {
            console.error("Error creating order from webhook:", err.message);
        }

    }

    res.status(200).json({ received: true });
});
