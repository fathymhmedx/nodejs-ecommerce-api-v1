const express = require('express');
const router = express.Router();

const { uploadUserImage, resizeAndSaveSingleImage, createUser, getUsers, getUser, updateUser, changePassword, deleteUser } = require('./user.controller');
const { createUserValidator, getUserValidator, updateUserValidator, deleteUserValidator, changePasswordValidator } = require('./user.validators')
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

router
    .route('/')
    .get(
        protect,
        authorizeRoles('admin', 'manager'),
        getUsers
    )
    .post(
        protect,
        authorizeRoles('admin'),
        uploadUserImage,
        resizeAndSaveSingleImage,
        createUserValidator,
        createUser
    )

router
    .route('/:id')
    .get(
        protect,
        authorizeRoles('admin'),
        getUserValidator,
        getUser
    )
    .put(
        protect,
        authorizeRoles('admin'),
        uploadUserImage,
        resizeAndSaveSingleImage,
        updateUserValidator,
        updateUser
    )
    .delete(
        protect,
        authorizeRoles('admin'),
        deleteUserValidator,
        deleteUser
    )



router
    .route('/:id/change-password')
    .put(
        protect,
        changePasswordValidator,
        changePassword
    )

module.exports = router;