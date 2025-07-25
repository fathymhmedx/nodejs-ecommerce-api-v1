// Responsible for dealing with the database only
/** @type {import('mongoose').Model} */
const brand = require('./brand.model');

// Create a new brand
exports.create = (data) => brand.create(data);

// Find all with optional filters and pagination (controlled by controller)
exports.findAll = (filter = {}, options = {}) => {
    const query = brand.find(filter);

    if (options.skip !== undefined) query.skip(options.skip);
    if (options.limit !== undefined) query.limit(options.limit);

    return query.lean();
}

// Count documents for pagination
exports.count = (filter = {}) => brand.countDocuments(filter); 

// Finf by Id 
exports.findById = (id) => brand.findById(id);

// Update by Id 
exports.updataById = (id, data) => {
    return brand.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
};

// Delete by Id
exports.deleteById = (id) => brand.findByIdAndDelete(id);