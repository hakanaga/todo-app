/*
** TODO APP, 2021
** todos.js
** File description:
** todos.js
*/

var todoService = require('./todo.query');
const express = require('express');
const router = express.Router();

var connection = require('./../../config/db');
var VerifyToken = require('./../../middleware/auth');

router.get('/', VerifyToken, todoService.todos);
router.get('/:id', VerifyToken, todoService.findTodoById);
router.put('/:id', VerifyToken, todoService.update);
router.delete('/:id', VerifyToken, todoService.delete);
router.post('/', VerifyToken, todoService.create);

module.exports = router;