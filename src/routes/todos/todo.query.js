/*
** TODO APP, 2021
** todo.query.js
** File description:
** todo.query.js
*/

var db = require('./../../config/db');
const bcrypt = require('bcryptjs');
const util = require('util');

require('dotenv').config()
var jwt = require('jsonwebtoken');


async function getTodoById(i) {
    var str = "";
    str = 'SELECT * FROM todo WHERE id =' + i;
    console.error("str", str);
    return await util.promisify(db.query).bind(db)(str).catch(error => {
        console.log("showAllFilters error: ");
        console.error(error);
    });
}

async function getTodos() {
    var str = 'SELECT * FROM todo';
    return await util.promisify(db.query).bind(db)(str).catch(error => {
        console.log("showAllFilters error: ");
        console.error(error);
    });
}

var Todo = {
    findTodoById: async function(req, res, next) {
        console.log("req.params.id", req.params.id);
        try {
            const todo = await getTodoById(req.params.id);
            if (todo.length > 0) {
                console.log("iddddd", todo[0].id);
                res.status(200).send(todo[0]);
            } else {
                res.status(404).send({
                    "msg": "Not found"
                });
            }
        } catch (error) {
            res.status(500).send({
                "msg": "internal server error"
            });
        }
    },

    create: async function(req, res) {
        var str = 'INSERT INTO todo (title, description,due_time, user_id,status) values("' + req.body.title + '","' + req.body.description + '","' + req.body.due_time + '","' + req.body.user_id + '","' + req.body.status + '")';
        console.log("str", str);
        let promise = new Promise((resolve, reject) => {
            db.query(str, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        try {
            let p = await promise;
            const todos = await getTodos();
            res.status(200).send(todos)
        } catch (error) {
            res.status(500).send({
                "msg": "internal server error"
            });
        }
    },

    update: async function(req, res, next) {
        var str = 'UPDATE todo set title = "' + req.body.title + '", description = "' + req.body.description + '", due_time = "' + req.body.due_time + '",user_id = "' + req.body.user_id + '",status = "' + req.body.status + '" where id =' + req.params.id;
        console.log("str", str);

        let promise = new Promise((resolve, reject) => {
            db.query(str, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        try {
            let p = await promise;
            if (p.affectedRows != 1) {
                res.status(404).send({
                    "msg": "Not found"
                });
            } else {
                todo = await getTodoById(req.params.id);
                res.status(200).send(todo[0])
            }
        } catch (error) {
            res.status(500).send({
                "msg": "internal server error"
            });
        }
    },
    delete: async function(req, res, next) {
        var str = 'DELETE from todo where id=' + req.params.id;
        console.log("str", str);

        db.query(str, function(err, result) {
            if (err) {
                res.status(500).send({
                    "msg": "internal server error"
                });
            } else {
                if (result.affectedRows == 1) {
                    res.status(200).send({
                        "msg": "succesfully deleted record number: {" + req.params.id + "}"
                    })
                } else {
                    res.status(404).send({
                        "msg": "Not found"
                    });
                }
            }
        });
    },
    todos: async function(req, res) {

        try {
            const todos = await getTodos();
            res.status(200).send(todos)
        } catch (error) {
            res.status(500).send({
                "msg": "internal server error"
            });
        }

    }
};


module.exports = Todo;