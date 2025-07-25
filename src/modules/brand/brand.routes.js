const express = require('express');
const router = express.Router();
const { createBrand, getBrands, getBrand, updateBrand, deleteBrand } = require('../controllers/brandController');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require('../validators/brandValidators')
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