const express = require('express');
const router = express.Router();

const { uploadUserImage, resizeAndSaveSingleImage, createUser, getUsers, getUser, updateUser, changePassword, deleteUser } = require('./user.controller');
const { createUserValidator, getUserValidator, updateUserValidator, deleteUserValidator, changePasswordValidator } = require('./user.validators')
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

router.use(protect);

router
    .route('/')
    .get(
        authorizeRoles('admin', 'manager'),
        getUsers
    )
    .post(
        authorizeRoles('admin'),
        uploadUserImage,
        resizeAndSaveSingleImage,
        createUserValidator,
        createUser
    )

router
    .route('/:id')
    .get(
        authorizeRoles('admin'),
        getUserValidator,
        getUser
    )
    .put(
        authorizeRoles('admin'),
        uploadUserImage,
        resizeAndSaveSingleImage,
        updateUserValidator,
        updateUser
    )
    .delete(
        authorizeRoles('admin'),
        deleteUserValidator,
        deleteUser
    )



router
    .route('/:id/change-password')
    .put(
        changePasswordValidator,
        changePassword
    )

module.exports = router;