const asyncHandler = require('express-async-handler');
const PricingSettings = require('./pricingSettings.model');
const ApiError = require('../../shared/errors/ApiError');

/**
 * @route   GET /api/v1/settings
 * @desc    Get tax & shipping price
 * @access  protected - admin
 */
exports.getPricingSetting = asyncHandler(async (req, res) => {
    const settings = await PricingSettings.findOne();
    res.status(200).json({
        status: "success",
        data: { settings }
    });
});

/**
 * @route   PUT /api/v1/settings
 * @desc    Admin update tax & shipping price
 * @access  protected - admin
 */
exports.updatePricingSettings = asyncHandler(async (req, res, next) => {
    const { taxPercentage, shippingPrice } = req.body;

    // Make sure at least one of the values ​​is available for updating
    if (taxPercentage === undefined && shippingPrice === undefined) {
        return next(new ApiError('Please provide taxPercentage or shippingPrice', 400));
    }

    // We usually only have one record for the settings
    let settings = await PricingSettings.findOne();
    if (!settings) {
        settings = await PricingSettings.create({ taxPercentage, shippingPrice });
    } else {
        if (taxPercentage !== undefined) settings.taxPercentage = taxPercentage;
        if (shippingPrice !== undefined) settings.shippingPrice = shippingPrice;
        await settings.save();
    }

    res.status(200).json({
        status: "success",
        data: {
            settings
        }
    });
});
