const jwt = require('jsonwebtoken');
const createToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}
module.exports = createToken;