const express = require('express');
const router = express.Router();

const { uploadUserImage, resizeAndSaveSingleImage, createUser, getUsers, getUser, updateUser, deleteUser } = require('./user.controller');
const { } = require('./user.validators')

router
    .route('/')
    .post(
        uploadUserImage,
        resizeAndSaveSingleImage,
        // createUserValidator,
        createUser
    )
    .get(getUsers)

router
    .route('/:id')
    .get(
        // getUserValidator,
        getUser
    )
    .put(
        uploadUserImage,
        resizeAndSaveSingleImage,
        // updateUserValidator,
        updateUser
    )
    .delete(
        // deleteUserValidator,
        deleteUser
    )




module.exports = router;