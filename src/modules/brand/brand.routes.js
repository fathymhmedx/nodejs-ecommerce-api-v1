const express = require('express');
const router = express.Router();
const { uploadBrandImage, resizeAndSaveSingleImage, createBrand, getBrands, getBrand, updateBrand, deleteBrand } = require('./brand.controller');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require('./brand.validators')
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');


router
    .route('/')
    .get(getBrands)
    .post(
        protect,
        authorizeRoles('admin', 'manager'),
        uploadBrandImage,
        resizeAndSaveSingleImage,
        createBrandValidator,
        createBrand
    )

router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    .put(
        protect,
        authorizeRoles('admin', 'manager'),
        uploadBrandImage,
        resizeAndSaveSingleImage,
        updateBrandValidator,
        updateBrand
    )
    .delete(
        protect,
        authorizeRoles('admin'),
        deleteBrandValidator,
        deleteBrand
    )


module.exports = router;