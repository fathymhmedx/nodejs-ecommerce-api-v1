const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'SubCategory name is required'],
        unique: [true, 'SubCategory name must be unique'],
        minlength: [2, "SubCategory name must be at least 3 characters long"],
        maxlength: [32, "SubCategory name must not exceed 32 characters"],
    },
    slug: {
        type: String,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'SubCategory must be belong to parent Category']
    },
}, {
    timestamps: true
})

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
