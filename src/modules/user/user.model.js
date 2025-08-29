const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const slugifyPlugin = require('../../shared/utils/plugins/slugifyPlugin');
const imageUrlPlugin = require('../../shared/utils/plugins/imageUrlPlugin');

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
        trim: true,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, "Password must be at least 8 characters long"],
        select: false,
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


userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

userSchema.set('toObject', {
    transform: function (doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

userSchema.plugin(imageUrlPlugin, { folder: 'users', fields: ['profileImage'] });
userSchema.plugin(slugifyPlugin, { sourceField: 'name', slugField: 'slug' });

const User = mongoose.model('User', userSchema);
module.exports = User;