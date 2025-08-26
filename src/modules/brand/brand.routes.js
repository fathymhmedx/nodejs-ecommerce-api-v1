const express = require('express');
const router = express.Router();
const { uploadBrandImage, resizeImage, createBrand, getBrands, getBrand, updateBrand, deleteBrand } = require('./brand.controller');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require('./brand.validators')
router
    .route('/')
    .post(
        uploadBrandImage,
        resizeImage,
        createBrandValidator,
        createBrand
    )
    .get(getBrands)

router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    .put(
        uploadBrandImage,
        resizeImage,
        updateBrandValidator,
        updateBrand
    )
    .delete(deleteBrandValidator, deleteBrand)


module.exports = router;