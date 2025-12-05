const express = require('express');
const router = express.Router();
const { getPricingSetting, updatePricingSettings } = require('./pricingSettings.controller');
const { updatePricingSettingsValidator } = require('./pricingSettings.validators');
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

router.use(protect, authorizeRoles('admin'));

router
    .route('/')
    .get(
        getPricingSetting
    )
    .put(
        updatePricingSettingsValidator,
        updatePricingSettings
    )

module.exports = router;