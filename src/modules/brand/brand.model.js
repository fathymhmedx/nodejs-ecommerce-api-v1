const mongoose = require('mongoose');
const slugifyPlugin = require('../../shared/utils/plugins/slugifyPlugin');

const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Brand name is required"],
        unique: [true, "Brand name must be unique"],
        trim: true,
        minlength: [3, "Brand name must be at least 3 characters long"],
        maxlength: [32, "Brand name must not exceed 32 characters"],
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: {
        type: String
    },

}, {
    timestamps: true
})

brandSchema.plugin(slugifyPlugin, { sourceField: 'name', slugField: 'slug' });

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;