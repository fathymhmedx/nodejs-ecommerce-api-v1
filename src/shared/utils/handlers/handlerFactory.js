const ApiError = require('../../errors/ApiError');
const ApiFeatures = require('../features/apiFeatures');
const asyncHandler = require('express-async-handler');

exports.updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;

        const doc = await Model.findByIdAndUpdate(id, req.body, {
            runValidators: true,
            new: true,
        });

        if (!doc) {
            return next(new ApiError(`No ${Model.modelName} found for id: ${id}`, 404));
        }

        res.status(200).json({
            status: 'success',
            data: doc,
        });
    });


exports.deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const doc = await Model.findByIdAndDelete(id);

        if (!doc) {
            return next(new ApiError(`No ${Model.modelName} found for id: ${id}`, 404));
        }

        res.status(200).json({
            status: 'success',
            message: `${Model.modelName} deleted successfully`,
        });
    });
