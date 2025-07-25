const mongoose = require('mongoose');

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
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);
module.exports = User;