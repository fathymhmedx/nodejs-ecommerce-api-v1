const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {
    return jwt.sign(
        { userId: payload },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
            algorithm: 'HS256'
        }
    );
};