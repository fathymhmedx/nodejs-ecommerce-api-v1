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

exports.uploadSingleImage = (fieldName) => upload.single(fieldName)

// exports.uploadMultipleImage 

// Resize and save image(s)
exports.resizeAndSaveImage = (folder, width = 600, height = 600) =>
    asyncHandler(async (req, res, next) => {
        if (!req.file && !req.files) return next();

        const uploadDir = path.join(__dirname, `../../uploads/${folder}`);
        await fs.promises.mkdir(uploadDir, { recursive: true });

        // Single file
        if (req.file) {
            const fileName = `${folder}-${uuidv4()}-${Date.now()}.webp`;
            const uploadPath = path.join(uploadDir, fileName);

            await sharp(req.file.buffer)
                .resize(width, height)
                .toFormat('webp', { quality: 95 })
                .toFile(uploadPath);

            req.body.image = fileName;
        }

        // Multiple files
        if (req.files) {
            req.body.images = [];
            for (const file of req.files) {
                const fileName = `${folder}-${uuidv4()}-${Date.now()}.webp`;
                const uploadPath = path.join(uploadDir, fileName);

                await sharp(file.buffer)
                    .resize(width, height)
                    .toFormat('webp', { quality: 95 })
                    .toFile(uploadPath);

                req.body.images.push(fileName);
            }
        }

        next();
    });


