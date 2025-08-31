const express = require('express');
const router = express.Router();

const { uploadUserImage, resizeAndSaveSingleImage, createUser, getUsers, getUser, updateUser, changePassword, deleteUser } = require('./user.controller');
const { createUserValidator, getUserValidator, updateUserValidator, deleteUserValidator, changePasswordValidator } = require('./user.validators')

router
    .route('/')
    .post(
        uploadUserImage,
        resizeAndSaveSingleImage,
        createUserValidator,
        createUser
    )
    .get(getUsers)

router
    .route('/:id')
    .get(
        getUserValidator,
        getUser
    )
    .put(
        uploadUserImage,
        resizeAndSaveSingleImage,
        updateUserValidator,
        updateUser
    )
    .delete(
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