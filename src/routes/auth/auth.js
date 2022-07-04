/*
** TODO APP, 2021
** auth.js
** File description:
** auth.js
*/

var userService = require('./../user/user.query');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.post('/register', userService.create);
router.post('/login', userService.login);

module.exports = router;