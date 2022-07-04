/*
** TODO APP, 2021
** user.js
** File description:
** user.js
*/

var userService = require('./user.query');
const express = require('express');
const router = express.Router();

var connection = require('./../../config/db');
var VerifyToken = require('./../../middleware/auth');

router.get('/todos', VerifyToken, userService.todos);
router.get('/', VerifyToken, userService.getAllUsers);
router.get('/:id', VerifyToken, userService.findUserByIdOrEmail);
router.put('/:id', VerifyToken, userService.update);
router.delete('/:id', VerifyToken, userService.delete);


module.exports = router;