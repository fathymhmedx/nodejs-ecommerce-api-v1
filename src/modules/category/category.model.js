const mongoose = require('mongoose');
const slugifyPlugin = require('../../shared/utils/plugins/slugifyPlugin');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: [true, "Category name must be unique"],
        trim: true,
        minlength: [3, "Category name must be at least 3 characters long"],
        maxlength: [32, "Category name must not exceed 32 characters"],
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: {
        type: String
    }
},{
    timestamps:true
});


categorySchema.plugin(slugifyPlugin, { sourceField: 'name', slugField: 'slug' });

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;