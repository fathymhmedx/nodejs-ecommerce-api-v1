const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const slugifyPlugin = require('../../shared/utils/plugins/slugifyPlugin');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'User name is required'],
    },
    slug: {
        type: String,
        lowercase: true,

    },
    email: {
        type: String,
        lowercase: true,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
    },
    password: {
        type: String,
        required: [true, 'Password must be unique'],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: String,
    profileImage: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
})

// pre-save hook
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    //hashing user password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next()
});


userSchema.plugin(slugifyPlugin, { sourceField: 'name', slugField: 'slug' });

const User = mongoose.model('User', userSchema);
module.exports = User;