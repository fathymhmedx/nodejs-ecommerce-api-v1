const ApiError = require('../../errors/ApiError');
const ApiFeatures = require('../features/apiFeatures');
const asyncHandler = require('express-async-handler');

const pluralize = require('pluralize');

exports.createOne = (Model) =>
    asyncHandler(async (req, res) => {
        const doc = await Model.create(req.body);
        const modelName = Model.modelName.toLowerCase();

        res.status(201).json({
            status: 'success',
            data: {
                [modelName]: doc
            }
        })
    });

exports.getAll = (Model, populateOptions) =>
    asyncHandler(async (req, res) => {
        let filter = {};
        if (req.filterObj) {
            filter = req.filterObj;
        }

        const baseQuery = Model.find(filter);
        // Apply API Features (filtering, searching, sorting, field limiting, pagination)
        const features = new ApiFeatures(baseQuery, req.query)
            .filter()
            .search()
            .sort()
            .limitFields()

        // 1) Get total count first
        const total = await Model.countDocuments(features.mongooseQuery._conditions);

        // 2) Apply pagination after knowing total
        features.paginate(total);

        // If used populate
        if (populateOptions) {
            features.populate(populateOptions.path, populateOptions.select)
        }
        // 3) Run query (after pagination) in parallel with nothing else (but still scalable)
        const [docs] = await Promise.all([
            features.mongooseQuery,
        ]);

        const modelName = pluralize(Model.modelName.toLowerCase());

        res.status(200).json({
            status: 'success',
            meta: {
                ...features.paginationResult,
            },
            data: {
                [modelName]: docs
            }
        })
    });

exports.getOne = (Model, populateOptions) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        // 1) Build query
        const query = Model.findById(id);

        if (populateOptions) {
            query.populate(populateOptions.path, populateOptions.select)
        }
        // 2) Excute query
        const doc = await query;

        if (!doc) {
            return next(new ApiError(`No ${Model.modelName} found for id: ${id}`, 404));
        }

        const modelName = Model.modelName.toLowerCase();
        res.status(200).json({
            status: 'success',
            data: {
                [modelName]: doc
            }
        })
    });

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

        const modelName = Model.modelName.toLowerCase();

        res.status(200).json({
            status: 'success',
            data: {
                [modelName]: doc
            },
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
