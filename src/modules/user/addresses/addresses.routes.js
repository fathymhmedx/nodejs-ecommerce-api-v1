const express = require('express');
const router = express.Router();

const { addaddress, removeAddress, getLoggedUseraddresses } = require('./addresses.controller');
const { addAddressValidator, removeAddressValidator } = require('../addresses/addresses.validators');
const { protect, authorizeRoles } = require('../../../shared/middlewares/authMiddleware');

router.use(protect, authorizeRoles('user'));

router
    .route('/')
    .post(
        addAddressValidator,
        addaddress
    )
    .get(
        getLoggedUseraddresses
    )
router
    .route('/:addressId')
    .delete(
        removeAddressValidator,
        removeAddress
    )

module.exports = router;