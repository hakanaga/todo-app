/*
** TODO APP, 2021
** auth.js
** File description:
** auth.js
*/

require('dotenv').config()
var jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {

    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).send({
            "msg": "No token, authorization denied"
        });

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err)
            return res.status(401).send({
                "msg": "Token is not valid"
            });

        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;