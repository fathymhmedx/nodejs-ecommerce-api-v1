const express = require('express');
const router = express.Router();
const { createBrand, getBrands, getBrand, updateBrand, deleteBrand } = require('./brand.controller');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require('./brand.validators')
router
    .route('/')
    .post(createBrandValidator, createBrand)
    .get(getBrands)

router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    .put(updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand)


module.exports = router;