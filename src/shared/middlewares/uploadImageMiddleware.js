const ApiError = require('../../shared/errors/ApiError');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
// Filter: accept only images
const imageFilter = (req, file, cb) => {
    file.mimetype.startsWith('image')
        ? cb(null, true)
        : cb(new ApiError('Only images allowed', 400));
};

const upload = multer({ storage: multer.memoryStorage(), fileFilter: imageFilter });

exports.uploadSingleImage = (fieldName) => upload.single(fieldName);

exports.uploadFields = (fields) => upload.fields(fields);

exports.resizeAndSaveSingleImage = (folder, fieldName, width, height) =>
    asyncHandler(async (req, res, next) => {
        if (!req.file) return next();

        const uploadDir = path.join(__dirname, `../../uploads/${folder}`);
        await fs.promises.mkdir(uploadDir, { recursive: true });


        const fileName = `${fieldName}-${uuidv4()}-${Date.now()}.webp`;
        const uploadPath = path.join(uploadDir, fileName);
        await sharp(req.file.buffer)
            .resize(width, height)
            .toFormat('webp')
            .webp({ quality: 95 })
            .toFile(uploadPath);

        req.body[fieldName] = fileName;
        next();
    });

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
    const uploadDir = path.join(__dirname, '../../uploads/products');
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Image cover
    if (req.files.imageCover) {
        const imageCoverFileName = `product-cover-${uuidv4()}-${Date.now()}.webp`;
        const uploadPath = path.join(uploadDir, imageCoverFileName);
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('webp')
            .webp({ quality: 95 })
            .toFile(uploadPath);

        req.body.imageCover = imageCoverFileName;
    }

    // Multiple images
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (file, index) => {
                const fileName = `product-${uuidv4()}-${Date.now()}.webp`;
                const uploadPath = path.join(uploadDir, fileName);

                await sharp(file.buffer)
                    .resize(600, 600)
                    .toFormat('webp')
                    .webp({ quality: 95 })
                    .toFile(uploadPath);

                req.body.images.push(fileName);
            })
        );
    }

    next();
});
