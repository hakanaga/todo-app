/*
** TODO APP, 2021
** user.query.js
** File description:
** user.query.js
*/

var db = require('./../../config/db');
const bcrypt = require('bcryptjs');
const util = require('util');

require('dotenv').config()
var jwt = require('jsonwebtoken');

async function getTodos() {
    var str = 'SELECT * FROM todo';
    console.error('str', str);
    return await util.promisify(db.query).bind(db)(str).catch(error => {
        console.log("showAllFilters error: ");
        console.error(error);
    });
}

async function getUserByIdOrEmail(i) {
    var str = "";
    par = parseInt(i);
    if (!isNaN(par)) {
        str = 'SELECT * FROM user WHERE id =' + i;
    } else {
        str = 'SELECT * FROM user WHERE email ="' + i + '"';
    }
    return await util.promisify(db.query).bind(db)(str).catch(error => {
        console.log("showAllFilters error: ");
        console.error(error);
    });

}

var User = {
    findUserByIdOrEmail: async function(req, res, next) {
        console.log("req.params.id", req.params.id);
        const user = await getUserByIdOrEmail(req.params.id);
        if (user.length > 0) {
            console.log("iddddd", user[0].id);
            res.status(200).send(user[0]);
        } else {
            res.status(404).send({
                "msg": "Not found"
            });
        }
    },
    getAllUsers: async function(req, res) {
        var results = db.query('SELECT * from user', function(error, results, fields) {
            if (error) {
                console.log(error);
                res.status(500).send({
                    "msg": "internal server error"
                });
            }
            res.status(200).send(results);
        });
    },
    create: async function(req, res) {
        bcrypt.hash(req.body.password, 10, function(err, hash) {
            if (err) {
                console.log(err);
                res.status(500).send({
                    "msg": "internal server error"
                });
            } else {
                db.query('SELECT email FROM user WHERE email ="' + req.body.email + '"', function(err, result) {
                    if (err) {
                        res.status(500).send({
                            "msg": "internal server error"
                        });
                    }
                    if (result.length === 0) {
                        var str = 'INSERT INTO user (name, email, password,firstname) values("' + req.body.name + '","' + req.body.email + '","' + hash + '","' + req.body.firstname + '")';
                        db.query(str, function(err2, result2) {
                            if (err2) {
                                res.status(500).send({
                                    "msg": "internal server error"
                                });
                            } else {
                                var token = jwt.sign({
                                    id: result2.insertId
                                }, process.env.SECRET, {
                                    expiresIn: 86400
                                });

                                res.status(200).send({
                                    "token": token
                                });
                            }
                        });
                    } else {
                        res.status(409).send({
                            msg: "account already exists"
                        });
                    }
                });
            }
        });
    },
    test: function(req, res) {
        res.json("'test':'ok'");
    },
    login: async function(req, res) {
        const user = await getUserByIdOrEmail(req.body.email);
        if (user.length > 0) {
            try {
                var passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user[0].password
                );

                if (!passwordIsValid) {
                    return res.status(401).send({
                        "msg": "Invalid Credentials"
                    });
                }

                var token = jwt.sign({
                    id: user[0].id
                }, process.env.SECRET, {
                    expiresIn: 86400
                });

                res.status(200).send({
                    "token": token
                });
            } catch (err) {
                res.status(500).send({
                    "msg": "Invalid Credentials"
                });
            }
        } else {
            return res.status(404).send({
                "msg": "Invalid Credentials"
            });
        }
    },
    update: async function(req, res, next) {
        let hash = bcrypt.hashSync(req.body.password, 10);
        var str = 'UPDATE user set name = "' + req.body.name + '", email = "' + req.body.email + '", password = "' + hash + '",firstname = "' + req.body.firstname + '" where id =' + req.params.id;

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
                user = await getUserByIdOrEmail(req.params.id);
                res.status(200).send(user[0])
            }
        } catch (error) {
            res.status(500).send({
                "msg": "internal server error"
            });
        }
    },
    delete: async function(req, res, next) {
        var str = 'DELETE from todo where user_id=' + req.params.id;
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
            str = 'DELETE from user where id =' + req.params.id;
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
        } catch (error) {
            res.status(500).send({
                "msg": "internal server error"
            });
        }
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

module.exports = User;