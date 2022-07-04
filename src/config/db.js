/*
** TODO APP, 2021
** db.js
** File description:
** db.js
*/

var mysql = require('mysql2');
require('dotenv').config()
var connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    dateStrings: true
});
connection.connect(function(error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log('Connected..!');
    }
});

module.exports = connection;