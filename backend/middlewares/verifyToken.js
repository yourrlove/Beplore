const { AuthFailureError, ForbiddenRequestError } = require('../core/error.response');
const JWT = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) throw new AuthFailureError('Unauthorized request');
    JWT.verify(token, process.env.ACCESS_TOKEN_KEY_SECRET, (err, decoded) => {
        if (err) throw new ForbiddenRequestError('Unauthorized request');
        req.user = decoded;
        next();
    });
}

module.exports = {
    verifyToken
}