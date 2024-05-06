'use strict';

const JWT = require('jsonwebtoken');

const createKeyToken = (payload, accessPrivatekey) => {
    try {
        //create accessToken
        const accessToken = JWT.sign( payload, accessPrivatekey, {
            expiresIn: '7 day'
        });
        return accessToken;
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {
    createKeyToken
}