/*
** TODO APP, 2021
** index.js
** File description:
** index.js
*/

require('dotenv').config({
  path: __dirname + '/.env'
})
const express = require('express');
var path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const errorHandler = require('./middleware/notFound');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var userRouter = require('./routes/user/user');
app.use('/user', userRouter);
app.use('/', require('./routes/auth/auth'));
app.use('/todo', require('./routes/todos/todos'));
app.use(errorHandler);
app.listen(3000, () => console.log('Example app listening on port 3000!'))