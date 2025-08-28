const express = require('express');
const router = express.Router();
const { uploadBrandImage, resizeAndSaveSingleImage, createBrand, getBrands, getBrand, updateBrand, deleteBrand } = require('./brand.controller');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require('./brand.validators')
router
    .route('/')
    .post(
        uploadBrandImage,
        resizeAndSaveSingleImage,
        createBrandValidator,
        createBrand
    )
    .get(getBrands)

router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    .put(
        uploadBrandImage,
        resizeAndSaveSingleImage,
        updateBrandValidator,
        updateBrand
    )
    .delete(deleteBrandValidator, deleteBrand)


module.exports = router;