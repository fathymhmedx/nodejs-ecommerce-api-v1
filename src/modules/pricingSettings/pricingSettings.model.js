const mongoose = require('mongoose');

const pricingSettingsSchema = mongoose.Schema({
    taxPercentage: {
        type: Number,
        default: 14
    },
    shippingPrice: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const PricingSettings = mongoose.model('PricingSettings', pricingSettingsSchema);
module.exports = PricingSettings;
